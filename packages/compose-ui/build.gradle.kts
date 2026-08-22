import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    `maven-publish`
}

// Published via JitPack (jitpack.io), which builds straight from this Git repo
// on demand, not via a registry push, so the actual groupId here doesn't matter
// to consumers: JitPack always serves it as com.github.rezatresnas.* regardless
// of what's declared below. Release version lives in gradle.properties, not
// here, so it stays a single grep-able source (used by anyone scripting a
// release, JitPack itself reads the git tag directly).
group = "com.snacky"

kotlin {
    androidTarget {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_11)
        }
    }

    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64(),
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "SnackyUI"
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
            implementation(compose.animation)
            implementation(compose.components.resources)
        }
    }
}

android {
    namespace = "com.snacky.ui"
    compileSdk = 34
    defaultConfig {
        minSdk = 24
    }
    // Must match kotlin.androidTarget's jvmTarget above (11) - AGP's own javac
    // step defaults to 1.8 independently of the Kotlin compiler setting, and
    // the two disagreeing fails the build ("Inconsistent JVM-target
    // compatibility").
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

// Applying the bare maven-publish plugin is all JitPack needs: the Kotlin
// Multiplatform plugin auto-registers a publication per target (androidRelease,
// kotlinMultiplatform, iosX64, iosArm64, iosSimulatorArm64) once it sees
// maven-publish applied, no manual publications {} block required. JitPack then
// runs its own build (see ../../jitpack.yml) and serves whatever lands in
// mavenLocal, no signing and no external account needed, unlike Maven Central.
