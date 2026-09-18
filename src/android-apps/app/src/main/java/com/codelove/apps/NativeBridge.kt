package com.codelove.apps

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * Exposed to the web app as `window.CodeloveNative`.
 *
 * The web apps on apps.codelove.in check for this object and prefer it over
 * the browser Clipboard API, which is unreliable inside a WebView. Every
 * method here is called from the WebView's JavaScript thread, so UI work is
 * posted to the main thread.
 */
class NativeBridge(
    private val context: Context,
    private val onReload: () -> Unit,
) {
    private val main = Handler(Looper.getMainLooper())

    private val clipboard: ClipboardManager
        get() = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

    /** Copy text to the system clipboard. */
    @JavascriptInterface
    fun copy(text: String) {
        clipboard.setPrimaryClip(ClipData.newPlainText(context.getString(R.string.app_name), text))
        // Android 13+ shows its own "Copied" overlay; avoid a double toast there.
        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.TIRAMISU) {
            toast(context.getString(R.string.copied))
        }
    }

    /**
     * Current clipboard text, or "" when empty / not text.
     * On Android 10+ this only works while the app is in the foreground,
     * which is always the case when the user taps "Paste clipboard".
     */
    @JavascriptInterface
    fun readClipboard(): String {
        val clip = clipboard.primaryClip ?: return ""
        if (clip.itemCount == 0) return ""
        return clip.getItemAt(0).coerceToText(context)?.toString() ?: ""
    }

    /** Open the Android share sheet with the given text. */
    @JavascriptInterface
    fun share(text: String) {
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, text)
        }
        val chooser = Intent.createChooser(send, context.getString(R.string.share_via)).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        main.post { context.startActivity(chooser) }
    }

    /** Show a short native toast. */
    @JavascriptInterface
    fun toast(message: String) {
        main.post { Toast.makeText(context, message, Toast.LENGTH_SHORT).show() }
    }

    /** Reload the web app (used by the offline page's "Try again" button). */
    @JavascriptInterface
    fun reload() {
        main.post { onReload() }
    }

    /** Lets the web app know it is running inside the Android app, and which version. */
    @JavascriptInterface
    fun version(): String = BuildConfig.VERSION_NAME

    /** Which Codelove app this shell is (the id from src/data/apps.js, e.g. "clipdropper"). */
    @JavascriptInterface
    fun appId(): String = BuildConfig.APP_ID

    /** Display name of this app. */
    @JavascriptInterface
    fun appName(): String = context.getString(R.string.app_name)
}
