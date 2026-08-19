// Generated from tokens.json by scripts/generate-compose-tokens.js - do not hand-edit.
package com.snacky.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/** Raw color ramps. Rarely used directly, prefer [SnackyColor]. */
object SnackyColorPrimitive {
    object Primary {
        val c50 = Color(0xFFFEF8EB)
        val c100 = Color(0xFFFDE9BF)
        val c200 = Color(0xFFFCDEA1)
        val c300 = Color(0xFFFACF76)
        val c400 = Color(0xFFF9C55B)
        val c500 = Color(0xFFF8B732)
        val c600 = Color(0xFFE2A72E)
        val c700 = Color(0xFFB08224)
        val c800 = Color(0xFF88651C)
        val c900 = Color(0xFF684D15)
    }
    object Neutral {
        val c0 = Color(0xFFFFFFFF)
        val c10 = Color(0xFFFDFDFD)
        val c20 = Color(0xFFF7F7F7)
        val c50 = Color(0xFFF3F3F3)
        val c100 = Color(0xFFE0E0E0)
        val c200 = Color(0xFFCCCCCC)
        val c400 = Color(0xFFA3A3A3)
        val c500 = Color(0xFF7A7A7A)
        val c600 = Color(0xFF6A6A6A)
        val c700 = Color(0xFF525252)
        val c800 = Color(0xFF4B4B4B)
        val c900 = Color(0xFF434343)
        val c950 = Color(0xFF333333)
    }
    object Red {
        val c50 = Color(0xFFFDEEEE)
        val c100 = Color(0xFFF9CBCB)
        val c200 = Color(0xFFF6B2B2)
        val c300 = Color(0xFFF28E8E)
        val c400 = Color(0xFFEF7979)
        val c500 = Color(0xFFEB5757)
        val c600 = Color(0xFFD64F4F)
        val c700 = Color(0xFFA73E3E)
        val c800 = Color(0xFF813030)
        val c900 = Color(0xFF632525)
    }
}

/** Semantic colors, what components should bind to. */
object SnackyColor {
    val bgApp = Color(0xFFF7F7F7)
    val bgSurface = Color(0xFFFFFFFF)
    val bgSurfacePrimary = Color(0xFFF8B732)
    val bgSurfaceAccent = Color(0xFFEB5757)
    val bgSurfaceVariant = Color(0xFFF3F3F3)
    val bgSurfaceField = Color(0xFFFFFFFF)
    val bgSurfaceHighlight = Color(0xFFFEF8EB)
    val bgActionPrimary = Color(0xFFF8B732)
    val bgActionPrimaryHover = Color(0xFFE2A72E)
    val bgActionPrimaryPressed = Color(0xFFB08224)
    val bgActionSecondary = Color(0xFFFFFFFF)
    val bgActionSecondaryHover = Color(0xFFF3F3F3)
    val bgActionSecondaryPressed = Color(0xFFE0E0E0)
    val bgActionDisabled = Color(0xFFCCCCCC)
    val bgActionPrimaryDanger = Color(0xFFEB5757)
    val bgActionPrimaryDangerHovered = Color(0xFFD64F4F)
    val bgActionPrimaryDangerPressed = Color(0xFFA73E3E)
    val bgOverlayDim = Color(red = 51f / 255f, green = 51f / 255f, blue = 51f / 255f, alpha = 0.8f)
    val borderMain = Color(0xFFCCCCCC)
    val borderHighlight = Color(0xFFFCDEA1)
    val borderInputDefault = Color(0xFFCCCCCC)
    val borderInputActive = Color(0xFFF8B732)
    val borderInputError = Color(0xFFEB5757)
    val borderActionSecondary = Color(0xFFCCCCCC)
    val borderActionSecondaryPressed = Color(0xFFA3A3A3)
    val borderActionDanger = Color(0xFFEB5757)
    val borderActionDisabled = Color(0xFFCCCCCC)
    val textPrimary = Color(0xFF333333)
    val textSecondary = Color(0xFF7A7A7A)
    val textPlaceholder = Color(0xFF7A7A7A)
    val textDisabled = Color(0xFFA3A3A3)
    val textLink = Color(0xFF88651C)
    val textError = Color(0xFFA73E3E)
    val textInverse = Color(0xFFFFFFFF)
    val textOnActionPrimary = Color(0xFF333333)
    val textOnActionSecondary = Color(0xFF333333)
    val textOnActionTertiary = Color(0xFFB08224)
    val textOnActionTertiaryHovered = Color(0xFF88651C)
    val textOnActionTertiaryPressed = Color(0xFF684D15)
    val textActionDanger = Color(0xFFD64F4F)
    val textActionDangerHovered = Color(0xFFA73E3E)
    val textActionDangerPressed = Color(0xFF813030)
    val textActionDisabled = Color(0xFFA3A3A3)
    val iconPrimary = Color(0xFF333333)
    val iconSecondary = Color(0xFF525252)
    val iconBrand = Color(0xFFF8B732)
    val iconDisabled = Color(0xFFA3A3A3)
    val iconActive = Color(0xFFEB5757)
    val iconOnAccent = Color(0xFFFFFFFF)
}

object SnackySpacingPrimitive {
    val space2 = 2.dp
    val space4 = 4.dp
    val space8 = 8.dp
    val space12 = 12.dp
    val space16 = 16.dp
    val space24 = 24.dp
    val space32 = 32.dp
}

object SnackyGap {
    val iconLabel = 4.dp
    val cell = 4.dp
    val textIcon = 8.dp
    val textUnderline = 16.dp
}

object SnackyLayout {
    val sectionList = 8.dp
    val block = 16.dp
    val stack = 24.dp
    val page = 32.dp
}

object SnackyMargin {
    val screen = 16.dp
}

object SnackyRadiusPrimitive {
    val radius4 = 4.dp
    val radius6 = 6.dp
    val radius8 = 8.dp
    val radius10 = 10.dp
    val radius20 = 20.dp
    val radius100 = 100.dp
    val radius999 = 999.dp
}

object SnackyRadius {
    val field = 4.dp
    val tag = 6.dp
    val bubble = 8.dp
    val card = 10.dp
    val sheetTop = 20.dp
    val full = 100.dp
}

object SnackySize {
    object Icon {
        val sm = 16.dp
        val md = 20.dp
        val lg = 24.dp
    }
    object Avatar {
        val sm = 32.dp
        val md = 56.dp
        val lg = 72.dp
    }
}

/**
 * Compose Multiplatform has no direct box-shadow primitive, so this is a raw
 * value carrier (offset/blur/color), not a ready-to-apply Modifier. Map it onto
 * the platform shadow API you are using (e.g. Modifier.shadow on Android).
 */
data class SnackyShadowToken(
    val offsetX: Dp,
    val offsetY: Dp,
    val blurRadius: Dp,
    val color: Color,
)

object SnackyShadow {
    val md = SnackyShadowToken(offsetX = 0.dp, offsetY = 4.dp, blurRadius = 8.dp, color = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.08f))
    val lg = SnackyShadowToken(offsetX = 0.dp, offsetY = 10.dp, blurRadius = 30.dp, color = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.1f))
    val top = SnackyShadowToken(offsetX = 0.dp, offsetY = -4.dp, blurRadius = 10.dp, color = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.08f))
}

/**
 * Raw type-scale values, not a Compose TextStyle. This package ships no font
 * resource (Poppins), so build the TextStyle with a FontFamily you supply:
 * `TextStyle(fontFamily = poppins, fontSize = SnackyTypography.H1.bold.fontSize, ...)`.
 */
data class SnackyTypographyToken(
    val fontSize: TextUnit,
    val fontWeight: FontWeight,
    val lineHeight: TextUnit,
    val letterSpacing: TextUnit,
)

object SnackyTypography {
    object H1 {
        val bold = SnackyTypographyToken(fontSize = 32.sp, fontWeight = FontWeight.Bold, lineHeight = 36.sp, letterSpacing = 0.01.em)
    }
    object H2 {
        val bold = SnackyTypographyToken(fontSize = 20.sp, fontWeight = FontWeight.Bold, lineHeight = 36.sp, letterSpacing = 0.01.em)
    }
    object H3 {
        val bold = SnackyTypographyToken(fontSize = 16.sp, fontWeight = FontWeight.Bold, lineHeight = 36.sp, letterSpacing = 0.01.em)
        val regular = SnackyTypographyToken(fontSize = 16.sp, fontWeight = FontWeight.Normal, lineHeight = 36.sp, letterSpacing = 0.sp)
    }
    object Body {
        val semibold = SnackyTypographyToken(fontSize = 14.sp, fontWeight = FontWeight.SemiBold, lineHeight = 24.sp, letterSpacing = 0.sp)
        val regular = SnackyTypographyToken(fontSize = 14.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp, letterSpacing = 0.sp)
    }
    object Small {
        val semibold = SnackyTypographyToken(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, lineHeight = 24.sp, letterSpacing = 0.sp)
        val bold = SnackyTypographyToken(fontSize = 12.sp, fontWeight = FontWeight.Bold, lineHeight = 24.sp, letterSpacing = 0.01.em)
        val regular = SnackyTypographyToken(fontSize = 12.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp, letterSpacing = 0.sp)
    }
    object Caption {
        val semibold = SnackyTypographyToken(fontSize = 10.sp, fontWeight = FontWeight.SemiBold, lineHeight = 23.sp, letterSpacing = 0.01.em)
        val regular = SnackyTypographyToken(fontSize = 10.sp, fontWeight = FontWeight.Normal, lineHeight = 16.sp, letterSpacing = 0.01.em)
    }
}
