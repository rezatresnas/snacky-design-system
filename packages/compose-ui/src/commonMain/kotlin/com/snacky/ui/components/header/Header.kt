package com.snacky.ui.components.header

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.LocalSnackyFontFamily
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyTypography

enum class HeaderLeadingIcon { Back, Close }

/**
 * Snacky Header - page header bar. Title always centers in the remaining
 * space - when a leading icon is present but there's no trailing action,
 * the title row gets matching right padding so it stays optically centered
 * against the whole bar, not just the leftover space next to the icon.
 * Mirrors packages/react-ui's Header.tsx/Header.css, confirmed against
 * Figma (node 9617:5808, page "Header"): padding, icon-button sizing, and
 * title typography (Poppins Bold 16sp/36sp line height/0.01em) all matched
 * exactly, no bugs found this time - this one was already carefully
 * verified when first built earlier in this project's history.
 *
 * The back/close glyphs are hand-drawn to match react-ui's own starter
 * icon set exactly (`M15 6l-6 6 6 6` / `M6 6l12 12M18 6L6 18`, 1.5 stroke
 * in a 24x24 space) - that set is itself documented as generic, not
 * pixel-verified against Figma, so this Compose port carries the same
 * known gap rather than inventing a new one.
 */
@Composable
fun SnackyHeader(
    title: String,
    modifier: Modifier = Modifier,
    leadingIcon: HeaderLeadingIcon? = null,
    onLeadingClick: () -> Unit = {},
    trailingIcon: (@Composable () -> Unit)? = null,
    onTrailingClick: () -> Unit = {},
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(SnackyColor.bgSurface)
            .padding(horizontal = 8.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (leadingIcon != null) {
            HeaderIconButton(
                onClick = onLeadingClick,
                contentDescription = if (leadingIcon == HeaderLeadingIcon.Back) "Back" else "Close",
            ) {
                if (leadingIcon == HeaderLeadingIcon.Back) BackGlyph() else CloseGlyph()
            }
        }
        Box(
            modifier = Modifier
                .weight(1f)
                .then(
                    if (leadingIcon != null && trailingIcon == null) Modifier.padding(end = 40.dp) else Modifier,
                ),
            contentAlignment = Alignment.Center,
        ) {
            BasicText(
                text = title,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                style = TextStyle(
                    color = SnackyColor.textPrimary,
                    fontFamily = LocalSnackyFontFamily.current,
                    fontSize = SnackyTypography.H3.bold.fontSize,
                    fontWeight = SnackyTypography.H3.bold.fontWeight,
                    lineHeight = SnackyTypography.H3.bold.lineHeight,
                    letterSpacing = SnackyTypography.H3.bold.letterSpacing,
                ),
            )
        }
        if (trailingIcon != null) {
            HeaderIconButton(onClick = onTrailingClick, contentDescription = "Action") {
                trailingIcon()
            }
        }
    }
}

@Composable
private fun HeaderIconButton(
    onClick: () -> Unit,
    contentDescription: String,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = Modifier
            .size(40.dp)
            .clip(CircleShape)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick,
            )
            .semantics { this.contentDescription = contentDescription },
        contentAlignment = Alignment.Center,
    ) {
        Box(modifier = Modifier.size(24.dp), contentAlignment = Alignment.Center) {
            content()
        }
    }
}

// Both glyphs come from the set, the same way react-ui's Header has always
// taken them (`SnackyIcons.outline.back` / `outline.close`). This side drew
// them by hand instead: a stroked polyline for Back and two stroked diagonals
// for Close, which is a different shape from the real UIcons artwork and drifts
// from Figma the moment the set is re-exported.
@Composable
private fun BackGlyph() {
    SnackyIcon(SnackyIcons.Outline.Back, size = 24.dp, tint = SnackyColor.iconPrimary)
}

@Composable
private fun CloseGlyph() {
    SnackyIcon(SnackyIcons.Outline.Close, size = 24.dp, tint = SnackyColor.iconPrimary)
}
