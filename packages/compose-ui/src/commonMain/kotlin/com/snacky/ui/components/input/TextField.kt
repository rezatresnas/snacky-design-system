package com.snacky.ui.components.input

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Text Field - the shared 48dp-tall field behind the Text, Password,
 * Dropdown, Date Picker and Address variants. The variant is expressed
 * through the slots and flags rather than an enum, exactly like
 * packages/react-ui's TextField.tsx: Password passes
 * [visualTransformation], Dropdown/Date Picker pass a [trailingIcon] plus
 * `readOnly = true`, Address passes a [leadingIcon].
 *
 * Ported from react-ui's verified TextField.tsx/TextField.css rather than
 * re-derived from Figma, matching the workflow the rest of this package now
 * follows for already-pixel-verified components.
 *
 * Two deliberate differences from the web version:
 * - react-ui gets its focus ring from CSS `:focus-within`, which has no
 *   Compose equivalent, so focus is tracked through the field's own
 *   [MutableInteractionSource] instead.
 * - `error` there is `boolean | string` (a bare flag or a message). Kotlin
 *   has no union type, so it splits into [isError] and [errorMessage],
 *   with a non-null message implying the error state.
 */
@Composable
fun SnackyTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    trailingIconRotated: Boolean = false,
    isError: Boolean = false,
    errorMessage: String? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val focused by interactionSource.collectIsFocusedAsState()
    val showError = isError || errorMessage != null

    val borderColor = when {
        showError -> SnackyColor.borderInputError
        focused -> SnackyColor.borderInputActive
        else -> SnackyColor.borderInputDefault
    }

    Column(modifier = modifier.fillMaxWidth()) {
        if (label != null) {
            BasicText(
                text = label,
                style = SnackyColor.textPrimary.asStyle(SnackyTypography.Small.regular),
                modifier = Modifier.padding(bottom = SnackySpacingPrimitive.space4),
            )
        }
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth().height(48.dp),
            enabled = enabled,
            readOnly = readOnly,
            singleLine = singleLine,
            visualTransformation = visualTransformation,
            keyboardOptions = keyboardOptions,
            interactionSource = interactionSource,
            textStyle = (if (enabled) SnackyColor.textPrimary else SnackyColor.textDisabled)
                .asStyle(SnackyTypography.Small.regular),
            decorationBox = { innerTextField ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(SnackyRadius.field))
                        .background(if (enabled) SnackyColor.bgSurfaceField else SnackyColor.bgSurfaceVariant)
                        .border(1.dp, borderColor, RoundedCornerShape(SnackyRadius.field))
                        .padding(horizontal = SnackySpacingPrimitive.space8, vertical = SnackySpacingPrimitive.space12),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(SnackyGap.textIcon),
                ) {
                    if (leadingIcon != null) FieldIcon(leadingIcon)
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                        if (value.isEmpty() && placeholder != null) {
                            BasicText(
                                text = placeholder,
                                style = SnackyColor.textPlaceholder.asStyle(SnackyTypography.Small.regular),
                            )
                        }
                        innerTextField()
                    }
                    if (trailingIcon != null) {
                        FieldIcon(trailingIcon, rotated = trailingIconRotated)
                    }
                }
            },
        )
        if (errorMessage != null) {
            BasicText(
                text = errorMessage,
                style = SnackyColor.textError.asStyle(SnackyTypography.Caption.regular),
                modifier = Modifier.padding(top = SnackySpacingPrimitive.space4),
            )
        }
    }
}

/** Password field - [SnackyTextField] with the digits masked and a caller-supplied eye toggle. */
@Composable
fun SnackyPasswordField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    visible: Boolean = false,
    trailingIcon: (@Composable () -> Unit)? = null,
    isError: Boolean = false,
    errorMessage: String? = null,
    enabled: Boolean = true,
) {
    SnackyTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        label = label,
        placeholder = placeholder,
        trailingIcon = trailingIcon,
        isError = isError,
        errorMessage = errorMessage,
        enabled = enabled,
        visualTransformation = if (visible) VisualTransformation.None else PasswordVisualTransformation(),
    )
}

@Composable
internal fun FieldIcon(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    size: androidx.compose.ui.unit.Dp = 20.dp,
    rotated: Boolean = false,
) {
    Box(
        modifier = modifier.size(size).then(if (rotated) Modifier.rotate(180f) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        // Figma binds the field glyphs to text/text-placeholder, not icon-secondary.
        CompositionLocalProvider(LocalContentColor provides SnackyColor.textPlaceholder) {
            content()
        }
    }
}

/**
 * Small helper so a colour and a [com.snacky.ui.theme.SnackyTypographyToken]
 * can be combined inline. This package ships no Poppins font resource (see
 * theme/Tokens.kt), so no `fontFamily` is set here either - supply one
 * globally if you need the real typeface.
 */
internal fun androidx.compose.ui.graphics.Color.asStyle(
    token: com.snacky.ui.theme.SnackyTypographyToken,
): TextStyle = TextStyle(
    color = this,
    fontSize = token.fontSize,
    fontWeight = token.fontWeight,
    lineHeight = token.lineHeight,
    letterSpacing = token.letterSpacing,
)
