package com.snacky.ui.components.input

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky OTP Field - [length] individual 48x48dp cells with auto-advance on
 * entry and backspace-to-previous when empty. Mirrors packages/react-ui's
 * OtpField.tsx/OtpField.css, including its deliberately hand-tuned 46sp line
 * height (not the h3Bold token's 36sp), which is what actually centres a
 * single digit inside the 48dp cell.
 *
 * Cells rest on a transparent border so the accent focus ring does not shift
 * the layout, same as the web version.
 */
@Composable
fun SnackyOtpField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    length: Int = 6,
    enabled: Boolean = true,
) {
    val focusRequesters = remember(length) { List(length) { FocusRequester() } }
    val digits = List(length) { i -> value.getOrNull(i)?.toString() ?: "" }

    fun setDigit(index: Int, digit: String) {
        val next = digits.toMutableList()
        next[index] = digit
        onValueChange(next.joinToString(""))
        if (digit.isNotEmpty() && index < length - 1) focusRequesters[index + 1].requestFocus()
    }

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space4),
    ) {
        digits.forEachIndexed { index, digit ->
            val interactionSource = remember { MutableInteractionSource() }
            val focused by interactionSource.collectIsFocusedAsState()
            BasicTextField(
                value = digit,
                onValueChange = { raw ->
                    setDigit(index, raw.filter { it.isDigit() }.takeLast(1))
                },
                modifier = Modifier
                    .size(48.dp)
                    .focusRequester(focusRequesters[index])
                    .onPreviewKeyEvent { event ->
                        if (event.type == KeyEventType.KeyDown &&
                            event.key == Key.Backspace &&
                            digit.isEmpty() &&
                            index > 0
                        ) {
                            focusRequesters[index - 1].requestFocus()
                            true
                        } else {
                            false
                        }
                    }
                    .semantics { contentDescription = "Digit ${index + 1}" },
                enabled = enabled,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                interactionSource = interactionSource,
                textStyle = TextStyle(
                    // Figma defines no disabled OTP variant (only default/active/
                    // filled), so this is not a spec value: it reuses the disabled
                    // text colour the other fields use, so `enabled = false` is at
                    // least visible rather than rendering identically to enabled.
                    color = if (enabled) SnackyColor.textPrimary else SnackyColor.textDisabled,
                    fontSize = SnackyTypography.H3.bold.fontSize,
                    fontWeight = SnackyTypography.H3.bold.fontWeight,
                    // 46sp, not the token's 36sp - see the KDoc above.
                    lineHeight = 46.sp,
                    letterSpacing = SnackyTypography.H3.bold.letterSpacing,
                    textAlign = TextAlign.Center,
                ),
                decorationBox = { innerTextField ->
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(SnackyRadius.field))
                            .background(SnackyColor.bgSurfaceVariant)
                            .border(
                                1.dp,
                                if (focused) SnackyColor.borderInputActive else Color.Transparent,
                                RoundedCornerShape(SnackyRadius.field),
                            ),
                        contentAlignment = Alignment.Center,
                    ) {
                        innerTextField()
                    }
                },
            )
        }
    }
}
