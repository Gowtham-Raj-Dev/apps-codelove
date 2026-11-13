package com.codelove.apps

import android.content.ClipData
import android.content.ClipboardManager
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.MimeTypeMap
import android.widget.Toast
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

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
    private val onDownload: (url: String, name: String) -> Unit,
    private val onShowAd: () -> Unit,
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

    // ---------------------------------------------------------------------
    // Saving files. A WebView cannot download blob: URLs, so the page script in
    // MainActivity reads the blob and sends it here in base64 pieces:
    //   id = beginFile(name, mime) → appendFile(id, base64)… → finishFile(id)

    private class OpenFile(val name: String, val stream: OutputStream, val uri: Uri?, val file: File?)

    private val openFiles = ConcurrentHashMap<Int, OpenFile>()
    private val nextFileId = AtomicInteger(1)

    /** Starts a file in the Downloads folder. Returns its id, or -1 when it could not be created. */
    @JavascriptInterface
    fun beginFile(name: String, mimeType: String): Int {
        return try {
            val mime = mimeType.substringBefore(';').trim().ifEmpty { "application/octet-stream" }
            val safeName = fileName(name, mime)
            val open = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, safeName)
                    put(MediaStore.Downloads.MIME_TYPE, mime)
                    put(MediaStore.Downloads.IS_PENDING, 1)
                }
                val uri = context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values) ?: return -1
                OpenFile(safeName, context.contentResolver.openOutputStream(uri) ?: return -1, uri, null)
            } else {
                // Android 8–9: the public folder needs a storage permission; use the app's own folder
                val dir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: return -1
                val file = File(dir, safeName)
                OpenFile(safeName, FileOutputStream(file), null, file)
            }
            val id = nextFileId.getAndIncrement()
            openFiles[id] = open
            id
        } catch (_: Exception) {
            -1
        }
    }

    @JavascriptInterface
    fun appendFile(id: Int, base64: String) {
        val open = openFiles[id] ?: return
        try {
            open.stream.write(Base64.decode(base64, Base64.DEFAULT))
        } catch (_: Exception) {
            discard(id)
            toast(context.getString(R.string.save_failed))
        }
    }

    @JavascriptInterface
    fun finishFile(id: Int) {
        val open = openFiles.remove(id) ?: return
        try {
            open.stream.close()
            if (open.uri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val done = ContentValues().apply { put(MediaStore.Downloads.IS_PENDING, 0) }
                context.contentResolver.update(open.uri, done, null, null)
            }
            toast(context.getString(R.string.saved_to_downloads, open.name))
        } catch (_: Exception) {
            toast(context.getString(R.string.save_failed))
        }
    }

    @JavascriptInterface
    fun failFile(message: String) {
        openFiles.keys.toList().forEach(::discard)
        toast(context.getString(R.string.save_failed))
    }

    /** Download an http(s) URL with Android's download manager. */
    @JavascriptInterface
    fun download(url: String, name: String) = onDownload(url, name)

    private fun discard(id: Int) {
        val open = openFiles.remove(id) ?: return
        try {
            open.stream.close()
        } catch (_: Exception) {
        }
        open.uri?.let { context.contentResolver.delete(it, null, null) }
        open.file?.delete()
    }

    /** A safe file name with an extension; "download-<time>.<ext>" when the page gave none. */
    private fun fileName(name: String, mime: String): String {
        val clean = name.substringAfterLast('/').replace(Regex("""[\\:*?"<>|\u0000-\u001f]"""), "_").trim().take(120)
        val ext = MimeTypeMap.getSingleton().getExtensionFromMimeType(mime)
        return when {
            clean.isEmpty() -> "download-${System.currentTimeMillis()}${if (ext != null) ".$ext" else ""}"
            clean.contains('.') || ext == null -> clean
            else -> "$clean.$ext"
        }
    }

    /**
     * Ask for a full-screen ad at a natural break (level finished, game over). The app decides
     * whether one is shown (at most one every few minutes, only when an ad is ready).
     * The page gets a "nativeapp" pause event while the ad is on screen.
     */
    @JavascriptInterface
    fun showAd() = onShowAd()

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
