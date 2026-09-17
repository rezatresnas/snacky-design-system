package com.snacky.ui.components.navbar

import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.BasicText
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.LocalSnackyFontFamily
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackySize
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

data class NavItem(
    val label: String,
    val icon: @Composable () -> Unit,
    val activeIcon: (@Composable () -> Unit)? = null,
)

/**
 * Snacky Nav Bar - bottom navigation, 5 tabs for the customer flow. Mirrors
 * packages/react-ui's Navbar.tsx/Navbar.css.
 *
 * Confirmed against Figma's own variant (`Property 1=Customer`, node
 * 55:2100, the single variant inside component set 441:13155): 360x88, an
 * auto-layout row of five 72x72 items over a 16dp bottom padding. Already
 * matching before that check: icon and label use different inactive colors
 * (icon-secondary #525252, text-secondary #7a7a7a), and the outer shadow
 * matches `shadowTop` exactly (offsetY -4, blur 10, alpha 0.08). An earlier
 * pass read the component SET node (441:13155) rather than the variant
 * inside it, which is why the bar's own 16dp bottom padding was missed: a
 * set's padding is Figma's gutter between variants, never a spec value.
 *
 * One deliberate deviation, carried over from react-ui: items use
 * `Modifier.weight(1f)` to fill the container width, where Figma's own
 * frame hardcodes 72x72 per item (that frame is only ever shown at a fixed
 * 360dp width). A production nav bar needs to fill whatever width the real
 * device is, so the flexible layout is kept on purpose.
 *
 * The upward-cast shadow (`shadowTop`'s offsetY is negative) is
 * approximated with a plain `Modifier.shadow`, Compose's elevation model
 * has no directional offset control to replicate CSS's upward box-shadow
 * literally.
 */
@Composable
fun SnackyNavBar(
    items: List<NavItem>,
    selected: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        // The 16dp bottom padding sits INSIDE the background, not outside it:
        // Figma's bar is 88 tall (5 items at 72, plus this 16), all of it the
        // same surface, so the strip below the items is painted, not
        // transparent. Both packages shipped without it and rendered a 72dp bar.
        modifier = modifier
            .fillMaxWidth()
            .shadow(elevation = 4.dp)
            .background(SnackyColor.bgSurface)
            .padding(bottom = SnackySpacingPrimitive.space16),
    ) {
        items.forEachIndexed { index, item ->
            val active = index == selected
            val iconColor = if (active) SnackyColor.iconBrand else SnackyColor.iconSecondary
            val labelStyle = if (active) SnackyTypography.Small.bold else SnackyTypography.Small.regular
            val labelColor = if (active) SnackyColor.textPrimary else SnackyColor.textSecondary

            Column(
                modifier = Modifier
                    .weight(1f)
                    .selectable(
                        selected = active,
                        onClick = { onSelect(index) },
                        role = Role.Tab,
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                    )
                    .padding(vertical = SnackySpacingPrimitive.space12),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
            ) {
                // The slot keeps a 20dp footprint so every item stays the same
                // height, but its CONTENT is measured unbounded. Without that,
                // `size()`'s fixed constraints cap the slot at 20dp wide and clip
                // anything that overflows the icon, which is how a [SnackyBadge]
                // around a nav icon (a real pattern: the notification tab) rendered
                // "99+" as a bare "9". react-ui has the same 20px box and does not
                // need this, because a CSS width does not clip an overflowing child
                // the way Compose's measurement constraints do.
                Box(
                    modifier = Modifier
                        .size(SnackySize.Icon.md)
                        .wrapContentSize(unbounded = true),
                ) {
                    val icon = if (active && item.activeIcon != null) item.activeIcon else item.icon
                    CompositionLocalProvider(LocalContentColor provides iconColor) {
                        icon()
                    }
                }
                BasicText(
                    text = item.label,
                    style = TextStyle(
                        color = labelColor,
                        fontFamily = LocalSnackyFontFamily.current,
                        fontSize = labelStyle.fontSize,
                        fontWeight = labelStyle.fontWeight,
                        lineHeight = labelStyle.lineHeight,
                        letterSpacing = labelStyle.letterSpacing,
                    ),
                )
            }
        }
    }
}
