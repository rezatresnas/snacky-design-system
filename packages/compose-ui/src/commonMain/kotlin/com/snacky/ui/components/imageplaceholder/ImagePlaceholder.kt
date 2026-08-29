package com.snacky.ui.components.imageplaceholder

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import com.snacky.ui.theme.SnackyColor

/**
 * Snacky Image Placeholder - a neutral "no image yet" state for any of this
 * package's required image slots (SnackyProductCard, SnackyProductImage,
 * SnackyAvatar, the Banner family). This package ships no photography or
 * illustration artwork - every image `content` slot is required rather than
 * optional (no default value), so pass this explicitly for a genuinely
 * empty state (a new product with no photo yet) instead of inventing your
 * own placeholder.
 *
 * Standalone utility, not one of the 24 Figma-sourced components - there is
 * no Figma node for it. It exists to close a real integration gap without
 * reaching for stock imagery this package has no rights to bundle. Clip
 * [modifier] yourself (e.g. `Modifier.clip(...)`) to match whatever slot it
 * fills, the same way you would for a real image composable.
 */
@Composable
fun SnackyImagePlaceholder(
    width: Dp,
    height: Dp,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .size(width, height)
            .background(SnackyColor.bgSurfaceVariant),
        contentAlignment = Alignment.Center,
    ) {
        val iconSize = if (width < height) width * 0.32f else height * 0.32f
        Canvas(modifier = Modifier.size(iconSize)) {
            // Frame/sun/mountain points from a 24x24 viewBox, scaled proportionally
            // to this canvas - same technique as SnackyCheckbox's checkmark.
            val stroke = Stroke(
                width = size.minDimension * (2f / 24f),
                cap = StrokeCap.Round,
                join = StrokeJoin.Round,
            )
            drawRoundRect(
                color = SnackyColor.iconDisabled,
                topLeft = Offset(size.width * (3f / 24f), size.height * (3f / 24f)),
                size = Size(size.width * (18f / 24f), size.height * (18f / 24f)),
                cornerRadius = CornerRadius(size.width * (2f / 24f), size.height * (2f / 24f)),
                style = stroke,
            )
            drawCircle(
                color = SnackyColor.iconDisabled,
                radius = size.minDimension * (1.5f / 24f),
                center = Offset(size.width * (8.5f / 24f), size.height * (8.5f / 24f)),
            )
            val mountain = Path().apply {
                moveTo(size.width * (21f / 24f), size.height * (15f / 24f))
                lineTo(size.width * (16f / 24f), size.height * (10f / 24f))
                lineTo(size.width * (5f / 24f), size.height * (21f / 24f))
            }
            drawPath(path = mountain, color = SnackyColor.iconDisabled, style = stroke)
        }
    }
}
