package com.snacky.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.text.font.FontFamily

/**
 * The Poppins (or any other) [FontFamily] a host app loads, made available to every
 * component in this package without threading it through each one's parameter list.
 * Defaults to null, which renders in the platform's default font, exactly as before
 * this existed - see [SnackyButton][com.snacky.ui.components.button.SnackyButton]'s
 * doc comment, which called this out as missing before it was added.
 */
val LocalSnackyFontFamily: ProvidableCompositionLocal<FontFamily?> = compositionLocalOf { null }

/**
 * Provides [fontFamily] to every Snacky component underneath, so `toTextStyle()` and
 * every component's own hand-built `TextStyle` pick it up automatically. This package
 * ships no font resource (see theme/Tokens.kt), so wrap your app's content once:
 *
 * ```
 * SnackyTheme(fontFamily = PoppinsFamily) {
 *     HomeScreen()
 * }
 * ```
 */
@Composable
fun SnackyTheme(fontFamily: FontFamily? = null, content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalSnackyFontFamily provides fontFamily, content = content)
}
