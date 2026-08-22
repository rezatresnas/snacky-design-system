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
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyGap
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
 * Confirmed against Figma (node 441:13155, page "Navbar"): no bugs found,
 * including the already-documented detail that icon and label use
 * different inactive colors (icon-secondary #525252, text-secondary
 * #7a7a7a), and the outer shadow matches `shadowTop` exactly (offsetY -4,
 * blur 10, alpha 0.08) - re-verified directly rather than assumed.
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
        modifier = modifier
            .fillMaxWidth()
            .shadow(elevation = 4.dp)
            .background(SnackyColor.bgSurface),
    ) {
        items.forEachIndexed { index, item ->
            val active = index == selected
            val iconColor = if (active) SnackyColorPrimitive.Primary.c500 else SnackyColor.iconSecondary
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
                    .padding(vertical = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(SnackyGap.iconLabel),
            ) {
                Box(modifier = Modifier.size(20.dp)) {
                    val icon = if (active && item.activeIcon != null) item.activeIcon else item.icon
                    CompositionLocalProvider(LocalContentColor provides iconColor) {
                        icon()
                    }
                }
                BasicText(
                    text = item.label,
                    style = TextStyle(
                        color = labelColor,
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
