package com.snacky.ui.components.accordion

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.LocalSnackyFontFamily
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Accordion - header and (when expanded) panel render as two
 * separate elevated cards with a small gap between them, not one
 * continuous card; title size responds to whether [leadingIcon] is passed
 * (matches Figma, which models icon presence as a real variant rather than
 * optional content). Mirrors packages/react-ui's Accordion.tsx/
 * Accordion.css.
 *
 * Found and fixed real bugs in react-ui's Accordion.css/.tsx and every
 * surface in index.html (Live Preview, Spec-tab, both Component Source
 * samples) while porting, confirmed against Figma (node 8696:6572, page
 * "Accordion") via a screenshot and raw node data: an invented border on
 * the no-icon header that doesn't exist in Figma (neither variant, in
 * either state, ever has one - elevation only), the chevron using
 * text-primary instead of icon-secondary, and the panel's padding/card
 * structure. The shared `Acc` helper injected into other playgrounds'
 * iframes already had the structure right, only its chevron color was
 * wrong.
 *
 * Supports both self-managed ([expanded]/[onToggle] omitted) and
 * controlled usage.
 */
@Composable
fun SnackyAccordion(
    title: String,
    modifier: Modifier = Modifier,
    leadingIcon: (@Composable () -> Unit)? = null,
    expanded: Boolean? = null,
    onToggle: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    var internalExpanded by remember { mutableStateOf(false) }
    val isExpanded = expanded ?: internalExpanded
    val toggle = onToggle ?: { internalExpanded = !internalExpanded }
    val rotation by animateFloatAsState(targetValue = if (isExpanded) 180f else 0f)
    val cardShape = RoundedCornerShape(SnackyRadius.field)
    val titleStyle = if (leadingIcon != null) SnackyTypography.Small.semibold else SnackyTypography.Body.semibold

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(elevation = 4.dp, shape = cardShape, clip = false)
                .clip(cardShape)
                .background(SnackyColor.bgSurface)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = toggle,
                )
                .padding(horizontal = 8.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (leadingIcon != null) {
                Box(modifier = Modifier.size(24.dp), contentAlignment = Alignment.Center) {
                    leadingIcon()
                }
                Spacer(Modifier.width(SnackyGap.textIcon))
            }
            BasicText(
                text = title,
                modifier = Modifier.weight(1f),
                style = TextStyle(
                    color = SnackyColor.textPrimary,
                    fontFamily = LocalSnackyFontFamily.current,
                    fontSize = titleStyle.fontSize,
                    fontWeight = titleStyle.fontWeight,
                    lineHeight = titleStyle.lineHeight,
                    letterSpacing = titleStyle.letterSpacing,
                ),
            )
            // The real set icon, not a hand-drawn polyline. Both platforms used
            // to stroke (5,7.5)-(10,12.5)-(15,7.5) in a 20x20 box, copied from
            // each other rather than from Figma, and it was a near miss: measured
            // off `accordion-withicon-default.png`, Figma's chevron is 11.41x5.71
            // and this set icon at 20dp is 11.67x5.98, while the polyline came out
            // 11.50x6.50, about 14% too tall.
            SnackyIcon(
                icon = SnackyIcons.Outline.ChevronDown,
                size = 20.dp,
                tint = SnackyColor.iconSecondary,
                modifier = Modifier.rotate(rotation),
            )
        }
        if (isExpanded) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(elevation = 4.dp, shape = cardShape, clip = false)
                    .clip(cardShape)
                    .background(SnackyColor.bgSurface)
                    .padding(SnackySpacingPrimitive.space12),
                content = content,
            )
        }
    }
}
