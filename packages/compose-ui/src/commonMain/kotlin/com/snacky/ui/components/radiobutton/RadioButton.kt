package com.snacky.ui.components.radiobutton

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Radio Option - single-selection control, always used within a group
 * of 2+ options. Mirrors packages/react-ui's RadioButton.tsx/RadioButton.css,
 * confirmed against Figma (node 366:9683, page "Radio Button"): the ring is
 * a 1px border (react-ui had 1.5px until this same audit fixed it there too),
 * the dot is 12x12dp, and Disabled is a solid `bgSurfaceVariant` (#f3f3f3)
 * fill (react-ui had plain white/`bgSurface` until fixed), not an opacity
 * effect. Disabled suppresses the dot entirely even if selected, matching
 * react-ui and the fact that Figma defines no separate disabled+selected
 * variant to contradict that choice.
 */
@Composable
fun SnackyRadioOption(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val ringColor = when {
        selected && enabled -> SnackyColorPrimitive.Primary.c500
        else -> SnackyColor.borderMain
    }
    val fillColor = if (enabled) Color.Transparent else SnackyColor.bgSurfaceVariant
    val showDot = selected && enabled

    Row(
        modifier = modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null,
            enabled = enabled,
            onClick = onClick,
        ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
    ) {
        Box(
            modifier = Modifier
                .size(24.dp)
                .clip(CircleShape)
                .background(fillColor)
                .border(1.dp, ringColor, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            if (showDot) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .clip(CircleShape)
                        .background(SnackyColorPrimitive.Primary.c500),
                )
            }
        }
        BasicText(
            text = label,
            style = TextStyle(
                color = SnackyColor.textPrimary,
                fontSize = SnackyTypography.Small.regular.fontSize,
                fontWeight = SnackyTypography.Small.regular.fontWeight,
                lineHeight = SnackyTypography.Small.regular.lineHeight,
                letterSpacing = SnackyTypography.Small.regular.letterSpacing,
            ),
        )
    }
}
