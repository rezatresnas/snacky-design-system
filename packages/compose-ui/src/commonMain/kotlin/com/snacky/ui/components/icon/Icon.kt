package com.snacky.ui.components.icon

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathFillType
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.vector.PathParser
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp

/**
 * One filled sub-path of an icon. [evenOdd] mirrors SVG's
 * `fill-rule="evenodd"`, which a couple of icons (Logout, Help) rely on to
 * knock holes out of their shape.
 */
data class SnackyIconPath(
    val data: String,
    val evenOdd: Boolean = false,
)

/**
 * A single icon: its sub-paths plus the square viewBox Figma authored it at.
 *
 * The set is deliberately not uniform - icons come in 16, 20 and 24 unit
 * boxes - so the viewBox travels with the icon rather than being assumed.
 */
data class SnackyIconSpec(
    val viewBox: Float,
    val paths: List<SnackyIconPath>,
)

/**
 * Snacky Icon - renders a [SnackyIconSpec] at [size], tinted with [tint].
 *
 * These are the real icons exported from Figma's `Icon-outline` /
 * `Icon-solid` component sets, generated into [SnackyIcons] from
 * `assets/icons/icons.json` by `scripts/generate-icons.js` - the same source
 * that generates `packages/react-ui`'s `outline.tsx`/`solid.tsx`, so the two
 * platforms render identical geometry.
 *
 * Both styles are FILLED: Outline icons are filled outline shapes with the
 * weight baked into the path, not stroked paths, so there is no stroke width
 * to configure and no visual difference in how the two styles are drawn -
 * only in the shapes themselves.
 *
 * [size] defaults to the icon's own authored viewBox size. Pass an explicit
 * [size] to scale it; the whole draw scope is scaled, so geometry stays
 * proportional at any size.
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
    size: Dp = Dp(icon.viewBox),
    tint: Color = LocalContentColor.current,
) {
    val paths = remember(icon) {
        icon.paths.map { spec ->
            PathParser().parsePathString(spec.data).toPath().apply {
                fillType = if (spec.evenOdd) PathFillType.EvenOdd else PathFillType.NonZero
            }
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
        val factor = this.size.minDimension / icon.viewBox
        scale(scale = factor, pivot = Offset.Zero) {
            paths.forEach { drawPath(path = it, color = tint, style = Fill) }
        }
    }
}
