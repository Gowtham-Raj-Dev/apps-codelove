package com.codelove.apps

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.addCallback
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import com.codelove.apps.databinding.ActivityMainBinding
import org.json.JSONObject

/**
 * Codelove app shell.
 *
 * A thin native shell around one CodeLove web app or game — which one, and how it
 * behaves, is decided by the product flavor (BuildConfig.*, see build.gradle.kts and
 * the "android" block of each app in src/data/apps.js).
 *
 * The shell adds what a WebView cannot do on its own:
 *  - games: landscape lock (manifest), immersive full screen, screen kept on,
 *    sound without a tap, back button and pause/resume handed to the game
 *  - tools: file picker for <input type="file">, downloads (blob:, data: and http)
 *    saved to the Downloads folder, embed CSS that hides the site footer and ads
 *  - clipboard bridge, "Share to <app>", offline screen, splash screen
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val webView: WebView get() = binding.webView

    /** Text received via Share / Process Text, delivered once the page is ready. */
    private var pendingClip: String? = null
    private var pageReady = false
    private var showingOffline = false

    /** Hosts that stay inside the WebView; everything else opens in the browser. */
    private val allowedHosts: Set<String> by lazy {
        (BuildConfig.EXTRA_HOSTS.split(',') + BuildConfig.APP_HOST)
            .map { it.trim().lowercase() }
            .filter { it.isNotEmpty() }
            .toSet()
    }

    private fun isAllowedHost(host: String?) = host != null && host.lowercase() in allowedHosts

    // <input type="file"> → Android file picker
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private val filePicker = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        fileCallback?.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data))
        fileCallback = null
    }

    // HTML5 full-screen video (<video> full screen button)
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null

    private var lastBackPress = 0L

    private lateinit var ads: AdsManager

    /**
     * Full screen, landscape game mode. Fixed per app for the single-app shells; in the hub
     * (BuildConfig.HUB) it follows the page: on for game play pages, off everywhere else.
     */
    private var immersive = BuildConfig.IMMERSIVE

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Keep the splash up until the first page has loaded (or 2.5s, whichever comes first)
        val splashStart = System.currentTimeMillis()
        splash.setKeepOnScreenCondition {
            !pageReady && !showingOffline && System.currentTimeMillis() - splashStart < 2500
        }

        if (immersive) {
            // Games: the page gets the whole screen (it handles notches with env(safe-area-inset-*))
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            hideSystemBars()
        }
        // Edge-to-edge: outside game mode, pad the root by the system bars + keyboard so the web app is never covered
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { view, insets ->
            if (immersive) {
                view.setPadding(0, 0, 0, 0)
            } else {
                val bars = insets.getInsets(
                    WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout() or WindowInsetsCompat.Type.ime(),
                )
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            }
            insets
        }

        setUpWebView()
        ads = AdsManager(this, binding.adContainer, webView)
        ads.start()

        onBackPressedDispatcher.addCallback(this) { handleBack() }

        pendingClip = extractSharedText(intent)

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            loadApp(startUrl(intent))
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val text = extractSharedText(intent)
        if (text != null) {
            pendingClip = text
            // Apps that take shared links as a URL parameter need a fresh page load
            if (shareUrlFor(text) != null) loadApp(startUrl(intent)) else deliverPendingClip()
        } else if (intent.action == Intent.ACTION_VIEW) {
            loadApp(startUrl(intent))
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onStart() {
        super.onStart()
        if (::ads.isInitialized) ads.onStart()
    }

    override fun onStop() {
        if (::ads.isInitialized) ads.onStop()
        super.onStop()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        ads.onResume()
        notifyPage("resume")
        if (immersive) hideSystemBars()
    }

    override fun onPause() {
        // Tell the game first so it can pause itself and its music, then pause the WebView
        notifyPage("pause")
        ads.onPause()
        webView.onPause()
        super.onPause()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        // The bars come back after a dialog, the keyboard or a swipe from the edge
        if (hasFocus && immersive) hideSystemBars()
    }

    /**
     * Hub only: switch between game mode (games.codelove.in/<game>/play/: landscape, full screen,
     * screen on) and app mode (the store and the tools: any orientation, system bars shown).
     */
    private fun applyPageMode(url: String?) {
        if (!BuildConfig.HUB || url == null) return
        val uri = Uri.parse(url)
        if (uri.scheme == "file") return // the offline page keeps the current mode
        val game = uri.host.equals(GAMES_HOST, ignoreCase = true) && GAME_PLAY_PATH.matches(uri.path ?: "")
        if (game == immersive) return
        immersive = game
        if (game) {
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            hideSystemBars()
        } else {
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
            window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            WindowCompat.getInsetsController(window, window.decorView).show(WindowInsetsCompat.Type.systemBars())
        }
        ViewCompat.requestApplyInsets(binding.root)
    }

    override fun onDestroy() {
        fileCallback?.onReceiveValue(null)
        fileCallback = null
        ads.onDestroy()
        webView.removeJavascriptInterface(BRIDGE_NAME)
        webView.destroy()
        super.onDestroy()
    }

    private fun hideSystemBars() {
        WindowCompat.getInsetsController(window, window.decorView).apply {
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            hide(WindowInsetsCompat.Type.systemBars())
        }
    }

    // ---------------------------------------------------------------------
    // WebView

    @SuppressLint("SetJavaScriptEnabled")
    private fun setUpWebView() {
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true            // localStorage / IndexedDB — saved games, clips, settings
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            allowFileAccess = false             // assets (offline page) still load without this
            allowContentAccess = false
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            loadWithOverviewMode = true
            useWideViewPort = true
            // Games start their music without waiting for a tap; tools keep the browser default
            mediaPlaybackRequiresUserGesture = !(BuildConfig.IMMERSIVE || BuildConfig.HUB)
            val extra = BuildConfig.UA_TOKEN.takeIf { it.isNotEmpty() }?.let { " $it" } ?: ""
            userAgentString = "$userAgentString CodeloveApp/${BuildConfig.APP_ID}/${BuildConfig.VERSION_NAME}$extra"
        }

        // The web apps pick their own theme; stop the WebView from auto-darkening them
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(webView.settings, false)
        }

        webView.setBackgroundColor(getColor(R.color.surface))
        webView.overScrollMode = View.OVER_SCROLL_NEVER
        webView.addJavascriptInterface(NativeBridge(this, { loadApp() }, ::downloadUrl, { runOnUiThread { ads.showInterstitial() } }), BRIDGE_NAME)

        // Embed CSS + download hooks, in place before the page's own scripts run
        if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            WebViewCompat.addDocumentStartJavaScript(webView, pageScript(), setOf("*"))
        }

        webView.setDownloadListener { url, _, contentDisposition, mimeType, _ ->
            when {
                // A blob:/data: download the page hooks did not catch (the file name is not known here)
                url.startsWith("blob:") || url.startsWith("data:") ->
                    webView.evaluateJavascript("window.__codeloveSave && window.__codeloveSave(${JSONObject.quote(url)}, '')", null)
                else -> downloadUrl(url, URLUtil.guessFileName(url, contentDisposition, mimeType))
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, newProgress: Int) {
                binding.progress.progress = newProgress
                binding.progress.visibility = if (newProgress in 1..99) View.VISIBLE else View.GONE
            }

            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams,
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    val intent = params.createIntent().apply {
                        if (params.mode == FileChooserParams.MODE_OPEN_MULTIPLE) putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    }
                    filePicker.launch(Intent.createChooser(intent, getString(R.string.choose_file)))
                    true
                } catch (_: ActivityNotFoundException) {
                    fileCallback = null
                    false
                }
            }

            override fun onShowCustomView(view: View, callback: CustomViewCallback) {
                if (customView != null) {
                    callback.onCustomViewHidden()
                    return
                }
                customView = view
                customViewCallback = callback
                binding.root.addView(view, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
                webView.visibility = View.INVISIBLE
                hideSystemBars()
            }

            override fun onHideCustomView() {
                val view = customView ?: return
                binding.root.removeView(view)
                customView = null
                customViewCallback?.onCustomViewHidden()
                customViewCallback = null
                webView.visibility = View.VISIBLE
                if (!immersive) {
                    WindowCompat.getInsetsController(window, window.decorView).show(WindowInsetsCompat.Type.systemBars())
                }
            }
        }

        webView.webViewClient = object : WebViewClient() {

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                val scheme = url.scheme ?: return false
                // Our own pages (and the bundled offline page) stay inside the WebView
                if (scheme == "file" || scheme == "blob" || scheme == "data") return false
                if ((scheme == "https" || scheme == "http") && isAllowedHost(url.host)) return false
                // Frames inside the page (embeds, payment and sign-in widgets) load where they are
                if (!request.isForMainFrame) return false
                // Everything else (other sites, mailto:, tel:, intent:) goes to the system
                openExternally(url)
                return true
            }

            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                showingOffline = url.startsWith(OFFLINE_URL)
                pageReady = false
                applyPageMode(url)
            }

            // Also catches in-page navigation (Next.js links change the URL without a page load)
            override fun doUpdateVisitedHistory(view: WebView, url: String?, isReload: Boolean) {
                applyPageMode(url)
            }

            override fun onPageFinished(view: WebView, url: String) {
                binding.progress.visibility = View.GONE
                if (!url.startsWith(OFFLINE_URL)) {
                    pageReady = true
                    // Old WebViews without document-start scripts get the hooks here instead
                    if (!WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
                        view.evaluateJavascript(pageScript(), null)
                    }
                    deliverPendingClip()
                }
            }

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) showOffline()
            }
        }
    }

    /**
     * Script run in every page:
     *  - adds the app's embed CSS (hides the site footer, ads, …) without touching the DOM
     *  - saves <a download> clicks on blob:/data: URLs through the native bridge, because
     *    a WebView cannot download those itself (this is how the video tools save files)
     */
    private fun pageScript(): String = """
        (function () {
          if (window.__codeloveShell) return;
          window.__codeloveShell = true;
          var css = ${JSONObject.quote(BuildConfig.EMBED_CSS)};
          if (css) {
            try {
              var sheet = new CSSStyleSheet();
              sheet.replaceSync(css);
              document.adoptedStyleSheets = document.adoptedStyleSheets.concat([sheet]);
            } catch (e) {
              document.addEventListener('DOMContentLoaded', function () {
                var style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
              });
            }
          }
          var native = window.$BRIDGE_NAME;
          if (!native || !native.beginFile) return;
          function save(url, name) {
            fetch(url).then(function (r) { return r.blob(); }).then(async function (blob) {
              var id = native.beginFile(name || '', blob.type || '');
              if (id < 0) return;
              var CHUNK = 393216; // a multiple of 3, so every base64 piece is complete
              for (var offset = 0; offset < blob.size; offset += CHUNK) {
                var bytes = new Uint8Array(await blob.slice(offset, offset + CHUNK).arrayBuffer());
                var text = '';
                for (var i = 0; i < bytes.length; i += 32768) text += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768));
                native.appendFile(id, btoa(text));
              }
              native.finishFile(id);
            }).catch(function (e) { native.failFile(String(e)); });
          }
          window.__codeloveSave = save;
          // Returns true when the link is a download the app saved itself
          function take(a) {
            if (!a || !a.hasAttribute || !a.hasAttribute('download') || !a.href) return false;
            if (/^(blob|data):/i.test(a.href)) { save(a.href, a.getAttribute('download')); return true; }
            if (/^https?:/i.test(a.href)) { native.download(a.href, a.getAttribute('download') || ''); return true; }
            return false;
          }
          var click = HTMLAnchorElement.prototype.click;
          HTMLAnchorElement.prototype.click = function () { if (!take(this)) click.call(this); };
          var dispatch = EventTarget.prototype.dispatchEvent;
          EventTarget.prototype.dispatchEvent = function (event) {
            if (event && event.type === 'click' && this instanceof HTMLAnchorElement && take(this)) return true;
            return dispatch.call(this, event);
          };
          document.addEventListener('click', function (event) {
            var a = event.target && event.target.closest ? event.target.closest('a[download]') : null;
            if (a && event.isTrusted && take(a)) event.preventDefault();
          }, true);
        })();
    """.trimIndent()

    /** The URL to open: a deep link to our own site, a shared link, or the app's home. */
    private fun startUrl(intent: Intent?): String {
        if (intent?.action == Intent.ACTION_VIEW) {
            val data = intent.data
            if (data != null && data.scheme == "https" && isAllowedHost(data.host)) return data.toString()
        }
        return pendingClip?.let { shareUrlFor(it) }?.also { pendingClip = null } ?: BuildConfig.APP_URL
    }

    /** For apps that take a shared link as a URL parameter (Insta Downloader: ?url=…). */
    private fun shareUrlFor(text: String): String? {
        if (BuildConfig.SHARE_PARAM.isEmpty()) return null
        val link = LINK.find(text)?.value ?: return null
        return Uri.parse(BuildConfig.APP_URL).buildUpon().appendQueryParameter(BuildConfig.SHARE_PARAM, link).build().toString()
    }

    private fun loadApp(url: String = BuildConfig.APP_URL) {
        showingOffline = false
        webView.loadUrl(url)
    }

    private fun showOffline() {
        showingOffline = true
        pageReady = false
        webView.loadUrl(OFFLINE_URL)
    }

    private fun openExternally(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: ActivityNotFoundException) {
            // No app can handle this link — ignore silently
        }
    }

    /** Sends a "nativeapp" event ("pause" / "resume") so games can stop and restart their loop and music. */
    private fun notifyPage(state: String) {
        if (!pageReady) return
        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('nativeapp', { detail: '$state' }));", null)
    }

    // ---------------------------------------------------------------------
    // Back button

    private fun handleBack() {
        if (customView != null) {
            webView.webChromeClient?.onHideCustomView()
            return
        }
        if (showingOffline) {
            finish()
            return
        }
        if (immersive) {
            // Games get the first say: close a panel, pause the level, …
            webView.evaluateJavascript("(function(){try{return !!(window.__nativeBack&&window.__nativeBack())}catch(e){return false}})()") { used ->
                if (used == "true") return@evaluateJavascript
                // In the hub, leaving a game goes back to the page you came from
                if (BuildConfig.HUB && webView.canGoBack()) webView.goBack() else exitOnSecondPress()
            }
            return
        }
        when {
            webView.canGoBack() -> webView.goBack()
            BuildConfig.HUB -> exitOnSecondPress()
            else -> finish()
        }
    }

    private fun exitOnSecondPress() {
        val now = System.currentTimeMillis()
        if (now - lastBackPress < 2000) {
            finish()
        } else {
            lastBackPress = now
            Toast.makeText(this, R.string.back_again, Toast.LENGTH_SHORT).show()
        }
    }

    // ---------------------------------------------------------------------
    // Downloads (http/https — blob: and data: go through NativeBridge)

    private fun downloadUrl(url: String, fileName: String) {
        runOnUiThread {
            try {
                val name = fileName.ifBlank { URLUtil.guessFileName(url, null, null) }
                val request = DownloadManager.Request(Uri.parse(url)).apply {
                    setTitle(name)
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    addRequestHeader("User-Agent", webView.settings.userAgentString)
                    CookieManager.getInstance().getCookie(url)?.let { addRequestHeader("Cookie", it) }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name)
                    } else {
                        // Android 8–9: the public folder needs a storage permission; use the app's own
                        setDestinationInExternalFilesDir(this@MainActivity, Environment.DIRECTORY_DOWNLOADS, name)
                    }
                }
                (getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager).enqueue(request)
                Toast.makeText(this, getString(R.string.downloading, name), Toast.LENGTH_SHORT).show()
            } catch (_: Exception) {
                Toast.makeText(this, R.string.save_failed, Toast.LENGTH_SHORT).show()
            }
        }
    }

    // ---------------------------------------------------------------------
    // Share to <app> / text selection action

    private fun extractSharedText(intent: Intent?): String? {
        intent ?: return null
        val text = when (intent.action) {
            Intent.ACTION_SEND -> intent.getStringExtra(Intent.EXTRA_TEXT)
            Intent.ACTION_PROCESS_TEXT -> intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT)?.toString()
            else -> null
        }
        return text?.takeIf { it.isNotBlank() }
    }

    /** Hands a shared text to the web app (it listens for the "codelove:add" event). */
    private fun deliverPendingClip() {
        val text = pendingClip ?: return
        if (!pageReady) return
        pendingClip = null
        val payload = JSONObject.quote(text)
        webView.evaluateJavascript(
            "window.dispatchEvent(new CustomEvent('codelove:add', { detail: $payload }));",
            null,
        )
    }

    companion object {
        private const val BRIDGE_NAME = "CodeloveNative"
        private const val OFFLINE_URL = "file:///android_asset/offline.html"
        private val LINK = Regex("""https?://\S+""")

        // Hub: a game's play page, e.g. https://games.codelove.in/turbo-karts/play/
        private const val GAMES_HOST = "games.codelove.in"
        private val GAME_PLAY_PATH = Regex("""^/[^/]+/play/?$""")
    }
}
