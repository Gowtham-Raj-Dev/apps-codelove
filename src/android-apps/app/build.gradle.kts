import groovy.json.JsonSlurper
import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

/*
  One Android shell, many apps.

  Every entry in app/apps.json becomes a product flavor with its own package
  id, name, icon, version and web URL. apps.json (and the per-app icons in
  app/src/<flavor>/res) are GENERATED from ../../src/data/apps.js by:

      node tools/sync-apps.mjs

  Build a single app:  .\build-app.ps1 clipdropper
  or directly:         .\gradlew.bat assembleClipdropperRelease
*/

// Google's sample AdMob App ID: keeps the SDK happy until a real one is set in src/data/ads.js
val TEST_ADMOB_APP_ID = "ca-app-pub-3940256099942544~3347511713"

@Suppress("UNCHECKED_CAST")
val codeloveApps = (JsonSlurper().parse(file("apps.json")) as List<Map<String, Any>>)

// Release signing config lives in <root>/keystore.properties (git-ignored)
val keystoreProps = Properties().apply {
    val f = rootProject.file("keystore.properties")
    if (f.exists()) f.inputStream().use { load(it) }
}

android {
    namespace = "com.codelove.apps"
    compileSdk = 36

    defaultConfig {
        minSdk = 26          // Android 8.0+
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
        // Every flavor overrides these — defaults only keep the IDE happy
        buildConfigField("String", "APP_URL", "\"https://apps.codelove.in\"")
        buildConfigField("String", "APP_HOST", "\"apps.codelove.in\"")
        buildConfigField("String", "APP_ID", "\"codelove\"")
        buildConfigField("boolean", "IMMERSIVE", "false")
        buildConfigField("boolean", "HUB", "false")
        buildConfigField("boolean", "DARK", "false")
        buildConfigField("String", "UA_TOKEN", "\"\"")
        buildConfigField("String", "EMBED_CSS", "\"\"")
        buildConfigField("String", "EXTRA_HOSTS", "\"\"")
        buildConfigField("String", "SHARE_PARAM", "\"\"")
        buildConfigField("boolean", "ADS_ALLOWED", "false")
        buildConfigField("String", "ADMOB_APP_ID", "\"\"")
        buildConfigField("String", "AD_BANNER", "\"\"")
        buildConfigField("String", "AD_INTERSTITIAL", "\"\"")
        buildConfigField("String", "AD_APP_OPEN", "\"\"")
        buildConfigField("String", "AD_FORMATS", "\"\"")
        manifestPlaceholders["admobAppId"] = TEST_ADMOB_APP_ID
        manifestPlaceholders["deepLinkHost"] = "apps.codelove.in"
        manifestPlaceholders["deepLinkPath"] = "/"
        manifestPlaceholders["screenOrientation"] = "unspecified"
    }

    flavorDimensions += "app"
    productFlavors {
        codeloveApps.forEach { app ->
            val flavor = app["flavor"] as String
            create(flavor) {
                dimension = "app"
                applicationId = "com.codelove.$flavor"
                versionName = app["versionName"] as String
                versionCode = (app["versionCode"] as Number).toInt()

                resValue("string", "app_name", app["name"] as String)
                resValue("color", "brand", app["accent"] as String)
                resValue("color", "brand_light", app["accentLight"] as String)

                buildConfigField("String", "APP_ID", "\"${app["id"]}\"")
                buildConfigField("String", "APP_URL", "\"${app["url"]}\"")
                buildConfigField("String", "APP_HOST", "\"${app["host"]}\"")

                // How the shell behaves for this app (see "android" in src/data/apps.js)
                val dark = app["dark"] == true
                buildConfigField("boolean", "IMMERSIVE", "${app["immersive"] == true}")
                // The main CodeLove app: opens games (landscape, full screen) and tools inside itself
                buildConfigField("boolean", "HUB", "${app["hub"] == true}")
                buildConfigField("boolean", "DARK", "$dark")
                buildConfigField("String", "UA_TOKEN", "\"${app["uaToken"] ?: ""}\"")
                buildConfigField("String", "EMBED_CSS", "\"${app["embedCss"] ?: ""}\"")
                buildConfigField("String", "EXTRA_HOSTS", "\"${app["hosts"] ?: ""}\"")
                buildConfigField("String", "SHARE_PARAM", "\"${app["shareParam"] ?: ""}\"")
                resValue("bool", "share_target", "${app["shareTarget"] == true}")
                resValue("bool", "light_bars", "${!dark}")
                resValue("color", "surface", if (dark) "#0B0D12" else "#FAFAFC")

                // AdMob (see src/data/ads.js). Release builds show ads only once a real App ID is set.
                val ads = (app["ads"] as Map<String, Any>?) ?: emptyMap()
                val adsAppId = (ads["appId"] as String?).orEmpty()
                buildConfigField("boolean", "ADS_ALLOWED", "${ads["allowed"] == true}")
                buildConfigField("String", "ADMOB_APP_ID", "\"$adsAppId\"")
                buildConfigField("String", "AD_BANNER", "\"${ads["banner"] ?: ""}\"")
                buildConfigField("String", "AD_INTERSTITIAL", "\"${ads["interstitial"] ?: ""}\"")
                buildConfigField("String", "AD_APP_OPEN", "\"${ads["appOpen"] ?: ""}\"")
                buildConfigField("String", "AD_FORMATS", "\"${ads["formats"] ?: ""}\"")
                manifestPlaceholders["admobAppId"] = adsAppId.ifEmpty { TEST_ADMOB_APP_ID }

                manifestPlaceholders["deepLinkHost"] = app["host"] as String
                manifestPlaceholders["deepLinkPath"] = app["deepLinkPath"] as String
                manifestPlaceholders["screenOrientation"] = (app["orientation"] as String?) ?: "unspecified"
            }
        }
    }

    signingConfigs {
        if (keystoreProps.isNotEmpty()) {
            create("release") {
                storeFile = rootProject.file(keystoreProps.getProperty("storeFile"))
                storePassword = keystoreProps.getProperty("storePassword")
                keyAlias = keystoreProps.getProperty("keyAlias")
                keyPassword = keystoreProps.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            signingConfigs.findByName("release")?.let { signingConfig = it }
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            // To test against the local Next.js dev server on an emulator, uncomment:
            // buildConfigField("String", "APP_URL", "\"http://10.0.2.2:3000/clipdropper/app\"")
            // buildConfigField("String", "APP_HOST", "\"10.0.2.2\"")
            // (and set android:usesCleartextTraffic="true" in the manifest)
        }
    }

    buildFeatures {
        buildConfig = true
        viewBinding = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlin {
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.webkit)
    implementation(libs.androidx.splashscreen)
    implementation(libs.play.services.ads)
    implementation(libs.ump)
}
