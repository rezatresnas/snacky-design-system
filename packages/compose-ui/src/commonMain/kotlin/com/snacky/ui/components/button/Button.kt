package com.snacky.ui.components.button

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySize
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/** Hierarchy. Danger layers onto any of these as a separate intent, it is not a fourth hierarchy. */
enum class ButtonVariant { Primary, Secondary, Tertiary }

enum class ButtonSize { Default, Small }

/**
 * Snacky Button - Primary/Secondary/Tertiary hierarchy, each with an optional
 * Danger intent, in two sizes. Mirrors packages/react-ui's Button.tsx/Button.css,
 * the verified spec (see that package's README for how it was diffed against
 * the site's own PG.button.impl).
 *
 * Mobile has no hover, only a press: this maps the CSS `:active` (pressed)
 * colors and drops `:hover` entirely rather than simulating it on a touch
 * target - see Button.css for the web version, which does use both.
 *
 * No font is set on [text] beyond the token's size/weight/line-height/letter
 * spacing (Poppins is not bundled, see theme/Tokens.kt), it renders in
 * whatever `fontFamily` is ambient/default until this package grows a
 * SnackyTheme that can supply one globally.
 */
@Composable
fun SnackyButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Primary,
    danger: Boolean = false,
    size: ButtonSize = ButtonSize.Default,
    enabled: Boolean = true,
    icon: (@Composable () -> Unit)? = null,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()
    val colors = resolveButtonColors(variant, danger, enabled, pressed)
    val shape = RoundedCornerShape(SnackyRadius.field)
    val contentPadding = if (size == ButtonSize.Small) {
        PaddingValues(SnackySpacingPrimitive.space8)
    } else {
        PaddingValues(horizontal = SnackySpacingPrimitive.space8, vertical = SnackySpacingPrimitive.space12)
    }
    val label = SnackyTypography.Small.semibold

    Box(
        modifier = modifier
            .clip(shape)
            .background(colors.background)
            .then(if (colors.borderColor != null) Modifier.border(1.dp, colors.borderColor, shape) else Modifier)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        if (icon != null) {
            // Anchored to the button's true edge, independent of the text's own
            // padding, so the label stays centered on the whole button whether or
            // not an icon is present - it never shifts the label over to make room.
            // The slot itself is documented as a generic 24x24 (Icon.lg), but
            // that reads oversized next to Small's 12sp label - scaled down to
            // Icon.md (20x20) to stay proportional (mirrors react-ui's Button.css).
            val iconSize = if (size == ButtonSize.Small) SnackySize.Icon.md else SnackySize.Icon.lg
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = SnackySpacingPrimitive.space8)
                    .size(iconSize),
            ) {
                CompositionLocalProvider(LocalContentColor provides colors.contentColor) {
                    icon()
                }
            }
        }
        BasicText(
            text = text,
            modifier = Modifier.padding(contentPadding),
            style = TextStyle(
                color = colors.contentColor,
                fontSize = label.fontSize,
                fontWeight = label.fontWeight,
                lineHeight = label.lineHeight,
                letterSpacing = label.letterSpacing,
            ),
        )
    }
}

private data class ButtonColors(
    val background: Color,
    val contentColor: Color,
    val borderColor: Color?,
)

private fun resolveButtonColors(
    variant: ButtonVariant,
    danger: Boolean,
    enabled: Boolean,
    pressed: Boolean,
): ButtonColors = when (variant) {
    ButtonVariant.Primary -> when {
        !enabled && danger -> ButtonColors(SnackyColor.bgActionDisabled, SnackyColor.textActionDisabled, SnackyColor.borderActionDisabled)
        !enabled -> ButtonColors(SnackyColor.bgActionDisabled, SnackyColor.textActionDisabled, null)
        danger && pressed -> ButtonColors(SnackyColor.bgActionPrimaryDangerPressed, SnackyColor.textOnActionPrimary, null)
        danger -> ButtonColors(SnackyColor.bgActionPrimaryDanger, SnackyColor.textOnActionPrimary, null)
        pressed -> ButtonColors(SnackyColor.bgActionPrimaryPressed, SnackyColor.textOnActionPrimary, null)
        else -> ButtonColors(SnackyColor.bgActionPrimary, SnackyColor.textOnActionPrimary, null)
    }
    ButtonVariant.Secondary -> when {
        // Secondary signals disabled through border/text only, its fill never greys out.
        !enabled && danger -> ButtonColors(SnackyColor.bgActionSecondary, SnackyColor.textActionDisabled, SnackyColor.borderActionDisabled)
        !enabled -> ButtonColors(SnackyColor.bgActionSecondary, SnackyColor.textActionDisabled, SnackyColor.borderActionSecondary)
        danger && pressed -> ButtonColors(SnackyColor.bgActionSecondaryPressed, SnackyColor.textActionDanger, SnackyColor.borderActionDanger)
        danger -> ButtonColors(SnackyColor.bgActionSecondary, SnackyColor.textActionDanger, SnackyColor.borderActionDanger)
        pressed -> ButtonColors(SnackyColor.bgActionSecondaryPressed, SnackyColor.textOnActionPrimary, SnackyColor.borderActionSecondary)
        else -> ButtonColors(SnackyColor.bgActionSecondary, SnackyColor.textOnActionPrimary, SnackyColor.borderActionSecondary)
    }
    ButtonVariant.Tertiary -> when {
        // Ghost: never a fill or border, in any state, including disabled.
        !enabled -> ButtonColors(Color.Transparent, SnackyColor.textActionDisabled, null)
        danger && pressed -> ButtonColors(Color.Transparent, SnackyColor.textActionDangerPressed, null)
        danger -> ButtonColors(Color.Transparent, SnackyColor.textActionDanger, null)
        pressed -> ButtonColors(Color.Transparent, SnackyColor.textOnActionTertiaryPressed, null)
        else -> ButtonColors(Color.Transparent, SnackyColor.textOnActionTertiary, null)
    }
}
