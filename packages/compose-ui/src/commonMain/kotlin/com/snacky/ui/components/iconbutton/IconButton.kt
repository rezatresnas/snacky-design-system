package com.snacky.ui.components.iconbutton

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor

enum class IconButtonVariant { Primary, Secondary, Tertiary }

enum class IconButtonSize { Default, Small }

/**
 * Snacky Icon Button - compact circular touch target for a single icon.
 * Secondary doubles as a toggle control via [selected] (e.g. Favorite).
 * Mirrors packages/react-ui's IconButton.tsx/IconButton.css.
 *
 * [size] only has an effect on [IconButtonVariant.Primary] (32dp default,
 * 24dp small circle, the icon glyph itself stays a fixed 16dp either way).
 * react-ui's own doc comment claims "24px (default) or 16px (small)", that
 * is stale relative to its own CSS (verified 32px/24px), the CSS wins here
 * the same way it did when this was diffed for react-ui.
 *
 * Mobile has no hover, only a press: this maps Secondary/Primary's CSS
 * `:active` (pressed) colors and Tertiary's transient press overlay, and
 * drops every `:hover` rule entirely rather than simulating it on a touch
 * target - see IconButton.css for the web version, which does use both.
 *
 * Secondary's shadow is Compose's own elevation-based `Modifier.shadow`,
 * not a literal replication of the CSS `box-shadow` blur radius (Compose
 * has no direct box-shadow primitive, see theme/Tokens.kt's SnackyShadow
 * doc comment).
 */
@Composable
fun SnackyIconButton(
    icon: @Composable () -> Unit,
    onClick: () -> Unit,
    contentDescription: String,
    modifier: Modifier = Modifier,
    variant: IconButtonVariant = IconButtonVariant.Primary,
    size: IconButtonSize = IconButtonSize.Default,
    selected: Boolean = false,
    enabled: Boolean = true,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()
    val colors = resolveIconButtonColors(variant, selected, enabled, pressed)
    val outerSize = when {
        variant == IconButtonVariant.Primary && size == IconButtonSize.Small -> 24.dp
        variant == IconButtonVariant.Primary -> 32.dp
        else -> 40.dp
    }
    val iconSize = when (variant) {
        IconButtonVariant.Primary -> 16.dp
        IconButtonVariant.Secondary -> 20.dp
        IconButtonVariant.Tertiary -> 24.dp
    }

    Box(
        modifier = modifier
            .size(outerSize)
            .then(
                if (variant == IconButtonVariant.Secondary && enabled) {
                    Modifier.shadow(elevation = 4.dp, shape = CircleShape, clip = false)
                } else {
                    Modifier
                }
            )
            .clip(CircleShape)
            .background(colors.background)
            .then(if (colors.borderColor != null) Modifier.border(1.dp, colors.borderColor, CircleShape) else Modifier)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick,
            )
            .semantics { this.contentDescription = contentDescription },
        contentAlignment = Alignment.Center,
    ) {
        Box(modifier = Modifier.size(iconSize), contentAlignment = Alignment.Center) {
            CompositionLocalProvider(LocalContentColor provides colors.iconColor) {
                icon()
            }
        }
    }
}

private data class IconButtonColors(
    val background: Color,
    val iconColor: Color,
    val borderColor: Color?,
)

private fun resolveIconButtonColors(
    variant: IconButtonVariant,
    selected: Boolean,
    enabled: Boolean,
    pressed: Boolean,
): IconButtonColors = when (variant) {
    IconButtonVariant.Primary -> when {
        !enabled -> IconButtonColors(SnackyColor.bgActionDisabled, SnackyColor.textActionDisabled, SnackyColor.borderActionDisabled)
        pressed -> IconButtonColors(SnackyColor.bgActionPrimaryPressed, SnackyColor.textPrimary, null)
        else -> IconButtonColors(SnackyColor.bgActionPrimary, SnackyColor.textPrimary, null)
    }
    IconButtonVariant.Secondary -> when {
        // Disabled wins over selected even though the source CSS's cascade
        // order technically lets a disabled+selected favorite show active
        // red (later rule, equal specificity) - treated as an unintentional
        // edge case, not a spec to replicate; a disabled toggle shouldn't
        // read as "on".
        !enabled -> IconButtonColors(SnackyColor.bgActionDisabled, SnackyColor.iconDisabled, null)
        pressed -> IconButtonColors(SnackyColor.bgActionSecondaryPressed, if (selected) SnackyColor.iconActive else SnackyColor.iconSecondary, null)
        else -> IconButtonColors(SnackyColor.bgActionSecondary, if (selected) SnackyColor.iconActive else SnackyColor.iconSecondary, null)
    }
    IconButtonVariant.Tertiary -> when {
        !enabled -> IconButtonColors(Color.Transparent, SnackyColor.iconDisabled, null)
        pressed -> IconButtonColors(Color.Black.copy(alpha = 0.12f), SnackyColor.iconPrimary, null)
        else -> IconButtonColors(Color.Transparent, SnackyColor.iconPrimary, null)
    }
}
