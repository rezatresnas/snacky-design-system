package com.snacky.ui.components.productcard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.snacky.ui.components.badge.SnackyDiscountTag
import com.snacky.ui.components.badge.SnackySoldOutBadge
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.components.iconbutton.IconButtonVariant
import com.snacky.ui.components.iconbutton.SnackyIconButton
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography
import com.snacky.ui.theme.SnackyTypographyToken

/**
 * Snacky Product Card (list) - the 152dp card used in horizontal carousels
 * and 2-column grids. Mirrors packages/react-ui's `ProductCard` with its
 * default `variant="list"`.
 *
 * react-ui models the two variants as a discriminated union on one
 * component, because their prop sets genuinely differ (list has
 * `onAddToCart`, details has rating count and three social actions). Kotlin
 * has no equivalent, and faking one with a pile of nullable parameters would
 * let callers build states that cannot exist, so this splits into two
 * composables: [SnackyProductCard] and [SnackyProductCardDetails]. The
 * rendered output matches react-ui's two branches exactly.
 *
 * Image loading is a [image] slot, the same gap `Avatar`, `Banner`,
 * `Illustration` and `ProductImage` all have - this package ships no image
 * loader.
 */
@Composable
fun SnackyProductCard(
    productName: String,
    price: String,
    rating: String,
    onAddToCart: () -> Unit,
    modifier: Modifier = Modifier,
    originalPrice: String? = null,
    discountLabel: String? = null,
    onClick: (() -> Unit)? = null,
    ratingIcon: (@Composable () -> Unit)? = null,
    cartIcon: (@Composable () -> Unit)? = null,
    image: @Composable () -> Unit,
) {
    Column(
        modifier = modifier
            .width(152.dp)
            .shadow(elevation = 10.dp, shape = RoundedCornerShape(SnackyRadius.field))
            .clip(RoundedCornerShape(SnackyRadius.field))
            .background(SnackyColor.bgSurface)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onClick,
                    )
                } else {
                    Modifier
                },
            )
            .padding(horizontal = SnackySpacingPrimitive.space8, vertical = SnackySpacingPrimitive.space12),
        verticalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space12),
    ) {
        Box(modifier = Modifier.size(128.dp)) {
            image()
            if (discountLabel != null) {
                SnackyDiscountTag(label = discountLabel, modifier = Modifier.align(Alignment.TopEnd))
            }
        }
        BasicText(text = productName, style = cardStyle(SnackyTypography.Small.regular, SnackyColor.textPrimary))
        PriceRow(price, originalPrice, detailed = false)
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            RatingLabel(rating, ratingIcon)
            SnackyIconButton(
                // Falls back to the real icon rather than an empty slot, matching
                // react-ui. Sizes come from index.html's verified preview.
                icon = { if (cartIcon != null) cartIcon() else SnackyIcon(SnackyIcons.Outline.CartAdd, size = 16.dp) },
                onClick = onAddToCart,
                contentDescription = "Add to cart",
                variant = IconButtonVariant.Primary,
            )
        }
    }
}

/**
 * Snacky Product Card (details) - the product detail page header: a 200dp
 * centred image, larger name/price type, a rating with its review count, and
 * Favorite/Share/Chat actions. Mirrors packages/react-ui's
 * `variant="details"` branch.
 *
 * Unlike the list card this has no card surface of its own (no radius, no
 * elevation, full width) - it sits directly on the page.
 */
@Composable
fun SnackyProductCardDetails(
    productName: String,
    price: String,
    rating: String,
    ratingCount: String,
    favorited: Boolean,
    onFavoriteClick: () -> Unit,
    onShareClick: () -> Unit,
    onChatClick: () -> Unit,
    modifier: Modifier = Modifier,
    originalPrice: String? = null,
    discountLabel: String? = null,
    soldOut: Boolean = false,
    onClick: (() -> Unit)? = null,
    ratingIcon: (@Composable () -> Unit)? = null,
    favoriteIcon: (@Composable () -> Unit)? = null,
    shareIcon: (@Composable () -> Unit)? = null,
    chatIcon: (@Composable () -> Unit)? = null,
    image: @Composable () -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(SnackyColor.bgSurface)
            .padding(top = SnackySpacingPrimitive.space12, bottom = SnackySpacingPrimitive.space16),
        verticalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space8),
    ) {
        Box(
            modifier = Modifier
                .size(200.dp)
                .align(Alignment.CenterHorizontally)
                .then(
                    if (onClick != null) {
                        Modifier.clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = onClick,
                        )
                    } else {
                        Modifier
                    },
                ),
        ) {
            image()
            if (soldOut) {
                // Sold Out is a centred scrim over the whole image, not a corner
                // tag. This used to align the badge to TopEnd with no scrim,
                // which is DiscountTag's placement, not this one's.
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .padding(horizontal = SnackySpacingPrimitive.space8, vertical = SnackySpacingPrimitive.space12)
                        .background(SnackyColor.bgSurface.copy(alpha = 0.46f)),
                    contentAlignment = Alignment.Center,
                ) {
                    SnackySoldOutBadge()
                }
            }
        }
        BasicText(
            text = productName,
            style = cardStyle(SnackyTypography.Body.regular, SnackyColor.textPrimary),
        )
        PriceRow(price, originalPrice, detailed = true, discountLabel = discountLabel)
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            RatingLabel("$rating ($ratingCount)", ratingIcon)
            Row(horizontalArrangement = Arrangement.spacedBy(SnackyGap.cell)) {
                // react-ui gives these three a slightly softer shadow than the
                // standard Secondary elevation (0 4px 4px vs shadow-md's 0 4px 8px).
                // Compose has no blur-radius control on Modifier.shadow, so they
                // just use SnackyIconButton's own Secondary elevation here.
                SnackyIconButton(
                    // Solid heart when favorited, outline when not, mirroring
                    // index.html's fav-s/fav-o swap.
                    icon = {
                        if (favoriteIcon != null) {
                            favoriteIcon()
                        } else {
                            SnackyIcon(
                                if (favorited) SnackyIcons.Solid.Heart else SnackyIcons.Outline.Heart,
                                size = 20.dp,
                            )
                        }
                    },
                    onClick = onFavoriteClick,
                    contentDescription = "Favorite",
                    variant = IconButtonVariant.Secondary,
                    selected = favorited,
                )
                SnackyIconButton(
                    icon = { if (shareIcon != null) shareIcon() else SnackyIcon(SnackyIcons.Outline.Share, size = 20.dp) },
                    onClick = onShareClick,
                    contentDescription = "Share",
                    variant = IconButtonVariant.Secondary,
                )
                SnackyIconButton(
                    icon = { if (chatIcon != null) chatIcon() else SnackyIcon(SnackyIcons.Outline.Chat, size = 20.dp) },
                    onClick = onChatClick,
                    contentDescription = "Chat with seller",
                    variant = IconButtonVariant.Secondary,
                )
            }
        }
    }
}

@Composable
private fun PriceRow(
    price: String,
    originalPrice: String?,
    detailed: Boolean,
    discountLabel: String? = null,
) {
    Row(
        verticalAlignment = Alignment.Bottom,
        horizontalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space4),
    ) {
        BasicText(
            text = price,
            style = if (detailed) {
                cardStyle(SnackyTypography.Small.bold, SnackyColor.textPrimary).copy(fontSize = 20.sp)
            } else {
                cardStyle(SnackyTypography.Small.bold, SnackyColor.textPrimary)
            },
        )
        if (originalPrice != null) {
            BasicText(
                text = originalPrice,
                style = cardStyle(SnackyTypography.Small.bold, SnackyColor.textSecondary).copy(
                    fontSize = if (detailed) 16.sp else 10.sp,
                    textDecoration = TextDecoration.LineThrough,
                ),
            )
        }
        // Only the details variant shows the discount tag inline with the
        // price; the list variant overlays it on the image instead.
        if (detailed && discountLabel != null) {
            SnackyDiscountTag(label = discountLabel)
        }
    }
}

@Composable
private fun RatingLabel(text: String, ratingIcon: (@Composable () -> Unit)?) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
    ) {
        Box(modifier = Modifier.size(16.dp), contentAlignment = Alignment.Center) {
            // react-ui tints the rating star from the component, not the
            // caller (.snacky-product-card__rating-icon), so the slot
            // inherits that colour here rather than rendering untinted.
            CompositionLocalProvider(LocalContentColor provides SnackyColor.iconBrand) {
                // Defaults to the real star rather than an empty slot: the
                // rating row is never specced without one.
                if (ratingIcon != null) ratingIcon() else SnackyIcon(SnackyIcons.Solid.Star, size = 16.dp)
            }
        }
        BasicText(text = text, style = cardStyle(SnackyTypography.Small.regular, SnackyColor.textSecondary))
    }
}

private fun cardStyle(
    token: SnackyTypographyToken,
    color: androidx.compose.ui.graphics.Color,
): TextStyle = TextStyle(
    color = color,
    fontSize = token.fontSize,
    fontWeight = token.fontWeight,
    lineHeight = token.lineHeight,
    letterSpacing = token.letterSpacing,
)
