# Keep the JavaScript bridge methods so the web app can call them in release builds
-keepclassmembers class com.codelove.apps.NativeBridge {
    @android.webkit.JavascriptInterface <methods>;
}
