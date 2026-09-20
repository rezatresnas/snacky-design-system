package com.snacky.ui.components.input

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.runtime.Composable
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
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/**
 * Snacky Search Field - compact 40dp field on a `bgSurfaceVariant` pill with
 * a leading search icon and a clear affordance once filled. Mirrors
 * packages/react-ui's SearchField.tsx/SearchField.css, including its
 * documented 260dp -> 312dp width animation on focus (a fixed width that
 * grows, not a fluid 100% field) and its resting transparent border, so the
 * accent focus ring does not shift the layout.
 *
 * [searchIcon] and [clearIcon] fall back to the real icon set rather than
 * rendering nothing, and the clear button appears whenever the field has
 * text, exactly as Figma's filled variant draws it. Both are part of this component's spec, not caller
 * decoration, so a caller that omits them used to get a field with no
 * magnifier at all and no way to clear it. Both icons are authored at 16px in
 * `icons.json`, which is the size the slots render at.
 */
@Composable
fun SnackySearchField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search products...",
    searchIcon: (@Composable () -> Unit)? = null,
    clearIcon: (@Composable () -> Unit)? = null,
    onClear: (() -> Unit)? = null,
    enabled: Boolean = true,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val focused by interactionSource.collectIsFocusedAsState()
    val width by animateDpAsState(if (focused) 312.dp else 260.dp)

    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.width(width).height(40.dp),
        enabled = enabled,
        singleLine = true,
        interactionSource = interactionSource,
        textStyle = SnackyColor.textPrimary.asStyle(SnackyTypography.Small.regular),
        decorationBox = { innerTextField ->
            Row(
                modifier = Modifier
                    .width(width)
                    .height(40.dp)
                    .clip(RoundedCornerShape(SnackyRadius.field))
                    .background(SnackyColor.bgSurfaceVariant)
                    .border(
                        1.dp,
                        if (focused) SnackyColor.borderInputActive else Color.Transparent,
                        RoundedCornerShape(SnackyRadius.field),
                    )
                    .padding(horizontal = SnackySpacingPrimitive.space12, vertical = SnackySpacingPrimitive.space8),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space12),
            ) {
                FieldIcon(
                    content = searchIcon ?: { SnackyIcon(SnackyIcons.Outline.Search, size = 16.dp) },
                    size = 16.dp,
                )
                Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                    if (value.isEmpty()) {
                        BasicText(
                            text = placeholder,
                            style = SnackyColor.textPlaceholder.asStyle(SnackyTypography.Small.regular),
                        )
                    }
                    innerTextField()
                }
                // Figma's filled/active variant always carries the clear button,
                // so it is driven by the text alone. It used to also require a
                // non-null [onClear], which meant a caller who wired up nothing
                // but value/onValueChange got a filled field with no way to
                // empty it, matching no documented state. [onClear] is now only
                // for callers who need to hear about it.
                if (value.isNotEmpty()) {
                    Box(
                        modifier = Modifier
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                                onClick = onClear ?: { onValueChange("") },
                            )
                            .semantics { contentDescription = "Clear search" },
                    ) {
                        FieldIcon(
                            content = clearIcon ?: { SnackyIcon(SnackyIcons.Outline.CloseInput, size = 16.dp) },
                            size = 16.dp,
                        )
                    }
                }
            }
        },
    )
}
