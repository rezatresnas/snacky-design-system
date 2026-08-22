package com.snacky.ui.components.banner

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography
import com.snacky.ui.theme.SnackyTypographyToken

/**
 * Snacky Hero Banner - the main promo carousel image at the top of the home
 * screen. Mirrors packages/react-ui's `HeroBanner`.
 *
 * Like [com.snacky.ui.components.avatar.SnackyAvatar], this ships no image
 * loader (no network/bitmap dependency in this package), so [content] is
 * whatever image composable you already use - Coil's `AsyncImage`, a raw
 * `Image(bitmap = ...)`, etc. This handles the frame: radius, elevation and
 * the clip, so the image cannot paint outside the rounded corners.
 *
 * Height is caller-owned (react-ui sets only `width: 100%` with
 * `object-fit: cover`, no aspect ratio), unlike [SnackySquareBanner] and
 * [SnackyFullWidthBanner], which do pin one.
 */
@Composable
fun SnackyHeroBanner(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .shadow(elevation = 4.dp, shape = RoundedCornerShape(SnackyRadius.field))
            .clip(RoundedCornerShape(SnackyRadius.field)),
    ) {
        content()
    }
}

/**
 * Snacky Square Banner - featured category tile (Discount / Favourites /
 * Deals). Pins the documented 360:334 ratio and an 8dp radius. Mirrors
 * packages/react-ui's `SquareBanner`.
 */
@Composable
fun SnackySquareBanner(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(360f / 334f)
            .clip(RoundedCornerShape(SnackyRadius.bubble)),
    ) {
        content()
    }
}

/**
 * Snacky Full-width Banner - prominent promotional banner, 360:176, no
 * radius and no elevation (it runs edge to edge). Mirrors
 * packages/react-ui's `FullWidthBanner`.
 *
 * Carried over from the spec, worth confirming with design rather than
 * treating as settled: Figma names this property value "banner-detail",
 * which suggests it may be meant specifically for a product/order
 * detail-page context rather than a generic full-width placement.
 */
@Composable
fun SnackyFullWidthBanner(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(360f / 176f),
    ) {
        content()
    }
}

/**
 * Snacky Point Balance Banner - loyalty points + wallet balance summary
 * strip, split by a hairline divider. Mirrors packages/react-ui's
 * `PointBalanceBanner`.
 *
 * The border and divider use the raw `primary-500` primitive rather than a
 * semantic token, matching react-ui exactly - the design system has no
 * semantic "accent outline" token, and inventing a binding Figma does not
 * actually carry is what caused earlier mislabels elsewhere in this package.
 *
 * The "Points"/"Balance" captions are parameters rather than hardcoded
 * strings (react-ui hardcodes them in English), so this stays usable in a
 * localised app.
 */
@Composable
fun SnackyPointBalanceBanner(
    points: String,
    balance: String,
    modifier: Modifier = Modifier,
    pointsLabel: String = "Points",
    balanceLabel: String = "Balance",
    pointsIcon: (@Composable () -> Unit)? = null,
    balanceIcon: (@Composable () -> Unit)? = null,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min) // lets the divider below actually stretch
            .clip(RoundedCornerShape(SnackyRadius.card))
            .background(SnackyColor.bgSurfaceHighlight)
            .border(1.dp, SnackyColorPrimitive.Primary.c500, RoundedCornerShape(SnackyRadius.card))
            .padding(horizontal = SnackySpacingPrimitive.space16, vertical = SnackySpacingPrimitive.space8),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        PointBalanceItem(pointsLabel, points, pointsIcon)
        // react-ui's divider is `align-self: stretch`, so it spans the row's
        // content box rather than a fixed height.
        Box(
            modifier = Modifier
                .width(1.dp)
                .fillMaxHeight()
                .background(SnackyColorPrimitive.Primary.c500),
        )
        PointBalanceItem(balanceLabel, balance, balanceIcon)
    }
}

@Composable
private fun PointBalanceItem(
    label: String,
    value: String,
    icon: (@Composable () -> Unit)?,
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
    ) {
        if (icon != null) {
            Box(modifier = Modifier.size(24.dp), contentAlignment = Alignment.Center) { icon() }
        }
        Column {
            BasicText(text = label, style = bannerStyle(SnackyTypography.Small.regular, SnackyColor.textPrimary))
            BasicText(text = value, style = bannerStyle(SnackyTypography.Small.bold, SnackyColor.textPrimary))
        }
    }
}

/**
 * Snacky Alert Banner - inline info/warning strip on the accent red surface,
 * optionally with a trailing countdown. Mirrors packages/react-ui's
 * `AlertBanner`.
 */
@Composable
fun SnackyAlertBanner(
    message: String,
    modifier: Modifier = Modifier,
    countdown: String? = null,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(40.dp)
            .background(SnackyColor.bgSurfaceAccent)
            .padding(horizontal = SnackySpacingPrimitive.space24, vertical = SnackySpacingPrimitive.space8),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        BasicText(text = message, style = bannerStyle(SnackyTypography.Body.regular, SnackyColor.textInverse))
        if (countdown != null) {
            BasicText(
                text = countdown,
                modifier = Modifier.padding(start = SnackySpacingPrimitive.space4),
                style = bannerStyle(SnackyTypography.Body.semibold, SnackyColor.textInverse),
            )
        }
    }
}

private fun bannerStyle(
    token: SnackyTypographyToken,
    color: androidx.compose.ui.graphics.Color,
): TextStyle = TextStyle(
    color = color,
    fontSize = token.fontSize,
    fontWeight = token.fontWeight,
    lineHeight = token.lineHeight,
    letterSpacing = token.letterSpacing,
)
