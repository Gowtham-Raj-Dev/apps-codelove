package com.codelove.apps

import android.app.Activity
import android.view.View
import android.webkit.WebView
import android.widget.FrameLayout
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform
import java.util.concurrent.atomic.AtomicBoolean

/**
 * AdMob for the Codelove shell. Which formats an app uses, and its ad unit IDs, come from
 * src/data/ads.js through the flavor (BuildConfig.AD_*).
 *
 *  - Tools: an adaptive banner under the web app, plus an app-open ad when you come back.
 *  - Games: an interstitial when the game asks for one at a break (CodeloveNative.showAd()),
 *           plus an app-open ad when you come back after a while. Never a banner over the game.
 *
 * Debug builds always use Google's test units. Release builds show ads only when the app has
 * a real AdMob App ID, so a public APK never shows test ads. Consent (GDPR and similar) is
 * asked with Google's UMP form before any ad is requested.
 */
class AdsManager(
    private val activity: Activity,
    private val container: FrameLayout,
    private val webView: WebView,
) {
    private val consent: ConsentInformation = UserMessagingPlatform.getConsentInformation(activity)
    private val started = AtomicBoolean(false)
    private val formats = BuildConfig.AD_FORMATS.split(',').map { it.trim() }.toSet()

    private var banner: AdView? = null
    private var interstitial: InterstitialAd? = null
    private var appOpen: AppOpenAd? = null
    private var appOpenLoadedAt = 0L
    private var lastFullScreenAd = 0L
    private var showingFullScreen = false
    private var backgroundSince = 0L

    /** Ads are on for this app (and, in release builds, it has a real AdMob App ID). */
    val enabled: Boolean = BuildConfig.ADS_ALLOWED && (BuildConfig.DEBUG || BuildConfig.ADMOB_APP_ID.isNotEmpty())

    fun start() {
        if (!enabled) return
        val params = ConsentRequestParameters.Builder().build()
        consent.requestConsentInfoUpdate(
            activity,
            params,
            { UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { initialise() } },
            { initialise() },
        )
        // Consent from an earlier session is enough to start right away
        initialise()
    }

    private fun initialise() {
        if (!consent.canRequestAds() || !started.compareAndSet(false, true)) return
        MobileAds.initialize(activity) {
            MobileAds.registerWebView(webView)
            if (wants("banner", BuildConfig.AD_BANNER)) loadBanner()
            if (wants("interstitial", BuildConfig.AD_INTERSTITIAL)) loadInterstitial()
            if (wants("appopen", BuildConfig.AD_APP_OPEN)) loadAppOpen()
        }
    }

    /** The app uses this format, and (in release builds) its ad unit ID is set. */
    private fun wants(format: String, unitId: String) = format in formats && (BuildConfig.DEBUG || unitId.isNotEmpty())

    private fun unit(real: String, test: String) = if (BuildConfig.DEBUG) test else real

    // ---------------------------------------------------------------- banner

    private fun loadBanner() {
        val metrics = activity.resources.displayMetrics
        val widthDp = (metrics.widthPixels / metrics.density).toInt()
        val view = AdView(activity).apply {
            adUnitId = unit(BuildConfig.AD_BANNER, TEST_BANNER)
            setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, widthDp))
            adListener = object : com.google.android.gms.ads.AdListener() {
                override fun onAdLoaded() {
                    container.visibility = View.VISIBLE
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    container.visibility = View.GONE
                }
            }
        }
        container.removeAllViews()
        container.addView(view)
        view.loadAd(AdRequest.Builder().build())
        banner = view
    }

    // ---------------------------------------------------------------- interstitial

    private fun loadInterstitial() {
        InterstitialAd.load(
            activity,
            unit(BuildConfig.AD_INTERSTITIAL, TEST_INTERSTITIAL),
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitial = ad
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitial = null
                }
            },
        )
    }

    /** Called by the web app at a natural break (level end, game over). Capped to one ad per FULL_SCREEN_GAP_MS. */
    fun showInterstitial(): Boolean {
        val ad = interstitial ?: return false
        if (showingFullScreen || System.currentTimeMillis() - lastFullScreenAd < FULL_SCREEN_GAP_MS) return false
        ad.fullScreenContentCallback = fullScreenCallback { interstitial = null; loadInterstitial() }
        showingFullScreen = true
        ad.show(activity)
        return true
    }

    // ---------------------------------------------------------------- app open

    private fun loadAppOpen() {
        AppOpenAd.load(
            activity,
            unit(BuildConfig.AD_APP_OPEN, TEST_APP_OPEN),
            AdRequest.Builder().build(),
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    appOpen = ad
                    appOpenLoadedAt = System.currentTimeMillis()
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    appOpen = null
                }
            },
        )
    }

    /** Activity went to the background. */
    fun onStop() {
        if (!showingFullScreen) backgroundSince = System.currentTimeMillis()
    }

    /** Activity came back: show an app-open ad if the user was away long enough. */
    fun onStart() {
        val away = backgroundSince
        backgroundSince = 0L
        if (away == 0L || showingFullScreen) return
        val now = System.currentTimeMillis()
        if (now - away < MIN_AWAY_MS || now - lastFullScreenAd < FULL_SCREEN_GAP_MS) return
        val ad = appOpen ?: return
        // An app-open ad expires four hours after it loaded
        if (now - appOpenLoadedAt > 4 * 60 * 60 * 1000L) {
            appOpen = null
            loadAppOpen()
            return
        }
        ad.fullScreenContentCallback = fullScreenCallback { appOpen = null; loadAppOpen() }
        showingFullScreen = true
        ad.show(activity)
    }

    private fun fullScreenCallback(reload: () -> Unit) = object : FullScreenContentCallback() {
        override fun onAdDismissedFullScreenContent() {
            showingFullScreen = false
            lastFullScreenAd = System.currentTimeMillis()
            reload()
        }

        override fun onAdFailedToShowFullScreenContent(error: AdError) {
            showingFullScreen = false
            reload()
        }
    }

    fun onResume() = banner?.resume()

    fun onPause() = banner?.pause()

    fun onDestroy() = banner?.destroy()

    companion object {
        // Google's sample ad units — used by debug builds and as a fallback
        private const val TEST_BANNER = "ca-app-pub-3940256099942544/9214589741"
        private const val TEST_INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712"
        private const val TEST_APP_OPEN = "ca-app-pub-3940256099942544/9257395921"

        /** At least this long between two full-screen ads. */
        private const val FULL_SCREEN_GAP_MS = 3 * 60 * 1000L

        /** An app-open ad is shown only after the user was away at least this long. */
        private const val MIN_AWAY_MS = 30 * 1000L
    }
}
