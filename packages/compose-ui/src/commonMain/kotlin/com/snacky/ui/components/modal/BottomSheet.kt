package com.snacky.ui.components.modal

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyLayout
import com.snacky.ui.theme.SnackyRadius

/**
 * Snacky Bottom Sheet - the shared modal shell every documented Modal
 * "variant" (Welcome, Success, Confirmation, Calendar, Variants Selector,
 * Payment Methods, Buyer Reviews, Driver Tracking) composes from. 20dp
 * radius on top corners only, dim overlay backdrop, dismiss on backdrop
 * click. Mirrors packages/react-ui's BottomSheet.tsx/BottomSheet.css.
 *
 * Found and fixed a real bug in react-ui's BottomSheet.tsx while porting:
 * react-ui defaulted to showing a drag-handle bar (`hideHandle = false`),
 * which is wrong for 8 of Figma's 9 Modal variants. Renamed to [showHandle],
 * defaulting to `false`, so a variant opts in rather than every other one
 * opting out. That pass also concluded no variant shows a handle at all;
 * reading the bound variables later disproved it, since `Property 1=driver`
 * draws a visible 40x4 `Driver Slider` (node 8693:6233). A Driver Tracking
 * composition should therefore pass `showHandle = true`.
 *
 * Also confirmed, but not something to "fix": the padding-bottom/gap-between-
 * blocks values genuinely differ per real variant (Welcome's gap is 32dp,
 * Calendar's is 24dp, others 16dp; several variants get their trailing 24dp
 * spacing from their own button-row's padding rather than the shell), so no
 * single shell default reproduces all of them - `content`'s own spacing is
 * expected to override this shell's default `gapLayoutBlock` when a specific
 * composition needs something else, matching how react-ui already treats it.
 */
@Composable
fun SnackyBottomSheet(
    open: Boolean,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    showHandle: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    if (!open) return

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        BoxWithConstraints(
            modifier = Modifier
                .fillMaxSize()
                .background(SnackyColor.bgOverlayDim)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onDismiss,
                ),
            contentAlignment = Alignment.BottomCenter,
        ) {
            val maxSheetHeight = maxHeight * 0.9f
            Column(
                modifier = modifier
                    .fillMaxWidth()
                    .widthIn(max = 480.dp)
                    .heightIn(max = maxSheetHeight)
                    .clip(RoundedCornerShape(topStart = SnackyRadius.sheetTop, topEnd = SnackyRadius.sheetTop))
                    .background(SnackyColor.bgSurface)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {}, // absorb clicks so they don't reach the backdrop's dismiss handler
                    )
                    .verticalScroll(rememberScrollState())
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(SnackyLayout.block),
            ) {
                if (showHandle) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.CenterHorizontally)
                            // Figma draws this as an explicit 40x4 rectangle
                            // (`Driver Slider`, Modal > Property 1=driver)
                            // bound to border/border-main, radius 100. No
                            // bottom padding: the next child sits at y28
                            // there, so the only space below is the gap.
                            .size(width = 40.dp, height = 4.dp)
                            .clip(RoundedCornerShape(SnackyRadius.full))
                            .background(SnackyColor.borderMain),
                    )
                }
                content()
            }
        }
    }
}
