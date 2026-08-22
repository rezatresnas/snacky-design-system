package com.snacky.ui.components.section

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
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
 * The "see more" action button's chevron icon is textPrimary (#333333),
 * confirmed against Figma (node 8877-8885, page "Section", component set
 * 351:7830) by reading the chevron vector's own bound variable
 * (text/text-primary) directly, not the icon instance's own separate white
 * frame fill, which was misread as the icon color in an earlier pass of
 * this port and briefly "fixed" to white before being caught and reverted.
 * This button is bespoke to Section (like react-ui's own hand-rolled inline
 * SVG button), not the shared IconButton component.
 *
 * Also confirmed, but not something to "fix": shell padding is content-
 * dependent in some real variants (e.g. Figma's "Variant" variant has 0
 * horizontal padding at the shell level, with the header itself owning the
 * 24dp instead) - a content-composition pattern like BottomSheet's per-
 * variant spacing, not a shell bug; [content] can override this shell's
 * default padding when a specific composition needs to.
 *
 * react-ui's CSS only defines a `:hover` rule for the action button (no
 * `:active`) - mobile has no hover, so this maps that hover color onto the
 * press state instead, same convention used for SnackyIconButton's Tertiary
 * variant.
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
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
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
                SectionActionButton(onClick = onAction)
            }
        }
        content()
    }
}

@Composable
private fun SectionActionButton(onClick: () -> Unit) {
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()
    Box(
        modifier = Modifier
            .size(24.dp)
            .clip(CircleShape)
            .background(if (pressed) SnackyColor.bgActionPrimaryHover else SnackyColor.bgActionPrimary)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick,
            )
            .semantics { contentDescription = "See more" },
        contentAlignment = Alignment.Center,
    ) {
        Canvas(modifier = Modifier.size(16.dp)) {
            val path = Path().apply {
                moveTo(size.width * (6f / 16f), size.height * (3.5f / 16f))
                lineTo(size.width * (10.5f / 16f), size.height * (8f / 16f))
                lineTo(size.width * (6f / 16f), size.height * (12.5f / 16f))
            }
            drawPath(
                path = path,
                color = SnackyColor.textPrimary,
                style = Stroke(
                    width = size.minDimension * (1.5f / 16f),
                    cap = StrokeCap.Round,
                    join = StrokeJoin.Round,
                ),
            )
        }
    }
}
