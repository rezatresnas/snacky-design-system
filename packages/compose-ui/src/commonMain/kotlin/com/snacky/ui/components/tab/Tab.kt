package com.snacky.ui.components.tab

import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Tab Row - inline tab selector with a 2dp accent underline on the
 * active tab. Mirrors packages/react-ui's Tab.tsx/Tab.css.
 *
 * Found and fixed one real bug in react-ui's Tab.css and both of
 * index.html's surfaces (Live Preview, Spec-tab) while porting, confirmed
 * against Figma (node 386:10909, page "Tab") via a screenshot and the
 * label/underline's separate node fills: the active label is
 * `primitive.primary.700` (#b08224), a distinct, darker value from the
 * `primitive.primary.500` (#f8b732) underline - both had the same color
 * (primary-500) repeated for label and underline instead.
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
            val color = if (active) SnackyColorPrimitive.Primary.c700 else SnackyColor.textPrimary

            Column(
                modifier = Modifier.selectable(
                    selected = active,
                    onClick = { onSelect(index) },
                    role = Role.Tab,
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                ),
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
                Spacer(Modifier.height(SnackySpacingPrimitive.space12))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(2.dp)
                        .background(if (active) SnackyColorPrimitive.Primary.c500 else Color.Transparent),
                )
            }
        }
    }
}
