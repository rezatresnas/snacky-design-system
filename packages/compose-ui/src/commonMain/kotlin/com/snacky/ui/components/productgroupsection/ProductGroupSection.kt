package com.snacky.ui.components.productgroupsection

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layout
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.components.iconbutton.IconButtonSize
import com.snacky.ui.components.iconbutton.SnackyIconButton
import com.snacky.ui.components.section.SnackySection
import com.snacky.ui.components.section.SnackySectionHeader
import com.snacky.ui.theme.LocalSnackyFontFamily
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyLayout
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/** How a [SnackyProductGroupSection] lays out its products. */
enum class ProductGroupLayout {
    /** One scrolling row of cards. Figma Section `Group-Products-Horizontal`. */
    Horizontal,

    /** The row laid over a full-bleed banner from x160, scrolling over it. `Group-Products-Banner`. */
    Banner,

    /** Two columns. `Group-Products-vertical`. */
    Grid,
}

/**
 * Snacky Product Group Section: a titled group of product cards, the pattern
 * behind three of Figma's Section variants (8 instances across Home and product
 * detail). Mirrors packages/react-ui's `ProductGroupSection`.
 *
 * [content] is the products, normally [com.snacky.ui.components.productcard.SnackyProductCard]s.
 * [onSeeMore] shows the header chevron and, in the scrolling layouts, the trailing
 * "See other products" card. [banner] is required for [ProductGroupLayout.Banner]:
 * the image composable to draw edge to edge behind the row (this package ships no
 * image loader, the same slot convention as the Banner family).
 */
@Composable
fun SnackyProductGroupSection(
    title: String,
    layout: ProductGroupLayout,
    modifier: Modifier = Modifier,
    onSeeMore: (() -> Unit)? = null,
    seeMoreLabel: String = "See other products",
    banner: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val cardGap = Arrangement.spacedBy(SnackySpacingPrimitive.space8)
    when (layout) {
        ProductGroupLayout.Horizontal -> SnackySection(title = title, modifier = modifier, onAction = onSeeMore) {
            Row(
                // Runs out to the screen's right edge instead of stopping at the
                // shell's 24dp padding, as Figma's row inside a clipped 360 frame does.
                modifier = Modifier
                    .fillMaxWidth()
                    .bleedEnd(SnackySpacingPrimitive.space24)
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = cardGap,
            ) {
                content()
                if (onSeeMore != null) SeeMoreCard(seeMoreLabel, onSeeMore)
            }
        }

        ProductGroupLayout.Grid -> SnackySection(title = title, modifier = modifier, onAction = onSeeMore) {
            // The grid's own two cards are a fixed 152dp each (documented per-component,
            // not a Fill size - see CLAUDE.md), which sums to exactly Figma's 312dp
            // reference content width. On a device wider than Figma's 360dp canvas
            // that content no longer fills the section, and Column's default
            // horizontalAlignment (Start) then leaves the whole grid pinned to the
            // left with the extra width dumped entirely on the right, reading as
            // uncentered/lopsided rather than a snug pair of cards. Centering the grid
            // in the section's full width splits that slack evenly instead.
            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                TwoColumnGrid(gap = SnackySpacingPrimitive.space8, content = content)
            }
        }

        // Figma pads this variant 16/0/0/0: the header keeps its 24dp inset while the
        // banner runs edge to edge, which the Section shell's fixed padding cannot do.
        ProductGroupLayout.Banner -> Column(
            modifier = modifier
                .fillMaxWidth()
                .background(SnackyColor.bgSurface)
                .padding(top = SnackySpacingPrimitive.space16),
            verticalArrangement = Arrangement.spacedBy(SnackyLayout.block),
        ) {
            SnackySectionHeader(
                title = title,
                onAction = onSeeMore,
                modifier = Modifier.padding(horizontal = SnackySpacingPrimitive.space24),
            )
            Box(modifier = Modifier.fillMaxWidth().height(334.dp)) {
                Box(modifier = Modifier.fillMaxSize()) { banner?.invoke() }
                // The padding sits inside the scroll, so the first card starts at x160
                // and scrolling carries the cards over the banner, which stays put.
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = SnackySpacingPrimitive.space24)
                        .horizontalScroll(rememberScrollState())
                        .padding(start = 160.dp),
                    horizontalArrangement = cardGap,
                ) {
                    content()
                    if (onSeeMore != null) SeeMoreCard(seeMoreLabel, onSeeMore)
                }
            }
        }
    }
}

/**
 * "See other products": the trailing card in a scrolling row. Figma draws it by hand
 * (145x294, 8 padding, 5 gap) with the same surface and elevation as the list
 * ProductCard; 294 is that card's fixed height, so the two line up.
 */
@Composable
private fun SeeMoreCard(label: String, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(145.dp)
            .height(294.dp)
            .shadow(elevation = 10.dp, shape = RoundedCornerShape(SnackyRadius.field))
            .background(SnackyColor.bgSurface, RoundedCornerShape(SnackyRadius.field))
            .padding(SnackySpacingPrimitive.space8),
        verticalArrangement = Arrangement.spacedBy(5.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        SnackyIconButton(
            icon = { SnackyIcon(SnackyIcons.Solid.AngleSmallRight) },
            onClick = onClick,
            contentDescription = label,
            size = IconButtonSize.Small,
        )
        BasicText(
            text = label,
            style = TextStyle(
                color = SnackyColor.textLink,
                fontFamily = LocalSnackyFontFamily.current,
                fontSize = SnackyTypography.Small.bold.fontSize,
                fontWeight = SnackyTypography.Small.bold.fontWeight,
                lineHeight = SnackyTypography.Small.bold.lineHeight,
                letterSpacing = SnackyTypography.Small.bold.letterSpacing,
                textAlign = TextAlign.Center,
            ),
        )
    }
}

/**
 * Two equal-width columns, [gap] apart both ways, wrapping [content]'s children two per
 * row in the order they compose. Figma's Group-Products-vertical is a fixed 2-column
 * grid, not a wrap that wants more columns on a wider screen, so this hand-rolls exactly
 * that with the stable [Layout] API rather than reaching for `FlowRow`.
 *
 * `FlowRow` used to do this job, but it is `@ExperimentalLayoutApi`, and Compose gives no
 * binary-compatibility guarantee on experimental APIs between versions: Foundation 1.11.0
 * inserted a new parameter into `FlowRow`'s signature that Foundation 1.7.1 (what this
 * package compiles against) does not have, so any app on a newer Compose BOM than this
 * package crashed at runtime with `NoSuchMethodError`, even though everything compiled
 * cleanly on both sides. A published binary library cannot control which Compose version
 * the host app resolves, so it cannot depend on an API with no such guarantee for a shape
 * this simple.
 */
@Composable
private fun TwoColumnGrid(gap: Dp, content: @Composable () -> Unit) {
    Layout(content = content) { measurables, constraints ->
        val gapPx = gap.roundToPx()
        val childConstraints = Constraints(maxWidth = constraints.maxWidth)
        val placeables = measurables.map { it.measure(childConstraints) }
        val rows = placeables.chunked(2)
        val columnWidth = placeables.maxOfOrNull { it.width } ?: 0
        val rowHeights = rows.map { row -> row.maxOf { it.height } }
        val width = if (rows.any { it.size > 1 }) columnWidth * 2 + gapPx else columnWidth
        val height = rowHeights.sum() + gapPx * (rows.size - 1).coerceAtLeast(0)
        layout(width.coerceAtMost(constraints.maxWidth), height) {
            var y = 0
            rows.forEachIndexed { index, row ->
                var x = 0
                row.forEach { placeable ->
                    placeable.placeRelative(x, y)
                    x += placeable.width + gapPx
                }
                y += rowHeights[index] + gapPx
            }
        }
    }
}

/** Measures the element [bleed] wider than its parent allows, extending past its end edge. */
private fun Modifier.bleedEnd(bleed: Dp): Modifier = layout { measurable, constraints ->
    if (!constraints.hasBoundedWidth) {
        val placeable = measurable.measure(constraints)
        return@layout layout(placeable.width, placeable.height) { placeable.place(0, 0) }
    }
    val extra = bleed.roundToPx()
    val placeable = measurable.measure(
        constraints.copy(minWidth = constraints.maxWidth + extra, maxWidth = constraints.maxWidth + extra),
    )
    layout(constraints.maxWidth, placeable.height) { placeable.place(0, 0) }
}
