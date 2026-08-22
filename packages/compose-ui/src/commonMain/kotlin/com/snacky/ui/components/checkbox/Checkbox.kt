package com.snacky.ui.components.checkbox

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Checkbox - binary on/off selection control. Mirrors
 * packages/react-ui's Checkbox.tsx/Checkbox.css, confirmed against Figma
 * (node 444:11084): off is a white field (`bgSurfaceField`) with a
 * `borderMain` outline, checked is a solid `bgActionPrimary` fill
 * with a white (`iconOnAccent`) checkmark, not `textPrimary`.
 *
 * Re-verified in a later token-binding audit: the off-state stroke is bound
 * to border/border-main, not the `borderInputDefault` first assumed (same
 * #cccccc value either way).
 *
 * Figma defines no distinct visual for disabled (only On/Off), so [enabled]
 * only gates interactivity here, it doesn't dim or recolor anything - same
 * choice react-ui already made, not an oversight.
 */
@Composable
fun SnackyCheckbox(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Row(
        modifier = modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null,
            enabled = enabled,
            onClick = { onCheckedChange(!checked) },
        ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
    ) {
        val shape = RoundedCornerShape(SnackyRadius.field)
        Box(
            modifier = Modifier
                .size(24.dp)
                .clip(shape)
                .background(if (checked) SnackyColor.bgActionPrimary else SnackyColor.bgSurfaceField)
                .then(
                    if (!checked) Modifier.border(1.dp, SnackyColor.borderMain, shape) else Modifier,
                ),
            contentAlignment = Alignment.Center,
        ) {
            if (checked) {
                // Polyline points (20,6)-(9,17)-(4,12) in a 24x24 viewBox, stroke
                // width 2.5, matching Checkbox.css's checkmark mask exactly, just
                // scaled proportionally to this 18dp (24dp box - 3dp inset) canvas.
                Canvas(modifier = Modifier.size(18.dp)) {
                    val path = Path().apply {
                        moveTo(size.width * (20f / 24f), size.height * (6f / 24f))
                        lineTo(size.width * (9f / 24f), size.height * (17f / 24f))
                        lineTo(size.width * (4f / 24f), size.height * (12f / 24f))
                    }
                    drawPath(
                        path = path,
                        color = SnackyColor.iconOnAccent,
                        style = Stroke(
                            width = size.minDimension * (2.5f / 24f),
                            cap = StrokeCap.Round,
                            join = StrokeJoin.Round,
                        ),
                    )
                }
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
