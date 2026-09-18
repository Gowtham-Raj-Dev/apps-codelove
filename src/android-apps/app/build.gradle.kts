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
        manifestPlaceholders["deepLinkHost"] = "apps.codelove.in"
        manifestPlaceholders["deepLinkPath"] = "/"
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

                manifestPlaceholders["deepLinkHost"] = app["host"] as String
                manifestPlaceholders["deepLinkPath"] = app["deepLinkPath"] as String
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
}
