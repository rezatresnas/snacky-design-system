package com.snacky.ui.components.badge

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackyTypography

/**
 * Badge family - four small independent components, mirroring
 * packages/react-ui's Badge.tsx/Badge.css exactly (same split, same
 * verified spec). Confirmed against Figma (node 8792:6172, page "Badge"):
 * all four variants matched already, no color/token bugs found this time
 * (a 7dp vs 8dp horizontal-padding difference on Sold looked like a Figma
 * auto-layout hug-content rounding artifact, not an intentional value, so
 * this still uses the spacing-8 token like react-ui does).
 */

/** Numeric count overlay on an icon (e.g. cart). Hides entirely when count <= 0. */
@Composable
fun SnackyBadge(
    count: Int,
    modifier: Modifier = Modifier,
    max: Int = 99,
    content: @Composable () -> Unit,
) {
    Box(modifier = modifier) {
        content()
        if (count > 0) {
            val text = if (count > max) "$max+" else "$count"
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = 10.dp, y = (-8).dp)
                    .defaultMinSize(minWidth = 20.dp)
                    .height(19.dp)
                    .clip(RoundedCornerShape(SnackyRadius.full))
                    .background(SnackyColor.bgSurfaceAccent)
                    .padding(horizontal = 4.dp, vertical = 2.dp),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    text = text,
                    style = TextStyle(
                        color = SnackyColor.textInverse,
                        fontSize = SnackyTypography.Caption.semibold.fontSize,
                        fontWeight = SnackyTypography.Caption.semibold.fontWeight,
                        letterSpacing = SnackyTypography.Caption.semibold.letterSpacing,
                    ),
                )
            }
        }
    }
}

/** Inline promo/percentage-off tag, e.g. on Product Card. */
@Composable
fun SnackyDiscountTag(label: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(SnackyRadius.tag))
            .background(SnackyColor.bgSurfaceAccent)
            .padding(horizontal = 4.dp, vertical = 2.dp),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            text = label,
            style = TextStyle(
                color = SnackyColor.textInverse,
                fontSize = SnackyTypography.Caption.semibold.fontSize,
                fontWeight = SnackyTypography.Caption.semibold.fontWeight,
                letterSpacing = SnackyTypography.Caption.semibold.letterSpacing,
            ),
        )
    }
}

/** Absolute overlay on a product image. Position it with your own layout. */
@Composable
fun SnackySoldOutBadge(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(SnackyRadius.full))
            .background(SnackyColor.bgOverlayDim)
            .padding(horizontal = 8.dp, vertical = 12.dp),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            text = "Sold Out",
            style = TextStyle(
                color = SnackyColor.textInverse,
                fontSize = SnackyTypography.Small.regular.fontSize,
                fontWeight = SnackyTypography.Small.regular.fontWeight,
                lineHeight = SnackyTypography.Small.regular.lineHeight,
                letterSpacing = SnackyTypography.Small.regular.letterSpacing,
            ),
        )
    }
}

/**
 * Static, non-interactive `Label: Value` chip on the accent-highlighted
 * style, for a single attribute of something: the selected product variant,
 * a loyalty points total, and so on.
 *
 * Named for the shape of the information, not one use of it. It was
 * `SnackyVariantBadge` until Figma grew a second use (`Points: 20,000` in the
 * Home header), which was identical apart from the icon - so [icon] became a
 * slot rather than the pattern becoming a second component.
 *
 * [label] is the whole string including its own prefix, matching Figma, which
 * draws it as a single text node rather than a label/value pair.
 */
@Composable
fun SnackyInfoBadge(
    label: String,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
) {
    val shape = RoundedCornerShape(SnackyRadius.field)
    Row(
        modifier = modifier
            .clip(shape)
            .background(SnackyColor.bgSurfaceHighlight)
            .border(1.dp, SnackyColorPrimitive.Primary.c500, shape)
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.textIcon),
    ) {
        if (icon != null) {
            // 12dp, raw rather than a token on purpose: the icon size scale is
            // 16/20/24 (SnackySize.Icon.sm/md/lg) and Figma draws this one at
            // 12, below the smallest step. Sized here rather than left to the
            // caller so the badge stays 32 tall whatever icon is passed in.
            Box(modifier = Modifier.size(12.dp)) {
                CompositionLocalProvider(LocalContentColor provides SnackyColor.iconBrand) {
                    icon()
                }
            }
        }
        BasicText(
            text = label,
            style = TextStyle(
                color = SnackyColor.textPrimary,
                fontSize = SnackyTypography.Caption.regular.fontSize,
                fontWeight = SnackyTypography.Caption.regular.fontWeight,
                letterSpacing = SnackyTypography.Caption.regular.letterSpacing,
            ),
        )
    }
}

@Deprecated(
    "Renamed to SnackyInfoBadge - the same component, now with an optional icon slot.",
    ReplaceWith("SnackyInfoBadge(label, modifier)"),
)
@Composable
fun SnackyVariantBadge(label: String, modifier: Modifier = Modifier) =
    SnackyInfoBadge(label = label, modifier = modifier)
