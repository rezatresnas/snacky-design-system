package com.snacky.ui.components.productimage

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Where a product image is being shown, which is what decides its frame.
 * Mirrors `ProductImageUsage` in packages/react-ui's ProductImage.tsx.
 */
enum class ProductImageUsage(
    internal val dimension: Dp,
    internal val padded: Boolean,
    internal val bordered: Boolean,
) {
    /** 128dp bare transparent image inside a product card. */
    ProductCard(128.dp, padded = false, bordered = false),

    /** 200dp bare transparent image on the product detail screen. */
    ProductDetails(200.dp, padded = false, bordered = false),

    /** 56dp padded frame in an order/cart list row. */
    List(56.dp, padded = true, bordered = false),

    /** 48dp padded, bordered thumbnail in a review. */
    Review(48.dp, padded = true, bordered = true),

    /** 88dp bordered variant-selection frame. */
    Variant(88.dp, padded = true, bordered = true),

    /** 24dp payment-method logo, not a product photo. */
    AccordionModal(24.dp, padded = false, bordered = false),
}

/**
 * Snacky Product Image - adapts its frame to where it appears, and can
 * overlay a centred "Sold Out" badge. Mirrors packages/react-ui's
 * ProductImage.tsx/ProductImage.css.
 *
 * Ships no image loader (the same gap `SnackyAvatar`, the Banner family and
 * `SnackyIllustration` have), so [content] is whatever image composable you
 * already use. This owns the frame: fixed size per usage, plus the padding,
 * border and radius that go with it.
 *
 * Found and fixed a real bug in react-ui's ProductImage.css while porting:
 * its class names are built as `--${usage}`, but the stylesheet spelled the
 * first two rules `--card`/`--details` rather than `--product-card`/
 * `--product-details`. Those two usages, the 128px card image and the 200px
 * detail image, therefore matched no rule at all and rendered unsized. Fixed
 * there by renaming the selectors, which keeps the public `usage` API
 * unchanged.
 *
 * [soldOut]'s scrim is a literal rgba value in the CSS with no token behind
 * it (white at 46%), so it stays a raw color here too rather than being
 * mapped onto a token that does not actually describe it. The label's own
 * background does have one: `bgOverlayDim`.
 */
@Composable
fun SnackyProductImage(
    usage: ProductImageUsage,
    modifier: Modifier = Modifier,
    soldOut: Boolean = false,
    soldOutLabel: String = "Sold Out",
    content: @Composable () -> Unit,
) {
    val shape = RoundedCornerShape(SnackyRadius.field)
    Box(
        modifier = modifier
            .size(usage.dimension)
            .then(if (usage.bordered) Modifier.border(1.dp, SnackyColor.borderMain, shape) else Modifier)
            .then(if (usage.padded || usage.bordered) Modifier.clip(shape) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .then(if (usage.padded) Modifier.padding(SnackySpacingPrimitive.space4) else Modifier),
        ) {
            content()
        }
        if (soldOut) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    // Untokenised in the source CSS: a literal white-at-46% scrim.
                    .background(Color.White.copy(alpha = 0.46f)),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    text = soldOutLabel,
                    modifier = Modifier
                        .clip(RoundedCornerShape(SnackyRadius.full))
                        .background(SnackyColor.bgOverlayDim)
                        .padding(horizontal = 7.dp, vertical = SnackySpacingPrimitive.space12),
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
    }
}
