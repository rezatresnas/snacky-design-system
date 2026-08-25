package com.snacky.ui.components.tab

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Tab Row - inline tab selector with a 2dp accent underline on the
 * active tab. Mirrors packages/react-ui's Tab.tsx/Tab.css.
 *
 * Found and fixed one real bug in react-ui's Tab.css and both of
 * index.html's surfaces (Live Preview, Spec-tab) while porting, confirmed
 * against Figma (node 386:10909, page "Tab"): the active label is a
 * distinct, darker value (#b08224) from the underline (#f8b732) - both had
 * the same color repeated for label and underline instead.
 *
 * Re-verified in a later pass: the active label's real bound Figma
 * variable is text/on-action/text-on-action-tertiary, not the raw
 * primary-700 primitive first assumed (same #b08224 value either way) -
 * the same semantic token Tertiary buttons use for their default label,
 * reused here since Tab's active state is the same kind of accent-colored
 * interactive text. The underline's own bound variable turned out to be
 * border/input/border-input-active (an input-focus token, same #f8b732
 * value) - that reads as incidental Figma variable reuse rather than an
 * intentional shared role, so it stays on the primitive `Primary.c500`
 * here rather than adopting a misleading semantic name.
 */
@Composable
fun SnackyTabRow(
    tabs: List<String>,
    selected: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .drawBehind {
                drawLine(
                    color = SnackyColor.borderMain,
                    start = Offset(0f, size.height),
                    end = Offset(size.width, size.height),
                    strokeWidth = 1.dp.toPx(),
                )
            },
        horizontalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space24),
    ) {
        tabs.forEachIndexed { index, tab ->
            val active = index == selected
            val style = if (active) SnackyTypography.Body.semibold else SnackyTypography.Body.regular
            val color = if (active) SnackyColor.textOnActionTertiary else SnackyColor.textPrimary

            Column(
                modifier = Modifier
                    .selectable(
                        selected = active,
                        onClick = { onSelect(index) },
                        role = Role.Tab,
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                    )
                    // Figma's real gap here is gap.text-underline (16dp, its own
                    // token documented for exactly this: "Text -> underline
                    // indicator gap (Tab)"), not space12, and the accent line is
                    // drawn behind the column rather than as its own Box so it
                    // doesn't add height on top - a real 2dp Box after a 16dp
                    // spacer measured 24+16+2=42 against Figma's declared 40
                    // (24 text + 16 gap, line overlaid at the boundary, the same
                    // technique the row's own border above already uses).
                    .drawBehind {
                        if (active) {
                            drawLine(
                                color = SnackyColorPrimitive.Primary.c500,
                                start = Offset(0f, size.height),
                                end = Offset(size.width, size.height),
                                strokeWidth = 2.dp.toPx(),
                            )
                        }
                    },
            ) {
                BasicText(
                    text = tab,
                    style = TextStyle(
                        color = color,
                        fontSize = style.fontSize,
                        fontWeight = style.fontWeight,
                        lineHeight = style.lineHeight,
                        letterSpacing = style.letterSpacing,
                    ),
                )
                Spacer(Modifier.height(SnackyGap.textUnderline))
            }
        }
    }
}
