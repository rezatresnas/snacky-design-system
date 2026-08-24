package com.snacky.ui.components.input

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Chat Input - message compose bar with an inline 48dp circular send
 * button. Mirrors packages/react-ui's ChatInput.tsx/ChatInput.css, including
 * its documented empty state: the send button stays fully transparent with a
 * muted icon until there is something to send, rather than rendering as a
 * greyed-out disabled circle.
 */
@Composable
fun SnackyChatInput(
    value: String,
    onValueChange: (String) -> Unit,
    onSend: () -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Write your message here",
    sendIcon: (@Composable () -> Unit)? = null,
    enabled: Boolean = true,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val focused by interactionSource.collectIsFocusedAsState()
    val canSend = value.isNotEmpty()

    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth().height(72.dp),
        enabled = enabled,
        singleLine = true,
        interactionSource = interactionSource,
        textStyle = SnackyColor.textPrimary.asStyle(SnackyTypography.Small.regular),
        decorationBox = { innerTextField ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(72.dp)
                    .clip(RoundedCornerShape(SnackyRadius.field))
                    .background(SnackyColor.bgSurface)
                    .border(
                        1.dp,
                        if (focused) SnackyColor.borderInputActive else SnackyColor.borderInputDefault,
                        RoundedCornerShape(SnackyRadius.field),
                    )
                    .padding(SnackySpacingPrimitive.space12),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(SnackyGap.textIcon),
            ) {
                Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                    if (value.isEmpty()) {
                        BasicText(
                            text = placeholder,
                            style = SnackyColor.textPlaceholder.asStyle(SnackyTypography.Small.regular),
                        )
                    }
                    innerTextField()
                }
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(if (canSend) SnackyColor.bgActionPrimary else Color.Transparent)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            enabled = canSend,
                            onClick = onSend,
                        )
                        .semantics { contentDescription = "Send" },
                    contentAlignment = Alignment.Center,
                ) {
                    CompositionLocalProvider(
                        // White on the accent circle, NOT the dark colour a
                        // labelled button uses; resting glyph is textPlaceholder.
                        LocalContentColor provides
                            if (canSend) SnackyColor.iconOnAccent else SnackyColor.textPlaceholder,
                    ) {
                        Box(modifier = Modifier.size(20.dp), contentAlignment = Alignment.Center) {
                            // Falls back to the real send glyph rather than an empty
                            // slot, matching react-ui.
                            if (sendIcon != null) sendIcon() else SnackyIcon(SnackyIcons.Outline.Send, size = 20.dp)
                        }
                    }
                }
            }
        },
    )
}
