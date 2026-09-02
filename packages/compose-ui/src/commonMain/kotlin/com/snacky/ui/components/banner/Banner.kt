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
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
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
        // Figma's own frame is 312dp and hugs its content, which is why this was
        // briefly hug-width (no fillMaxWidth()). That reads fine in isolation,
        // but real usage sits this next to a sibling of the same width (a
        // "Default"/"LowBalance" pair), and hugging made a low-balance "0" /
        // "Rp 0" row collapse to a fraction of its sibling's width, stranded
        // inside whatever wider container held it. fillMaxWidth() keeps the
        // banner a consistent width regardless of content length;
        // horizontalArrangement stays spacedBy (not SpaceBetween) so the two
        // item groups still stay grouped on the left instead of spreading
        // across the full width the way the original SpaceBetween bug did.
        modifier = modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min) // lets the divider below actually stretch
            .clip(RoundedCornerShape(SnackyRadius.card))
            .background(SnackyColor.bgSurfaceHighlight)
            .border(1.dp, SnackyColorPrimitive.Primary.c500, RoundedCornerShape(SnackyRadius.card))
            .padding(horizontal = SnackySpacingPrimitive.space16, vertical = SnackySpacingPrimitive.space8),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space8),
    ) {
        // Figma's own auto-layout sets both item columns to fill-container,
        // splitting the row 50/50 around the divider (confirmed in dev-mode
        // inspect) - without weight(1f) the two hug-width rows just packed
        // against the start edge, leaving the divider stranded right after the
        // first group instead of centred, and a growing empty band of surface
        // colour on the end in any container wider than the content itself.
        Box(modifier = Modifier.weight(1f)) {
            PointBalanceItem(pointsLabel, points, pointsIcon)
        }
        // react-ui's divider is `align-self: stretch`, so it spans the row's
        // content box rather than a fixed height.
        Box(
            modifier = Modifier
                .width(1.dp)
                .fillMaxHeight()
                .background(SnackyColorPrimitive.Primary.c500),
        )
        Box(modifier = Modifier.weight(1f)) {
            PointBalanceItem(balanceLabel, balance, balanceIcon)
        }
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
        // 12dp, per Figma's "Points and Balance Container". This was
        // SnackyGap.iconLabel (4dp), which the token documents as a *vertical*
        // navbar/menu icon-to-label gap, so it was wrong on both axis and value
        // and left the icon jammed against the text. No semantic gap token is
        // 12dp, hence the primitive.
        horizontalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space12),
    ) {
        if (icon != null) {
            // Figma binds both icons to icon/icon-brand and draws them at 16x16.
            // Providing the tint here means a caller's SnackyIcon picks up the accent
            // instead of inheriting the row's dark label colour.
            Box(modifier = Modifier.size(16.dp), contentAlignment = Alignment.Center) {
                CompositionLocalProvider(LocalContentColor provides SnackyColor.iconBrand) {
                    icon()
                }
            }
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
            // 40dp is Figma's single-line sample, not a cap - a fixed height
            // clipped any message long enough to wrap onto a second line.
            // heightIn(min) keeps the 40dp default and lets the row grow for
            // taller wrapped content instead, matching react-ui's min-height.
            .heightIn(min = 40.dp)
            .background(SnackyColor.bgSurfaceAccent)
            .padding(horizontal = SnackySpacingPrimitive.space24, vertical = SnackySpacingPrimitive.space8),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        BasicText(
            text = message,
            modifier = Modifier.weight(1f),
            style = bannerStyle(SnackyTypography.Body.regular, SnackyColor.textInverse),
        )
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
