package com.snacky.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily

/**
 * Builds a Compose [TextStyle] from a [SnackyTypographyToken], e.g.
 * `Text("Order", style = SnackyTypography.Body.semibold.toTextStyle(color = SnackyColor.textPrimary))`.
 *
 * Tokens carry only size, weight, line height and letter spacing, because this
 * package ships no font resource. [fontFamily] defaults to [LocalSnackyFontFamily],
 * so wrapping your app in `SnackyTheme(fontFamily = PoppinsFamily) { ... }` once
 * covers every call site; pass it explicitly here only to override that default
 * for one piece of text.
 *
 * Hand-written, not generated: `Tokens.kt` is regenerated from tokens.json and
 * would drop anything added there. Every component in this package used to build
 * the same TextStyle by hand, and the docs site's Kotlin samples called this
 * helper before it existed.
 */
@Composable
fun SnackyTypographyToken.toTextStyle(
    color: Color = Color.Unspecified,
    fontFamily: FontFamily? = LocalSnackyFontFamily.current,
): TextStyle = TextStyle(
    color = color,
    fontFamily = fontFamily,
    fontSize = fontSize,
    fontWeight = fontWeight,
    lineHeight = lineHeight,
    letterSpacing = letterSpacing,
)
