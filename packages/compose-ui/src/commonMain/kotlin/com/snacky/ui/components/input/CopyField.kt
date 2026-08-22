package com.snacky.ui.components.input

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography
import kotlinx.coroutines.delay

/**
 * Snacky Copy Field - a read-only value on a `bgSurfaceVariant` row with a
 * "Copy" link that flips to "Copied" for two seconds. Mirrors
 * packages/react-ui's CopyField.tsx/CopyField.css.
 *
 * One deliberate difference: react-ui writes to `navigator.clipboard`
 * itself. Compose Multiplatform has no common clipboard API, so the actual
 * copy is delegated to [onCopy] (wire it to `LocalClipboardManager` on
 * Android, `UIPasteboard` on iOS). The "Copied" feedback is still owned
 * here, so the label behaves the same either way.
 */
@Composable
fun SnackyCopyField(
    value: String,
    modifier: Modifier = Modifier,
    onCopy: ((String) -> Unit)? = null,
    copyLabel: String = "Copy",
    copiedLabel: String = "Copied",
) {
    var copied by remember { mutableStateOf(false) }

    LaunchedEffect(copied) {
        if (copied) {
            delay(2000)
            copied = false
        }
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp)
            .clip(RoundedCornerShape(SnackyRadius.field))
            .background(SnackyColor.bgSurfaceVariant)
            .padding(SnackySpacingPrimitive.space12),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        BasicText(
            text = value,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f, fill = false),
            style = SnackyColor.textPrimary.asStyle(SnackyTypography.Body.semibold),
        )
        BasicText(
            text = if (copied) copiedLabel else copyLabel,
            modifier = Modifier
                .padding(start = SnackySpacingPrimitive.space12)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                ) {
                    onCopy?.invoke(value)
                    copied = true
                },
            style = (if (copied) SnackyColor.textSecondary else SnackyColor.textLink)
                .asStyle(SnackyTypography.Small.bold),
        )
    }
}
