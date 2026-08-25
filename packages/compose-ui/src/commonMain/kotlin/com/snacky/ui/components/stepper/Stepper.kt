package com.snacky.ui.components.stepper

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyLayout
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

enum class StepState { Done, Pending, Cancelled }

data class Step(
    val label: String,
    val timestamp: String? = null,
    val state: StepState = StepState.Pending,
)

/**
 * Snacky Stepper - the vertical order-progress timeline behind Section's four
 * `order-status-*` variants and Modal's driver-tracking sheet. Mirrors
 * packages/react-ui's Stepper.tsx/Stepper.css.
 *
 * Figma had 19 hand-drawn copies of this across 5 documented variants, under two
 * different frame names (`Order status step` in Section, `Driver Order Status
 * Item` in Modal), which is what made it worth extracting.
 *
 * Two things that had to be read from geometry rather than layer names:
 * the dot states come from real fills (`order-status-received` has a dot named
 * "disabled" that is filled icon-brand, i.e. actually done), and the connector
 * is a LINE rotated -90 degrees, so it reads as w=192/h=0 in the API despite
 * being the vertical dashed rule between dots.
 */
@Composable
fun SnackyStepper(
    steps: List<Step>,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier,
        // Figma "Order status progress": VERTICAL, 32 between steps.
        verticalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space32),
    ) {
        steps.forEachIndexed { index, step ->
            val isLast = index == steps.lastIndex
            Row(
                modifier = Modifier.defaultMinSize(minHeight = 48.dp),
                // Figma "Order status step": HORIZONTAL, gap 16.
                horizontalArrangement = Arrangement.spacedBy(SnackyLayout.block),
            ) {
                StepDot(step.state, drawConnector = !isLast)
                Column {
                    BasicText(
                        text = step.label,
                        style = TextStyle(
                            color = when (step.state) {
                                StepState.Done -> SnackyColor.textPrimary
                                StepState.Pending -> SnackyColor.textSecondary
                                StepState.Cancelled -> SnackyColor.textError
                            },
                            fontSize = SnackyTypography.Small.bold.fontSize,
                            fontWeight = SnackyTypography.Small.bold.fontWeight,
                            lineHeight = SnackyTypography.Small.bold.lineHeight,
                            letterSpacing = SnackyTypography.Small.bold.letterSpacing,
                        ),
                    )
                    if (step.timestamp != null) {
                        BasicText(
                            text = step.timestamp,
                            style = TextStyle(
                                color = SnackyColor.textSecondary,
                                fontSize = SnackyTypography.Small.regular.fontSize,
                                fontWeight = SnackyTypography.Small.regular.fontWeight,
                                lineHeight = SnackyTypography.Small.regular.lineHeight,
                                letterSpacing = SnackyTypography.Small.regular.letterSpacing,
                            ),
                        )
                    }
                }
            }
        }
    }
}

/** 24dp slot holding a 16dp circle, per Figma's "Progress dot" frames. */
@Composable
private fun StepDot(state: StepState, drawConnector: Boolean) {
    Box(
        modifier = Modifier
            .size(24.dp)
            .drawBehind {
                if (!drawConnector) return@drawBehind
                // Runs from below the dot into the 32dp gap to the next step,
                // matching the single rotated dashed LINE Figma uses.
                drawLine(
                    color = SnackyColor.borderMain,
                    start = Offset(size.width / 2f, size.height),
                    end = Offset(size.width / 2f, size.height + 32.dp.toPx()),
                    strokeWidth = 1.dp.toPx(),
                    pathEffect = PathEffect.dashPathEffect(
                        floatArrayOf(6.dp.toPx(), 6.dp.toPx()),
                    ),
                )
            },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(16.dp)
                .clip(CircleShape)
                .background(
                    when (state) {
                        StepState.Done -> SnackyColor.iconBrand
                        StepState.Pending -> SnackyColor.bgActionDisabled
                        StepState.Cancelled -> SnackyColor.bgSurfaceAccent
                    }
                ),
            contentAlignment = Alignment.Center,
        ) {
            if (state == StepState.Cancelled) {
                SnackyIcon(SnackyIcons.Outline.Close, size = 12.dp, tint = SnackyColor.iconOnAccent)
            }
        }
    }
}
