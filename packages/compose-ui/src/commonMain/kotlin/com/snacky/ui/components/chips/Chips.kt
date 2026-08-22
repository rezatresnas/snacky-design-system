package com.snacky.ui.components.chips

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackyTypography

/**
 * Chips - two independent pill-toggle components, mirroring
 * packages/react-ui's FilterChip.tsx/ProductChip.tsx/Chips.css exactly
 * (same split, same verified spec). Confirmed against Figma (node
 * 351:6731, page "Chips"): both variants (Produk/Filter) x both states
 * (Default/Selected) matched already, no color/token bugs this time.
 */

private val chipShape: Shape
    get() = RoundedCornerShape(SnackyRadius.full)

private fun chipBackground(selected: Boolean): Color =
    if (selected) SnackyColor.bgSurfaceHighlight else SnackyColor.bgSurface

private fun chipBorderColor(selected: Boolean): Color =
    if (selected) SnackyColorPrimitive.Primary.c500 else SnackyColor.borderMain

private val chipTextStyle: TextStyle
    get() = TextStyle(
        color = SnackyColor.textPrimary,
        fontSize = SnackyTypography.Small.regular.fontSize,
        fontWeight = SnackyTypography.Small.regular.fontWeight,
        lineHeight = SnackyTypography.Small.regular.lineHeight,
        letterSpacing = SnackyTypography.Small.regular.letterSpacing,
    )

/** Text-only pill toggle, e.g. category/sort filters. */
@Composable
fun SnackyFilterChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .clip(chipShape)
            .background(chipBackground(selected))
            .border(1.dp, chipBorderColor(selected), chipShape)
            .toggleable(
                value = selected,
                onValueChange = { onClick() },
                role = Role.Checkbox,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
            )
            .padding(8.dp),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(text = label, style = chipTextStyle)
    }
}

/** Pill chip with a 24x24 thumbnail, e.g. a weight/variant picker. */
@Composable
fun SnackyProductChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    thumbnail: @Composable () -> Unit,
) {
    Row(
        modifier = modifier
            .clip(chipShape)
            .background(chipBackground(selected))
            .border(1.dp, chipBorderColor(selected), chipShape)
            .toggleable(
                value = selected,
                onValueChange = { onClick() },
                role = Role.Checkbox,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
            )
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Box(modifier = Modifier.size(24.dp)) {
            thumbnail()
        }
        BasicText(text = label, style = chipTextStyle)
    }
}
