package com.snacky.ui.components.toggle

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive

/**
 * Snacky Toggle - switch for settings that take effect immediately, no
 * confirm step. Mirrors packages/react-ui's Toggle.tsx/Toggle.css.
 *
 * Confirmed against Figma (node 441:14339, page "Toggle") during this port:
 * the off-thumb is bound to the icon-disabled variable (#a3a3a3), react-ui
 * had it as neutral-500 (#7a7a7a) until this same audit fixed it there too.
 * The on-track's paint (#fffbe9) isn't bound to any Figma variable and is a
 * few values off bgSurfaceHighlight/primary-50 (#fef8eb) per channel, close
 * enough that this existing token is used rather than inventing a new
 * one-off raw color for what reads as an untokenized value in Figma itself.
 *
 * Disabled dims the whole control to 50% opacity, matching Toggle.css - the
 * one component so far with an actual defined disabled treatment, unlike
 * Checkbox/RadioButton where Figma leaves it unspecified.
 */
@Composable
fun SnackyToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val trackColor by animateColorAsState(
        targetValue = if (checked) SnackyColor.bgSurfaceHighlight else SnackyColor.bgActionDisabled,
        animationSpec = tween(200),
    )
    val thumbColor by animateColorAsState(
        targetValue = if (checked) SnackyColorPrimitive.Primary.c500 else SnackyColor.iconDisabled,
        animationSpec = tween(200),
    )
    val thumbOffset by animateDpAsState(
        targetValue = if (checked) 24.dp else 0.dp,
        animationSpec = tween(200),
    )

    Box(
        modifier = modifier
            .size(width = 56.dp, height = 32.dp)
            .alpha(if (enabled) 1f else 0.5f)
            .toggleable(
                value = checked,
                onValueChange = onCheckedChange,
                enabled = enabled,
                role = Role.Switch,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
            ),
    ) {
        Box(
            modifier = Modifier
                .align(Alignment.CenterStart)
                .size(width = 56.dp, height = 24.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(trackColor),
        )
        Box(
            modifier = Modifier
                .align(Alignment.CenterStart)
                .offset(x = thumbOffset)
                .size(32.dp)
                .shadow(elevation = 1.dp, shape = CircleShape, clip = false)
                .clip(CircleShape)
                .background(thumbColor),
        )
    }
}
