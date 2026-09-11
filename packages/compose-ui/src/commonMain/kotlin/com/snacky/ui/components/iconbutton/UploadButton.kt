package com.snacky.ui.components.iconbutton

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.theme.SnackyColor

/**
 * Snacky Upload Button: a circular dashed image drop zone. Mirrors react-ui's
 * UploadButton.tsx/UploadButton.css, both matching Figma's Icon-Button set
 * 8685:6254, Property 1=upload: a 72dp circle filled bgActionSecondary around
 * a 24dp icon, with a 1dp borderActionSecondary stroke dashed [2dp, 2dp] and
 * drawn OUTSIDE the circle, so it never eats into the icon's 24dp.
 *
 * [icon] defaults to the camera glyph Figma draws there (its `picture` icon).
 * Mobile has no hover, so the press maps to CSS `:active`'s pressed fill, the
 * same convention [SnackyIconButton] uses.
 */
@Composable
fun SnackyUploadButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String = "Upload image",
    icon: @Composable () -> Unit = { SnackyIcon(SnackyIcons.Outline.Camera, size = 24.dp) },
) {
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()
    val strokeColor = SnackyColor.borderActionSecondary
    Box(
        modifier = modifier
            .size(72.dp)
            .drawBehind {
                val width = 1.dp.toPx()
                drawCircle(
                    color = strokeColor,
                    radius = size.minDimension / 2 + width / 2,
                    style = Stroke(
                        width = width,
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(2.dp.toPx(), 2.dp.toPx())),
                    ),
                )
            }
            .clip(CircleShape)
            .background(if (pressed) SnackyColor.bgActionSecondaryPressed else SnackyColor.bgActionSecondary)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick,
            )
            .semantics { this.contentDescription = contentDescription },
        contentAlignment = Alignment.Center,
    ) {
        Box(modifier = Modifier.size(24.dp), contentAlignment = Alignment.Center) {
            CompositionLocalProvider(LocalContentColor provides SnackyColor.iconPrimary) {
                icon()
            }
        }
    }
}
