package com.snacky.ui.components.input

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Address Search Result - a single selectable address row in a
 * results list. Mirrors packages/react-ui's
 * AddressResult.tsx/AddressResult.css: the icon aligns to the top of the
 * row (not centred) with a 2dp nudge so it sits on the title's baseline,
 * and the subtitle truncates to one line.
 */
@Composable
fun SnackyAddressResult(
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(SnackyRadius.field))
            .background(SnackyColor.bgSurface)
            .border(1.dp, SnackyColor.borderInputDefault, RoundedCornerShape(SnackyRadius.field))
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onClick,
                    )
                } else {
                    Modifier
                },
            )
            .padding(horizontal = SnackySpacingPrimitive.space8, vertical = SnackySpacingPrimitive.space12),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.textIcon),
    ) {
        if (icon != null) {
            FieldIcon(icon, modifier = Modifier.padding(top = 2.dp))
        }
        Column {
            BasicText(
                text = title,
                style = SnackyColor.textPrimary.asStyle(SnackyTypography.Small.bold),
            )
            BasicText(
                text = subtitle,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                style = SnackyColor.textPrimary.asStyle(SnackyTypography.Small.regular),
            )
        }
    }
}
