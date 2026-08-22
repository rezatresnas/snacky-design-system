package com.snacky.ui.components.callout

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyColorPrimitive
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackyTypography

enum class CalloutVariant { Received, Sent, Pending }

/**
 * Snacky Callout - chat message bubble. Received aligns left/white, Sent/
 * Pending align right/accent. Mirrors packages/react-ui's Callout.tsx/
 * Callout.css.
 *
 * Confirmed against Figma (node 8690:7426, page "Callout"): text color is
 * textPrimary (#333333) on every variant, including Sent/Pending's yellow
 * fill - not inverted to white, matching react-ui already. Found and fixed
 * one real bug in react-ui's Callout.css and index.html's Live Preview
 * while porting: both had an invented box-shadow on Received that doesn't
 * exist in Figma (its effects array is empty, flat like Sent/Pending).
 */
@Composable
fun SnackyCallout(
    message: String,
    timestamp: String,
    variant: CalloutVariant,
    modifier: Modifier = Modifier,
    statusIcon: (@Composable () -> Unit)? = null,
) {
    val isReceived = variant == CalloutVariant.Received
    val messageStyle = SnackyTypography.Body.regular
    val metaStyle = SnackyTypography.Caption.regular

    Column(
        modifier = modifier
            .widthIn(max = 200.dp)
            .clip(RoundedCornerShape(SnackyRadius.bubble))
            .background(if (isReceived) SnackyColor.bgSurface else SnackyColorPrimitive.Primary.c500)
            .padding(horizontal = 8.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        BasicText(
            text = message,
            style = TextStyle(
                color = SnackyColor.textPrimary,
                fontSize = messageStyle.fontSize,
                fontWeight = messageStyle.fontWeight,
                lineHeight = messageStyle.lineHeight,
                letterSpacing = messageStyle.letterSpacing,
            ),
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BasicText(
                text = timestamp,
                style = TextStyle(
                    color = SnackyColor.textPrimary,
                    fontSize = metaStyle.fontSize,
                    fontWeight = metaStyle.fontWeight,
                    lineHeight = metaStyle.lineHeight,
                    letterSpacing = metaStyle.letterSpacing,
                ),
            )
            if (statusIcon != null && !isReceived) {
                Spacer(Modifier.width(4.dp))
                Box(modifier = Modifier.size(16.dp)) {
                    statusIcon()
                }
            }
        }
    }
}
