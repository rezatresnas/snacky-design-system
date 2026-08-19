import com.vanniktech.maven.publish.SonatypeHost
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.mavenPublish)
}

// io.github.rezatresnas is a Central Portal namespace verified via GitHub sign-in
// (Publishing Settings -> Namespace), no domain ownership needed. Release version
// lives in gradle.properties, not here, so CI can grep it the same way the npm
// workflow reads package.json's "version".
group = "io.github.rezatresnas"

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
}

// Uses the vanniktech/gradle-maven-publish-plugin, which wraps maven-publish +
// signing + the Central Portal upload API into one config block. Untested here
// (no JDK/Gradle in this environment), so if publishToMavenCentral()'s signature
// has moved on whatever plugin version resolves, check the plugin's changelog.
mavenPublishing {
    publishToMavenCentral(SonatypeHost.CENTRAL_PORTAL)
    signAllPublications()

    coordinates(group.toString(), "snacky-ui", version.toString())

    pom {
        name.set("Snacky Compose UI")
        description.set("Compose Multiplatform implementation of the Snacky App design system, pixel-accurate to Figma.")
        inceptionYear.set("2026")
        url.set("https://github.com/rezatresnas/snacky-design-system")
        licenses {
            license {
                name.set("MIT")
                url.set("https://github.com/rezatresnas/snacky-design-system/blob/main/LICENSE")
            }
        }
        developers {
            developer {
                id.set("rezatresnas")
                name.set("rezatresnas")
                url.set("https://github.com/rezatresnas")
            }
        }
        scm {
            url.set("https://github.com/rezatresnas/snacky-design-system")
            connection.set("scm:git:git://github.com/rezatresnas/snacky-design-system.git")
            developerConnection.set("scm:git:ssh://git@github.com/rezatresnas/snacky-design-system.git")
        }
    }
}
