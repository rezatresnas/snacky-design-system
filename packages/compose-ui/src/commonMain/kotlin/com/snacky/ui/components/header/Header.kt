package com.snacky.ui.components.header

import androidx.compose.foundation.Canvas
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
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
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
        Box(modifier = Modifier.size(24.dp)) {
            content()
        }
    }
}

@Composable
private fun BackGlyph() {
    Canvas(modifier = Modifier.size(24.dp)) {
        val path = Path().apply {
            moveTo(size.width * (15f / 24f), size.height * (6f / 24f))
            lineTo(size.width * (9f / 24f), size.height * (12f / 24f))
            lineTo(size.width * (15f / 24f), size.height * (18f / 24f))
        }
        drawPath(
            path = path,
            color = SnackyColor.iconPrimary,
            style = Stroke(
                width = size.minDimension * (1.5f / 24f),
                cap = StrokeCap.Round,
                join = StrokeJoin.Round,
            ),
        )
    }
}

@Composable
private fun CloseGlyph() {
    Canvas(modifier = Modifier.size(24.dp)) {
        val stroke = Stroke(
            width = size.minDimension * (1.5f / 24f),
            cap = StrokeCap.Round,
            join = StrokeJoin.Round,
        )
        val diagonal1 = Path().apply {
            moveTo(size.width * (6f / 24f), size.height * (6f / 24f))
            lineTo(size.width * (18f / 24f), size.height * (18f / 24f))
        }
        val diagonal2 = Path().apply {
            moveTo(size.width * (18f / 24f), size.height * (6f / 24f))
            lineTo(size.width * (6f / 24f), size.height * (18f / 24f))
        }
        drawPath(path = diagonal1, color = SnackyColor.iconPrimary, style = stroke)
        drawPath(path = diagonal2, color = SnackyColor.iconPrimary, style = stroke)
    }
}
