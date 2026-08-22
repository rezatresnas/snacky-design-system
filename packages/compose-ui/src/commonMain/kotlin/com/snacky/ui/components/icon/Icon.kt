package com.snacky.ui.components.icon

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.vector.PathParser
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import com.snacky.ui.theme.SnackySize

/** The 24x24 coordinate space every icon in this set is authored in. */
internal const val ICON_VIEWBOX = 24f

/**
 * One drawable primitive inside an icon. Mirrors the three SVG elements
 * `packages/react-ui`'s icon set actually uses, so each icon's geometry can
 * be carried over verbatim rather than redrawn by hand.
 */
sealed interface IconShape {
    /** Raw SVG path data, parsed with Compose's own [PathParser]. */
    data class SvgPath(val data: String) : IconShape

    data class Circle(val cx: Float, val cy: Float, val r: Float) : IconShape

    data class Rect(
        val x: Float,
        val y: Float,
        val width: Float,
        val height: Float,
        val cornerRadius: Float = 0f,
    ) : IconShape
}

/**
 * A single icon: its geometry plus whether it renders filled (Solid style)
 * or stroked (Outline style, 1.5 units in the 24x24 box).
 */
data class SnackyIconSpec(
    val shapes: List<IconShape>,
    val filled: Boolean = false,
)

/**
 * Snacky Icon - renders a [SnackyIconSpec] at [size], tinted with [tint].
 *
 * Mirrors `packages/react-ui`'s `src/icons/` set, and carries over its
 * documented gap unchanged: this is a STARTER SUBSET, not the full
 * documented 41-icon Outline / 10-icon Solid set, and it was drawn
 * generically rather than exported from the real Figma icon components. The
 * remaining icons should be exported from Figma (via the same
 * `download_assets` tooling used to build the rest of this design system)
 * rather than redrawn from memory here. What exists covers the icons needed
 * to build a form (eye/eyeOff, chevrons, calendar, search, close, location,
 * send, check, plus/minus) plus the Navbar set.
 *
 * Geometry is stored as the same SVG primitives react-ui uses and parsed at
 * runtime with Compose's own [PathParser], so the path data is byte-for-byte
 * identical to the web version instead of being hand-translated into
 * `Path` calls - the one place in this package where a large amount of
 * vector data crosses platforms, and hand-transcription would be the obvious
 * way to introduce silent drift.
 *
 * [tint] defaults to the ambient [LocalContentColor], so an icon dropped
 * into a slot on `SnackyIconButton`, `SnackyTextField`, `SnackyChatInput`
 * etc. picks up that component's own resolved icon color automatically.
 */
@Composable
fun SnackyIcon(
    icon: SnackyIconSpec,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    size: Dp = SnackySize.Icon.lg,
    tint: Color = LocalContentColor.current,
) {
    val paths = remember(icon) {
        icon.shapes.mapNotNull { shape ->
            (shape as? IconShape.SvgPath)?.let { PathParser().parsePathString(it.data).toPath() }
        }
    }
    Canvas(
        modifier = modifier
            .size(size)
            .then(
                if (contentDescription != null) {
                    Modifier.semantics { this.contentDescription = contentDescription }
                } else {
                    Modifier
                },
            ),
    ) {
        val factor = this.size.minDimension / ICON_VIEWBOX
        // Outline icons are authored with a 1.5-unit stroke in the 24x24 box;
        // scaling the whole draw scope keeps that proportional at any size.
        val style = if (icon.filled) {
            Fill
        } else {
            Stroke(width = 1.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
        }
        scale(scale = factor, pivot = androidx.compose.ui.geometry.Offset.Zero) {
            var pathIndex = 0
            icon.shapes.forEach { shape ->
                when (shape) {
                    is IconShape.SvgPath -> {
                        drawPath(path = paths[pathIndex++], color = tint, style = style)
                    }
                    is IconShape.Circle -> drawCircle(
                        color = tint,
                        radius = shape.r,
                        center = androidx.compose.ui.geometry.Offset(shape.cx, shape.cy),
                        style = style,
                    )
                    is IconShape.Rect -> drawRoundRect(
                        color = tint,
                        topLeft = androidx.compose.ui.geometry.Offset(shape.x, shape.y),
                        size = androidx.compose.ui.geometry.Size(shape.width, shape.height),
                        cornerRadius = androidx.compose.ui.geometry.CornerRadius(
                            shape.cornerRadius,
                            shape.cornerRadius,
                        ),
                        style = style,
                    )
                }
            }
        }
    }
}

/** Convenience: build a single-path icon without spelling out the list. */
internal fun path(data: String, filled: Boolean = false) =
    SnackyIconSpec(listOf(IconShape.SvgPath(data)), filled)

internal fun shapes(vararg shapes: IconShape, filled: Boolean = false) =
    SnackyIconSpec(shapes.toList(), filled)
