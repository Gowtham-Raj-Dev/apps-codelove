package com.codelove.apps

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.addCallback
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import com.codelove.apps.databinding.ActivityMainBinding
import org.json.JSONObject

/**
 * Codelove app shell.
 *
 * A thin native shell around one of the Codelove web apps — which one is
 * decided by the product flavor (BuildConfig.APP_URL, see build.gradle.kts).
 * The shell adds what a WebView cannot do on its own: a reliable clipboard
 * bridge, "Share to <app>", a text-selection action, an offline screen and a
 * splash screen.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val webView: WebView get() = binding.webView

    /** Text received via Share / Process Text, delivered once the page is ready. */
    private var pendingClip: String? = null
    private var pageReady = false
    private var showingOffline = false

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

        // Edge-to-edge: pad the root by the system bars + keyboard so the web app is never covered
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.ime())
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            insets
        }

        setUpWebView()

        onBackPressedDispatcher.addCallback(this) {
            if (webView.canGoBack() && !showingOffline) {
                webView.goBack()
            } else {
                isEnabled = false
                onBackPressedDispatcher.onBackPressed()
            }
        }

        pendingClip = extractSharedText(intent)

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            loadApp()
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        extractSharedText(intent)?.let { text ->
            pendingClip = text
            deliverPendingClip()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.removeJavascriptInterface(BRIDGE_NAME)
        webView.destroy()
        super.onDestroy()
    }

    // ---------------------------------------------------------------------
    // WebView

    @SuppressLint("SetJavaScriptEnabled")
    private fun setUpWebView() {
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true            // localStorage — this is where the clips live
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
            mediaPlaybackRequiresUserGesture = true
            userAgentString = "$userAgentString CodeloveApp/${BuildConfig.APP_ID}/${BuildConfig.VERSION_NAME}"
        }

        // The web app is light-only; stop the WebView from auto-darkening it
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(webView.settings, false)
        }

        webView.setBackgroundColor(getColor(R.color.surface))
        webView.overScrollMode = View.OVER_SCROLL_NEVER
        webView.addJavascriptInterface(NativeBridge(this, ::loadApp), BRIDGE_NAME)

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, newProgress: Int) {
                binding.progress.progress = newProgress
                binding.progress.visibility = if (newProgress in 1..99) View.VISIBLE else View.GONE
            }
        }

        webView.webViewClient = object : WebViewClient() {

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                val scheme = url.scheme ?: return false
                // Our own pages (and the bundled offline page) stay inside the WebView
                if (scheme == "file") return false
                if ((scheme == "https" || scheme == "http") && url.host.equals(BuildConfig.APP_HOST, ignoreCase = true)) {
                    return false
                }
                // Everything else (other sites, mailto:, tel:, intent:) goes to the system
                openExternally(url)
                return true
            }

            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                showingOffline = url.startsWith(OFFLINE_URL)
                pageReady = false
            }

            override fun onPageFinished(view: WebView, url: String) {
                binding.progress.visibility = View.GONE
                if (!url.startsWith(OFFLINE_URL)) {
                    pageReady = true
                    deliverPendingClip()
                }
            }

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) showOffline()
            }
        }
    }

    private fun loadApp() {
        showingOffline = false
        webView.loadUrl(BuildConfig.APP_URL)
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
    }
}
