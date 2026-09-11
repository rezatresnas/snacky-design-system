package com.snacky.ui.components.section

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.components.iconbutton.IconButtonSize
import com.snacky.ui.components.iconbutton.SnackyIconButton
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyLayout
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Section - the shared shell wrapping the app's composite content
 * blocks (variant selector, product description, buyer reviews, horizontal/
 * vertical product groups, order summary, etc). Mirrors packages/react-ui's
 * Section.tsx/Section.css.
 *
 * The "see more" action is the shared [SnackyIconButton] at
 * [IconButtonSize.Small]: every Section header in Figma (component set
 * 351:7830) instances the Icon-Button set's small variant, a 24dp circle
 * carrying the full-size `fi-sr-angle-small-right` chevron. An earlier port
 * drew its own 16dp stroked chevron here instead, at about 60% of Figma's
 * size. The chevron is #333333 either way (Figma binds text/text-primary on
 * the Section instance, icon-primary resolves to the same value).
 *
 * Also confirmed, but not something to "fix": shell padding is content-
 * dependent in some real variants (e.g. Figma's "Variant" variant has 0
 * horizontal padding at the shell level, with the header itself owning the
 * 24dp instead) - a content-composition pattern like BottomSheet's per-
 * variant spacing, not a shell bug; [content] can override this shell's
 * default padding when a specific composition needs to.
 */
@Composable
fun SnackySection(
    title: String,
    modifier: Modifier = Modifier,
    onAction: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(SnackyColor.bgSurface)
            .padding(horizontal = SnackySpacingPrimitive.space24, vertical = SnackySpacingPrimitive.space16),
        verticalArrangement = Arrangement.spacedBy(SnackyLayout.block),
    ) {
        // Figma's Section headers are 30dp tall, cropping the title's 36sp line
        // box from the top: the title stays top-aligned, the chevron centers.
        Row(
            modifier = Modifier.fillMaxWidth().height(30.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top,
        ) {
            BasicText(
                text = title,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                style = TextStyle(
                    color = SnackyColor.textPrimary,
                    fontSize = SnackyTypography.H3.bold.fontSize,
                    fontWeight = SnackyTypography.H3.bold.fontWeight,
                    lineHeight = SnackyTypography.H3.bold.lineHeight,
                    letterSpacing = SnackyTypography.H3.bold.letterSpacing,
                ),
            )
            if (onAction != null) {
                SnackyIconButton(
                    icon = { SnackyIcon(SnackyIcons.Solid.AngleSmallRight) },
                    onClick = onAction,
                    contentDescription = "See more: $title",
                    modifier = Modifier.align(Alignment.CenterVertically),
                    size = IconButtonSize.Small,
                )
            }
        }
        content()
    }
}
