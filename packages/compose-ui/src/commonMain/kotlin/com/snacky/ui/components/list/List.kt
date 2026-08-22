package com.snacky.ui.components.list

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.snacky.ui.components.button.SnackyButton
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyRadius
import com.snacky.ui.theme.SnackyTypography

enum class OrderStatus { Waiting, Process, ProcessCod, Shipped, Received, Cancelled }

private val STATUS_LABEL = mapOf(
    OrderStatus.Waiting to "Waiting for Payment",
    OrderStatus.Process to "Order Processing",
    OrderStatus.ProcessCod to "Order Processing",
    OrderStatus.Shipped to "Order Shipped",
    OrderStatus.Received to "Order Received",
    OrderStatus.Cancelled to "Order Cancelled",
)

private val STATUS_ACTION = mapOf(
    OrderStatus.Shipped to "Track Shipment",
    OrderStatus.Received to "Buy Again",
    OrderStatus.Cancelled to "Buy Again",
)

/**
 * Snacky Order List Item - order summary card. Layout, CTA, and the COD chip
 * / payment-deadline banner are all driven by [status], matching the real
 * per-status variants (Waiting/Process/Process COD/Shipped/Received/
 * Cancelled). Mirrors packages/react-ui's List.tsx/List.css (`OrderListItem`).
 *
 * Spot-checked against Figma (node 8695:6485, page "List") during this
 * port: card shadow/radius, the notification border/unread-highlight
 * colors all matched exactly, no bugs this time - react-ui's own README
 * already documents this component as cross-checked directly against its
 * Figma component set in an earlier session, and this re-check confirms
 * that held up.
 */
@Composable
fun SnackyOrderListItem(
    productImage: @Composable () -> Unit,
    productName: String,
    status: OrderStatus,
    itemsSummary: String,
    total: String,
    modifier: Modifier = Modifier,
    paymentDeadline: String? = null,
    actionLabel: String? = null,
    onAction: () -> Unit = {},
    onClick: (() -> Unit)? = null,
) {
    val action = actionLabel ?: STATUS_ACTION[status]
    val isCod = status == OrderStatus.ProcessCod
    val cardShape = RoundedCornerShape(SnackyRadius.field)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .shadow(elevation = 4.dp, shape = cardShape, clip = false)
            .clip(cardShape)
            .background(SnackyColor.bgSurface)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onClick,
                    )
                } else {
                    Modifier
                },
            )
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(SnackyRadius.field))
                    // Literal value from the verified thumbnail frame - distinct
                    // from any generated surface token, matching List.css's own comment.
                    .background(Color(0xFFF4F4F5)),
                contentAlignment = Alignment.Center,
            ) {
                Box(modifier = Modifier.size(48.dp)) {
                    productImage()
                }
            }
            Column(modifier = Modifier.weight(1f)) {
                BasicText(
                    text = STATUS_LABEL.getValue(status),
                    style = TextStyle(
                        color = if (status == OrderStatus.Cancelled) SnackyColor.textError else SnackyColor.textPrimary,
                        fontSize = SnackyTypography.Small.semibold.fontSize,
                        fontWeight = SnackyTypography.Small.semibold.fontWeight,
                        lineHeight = SnackyTypography.Small.semibold.lineHeight,
                        letterSpacing = SnackyTypography.Small.semibold.letterSpacing,
                    ),
                )
                BasicText(
                    text = productName,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    style = smallRegularStyle(SnackyColor.textPrimary),
                )
            }
        }
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            BasicText(
                text = itemsSummary,
                modifier = Modifier.weight(1f),
                style = smallRegularStyle(SnackyColor.textSecondary),
            )
            BasicText(
                text = buildAnnotatedString {
                    append("Order Total: ")
                    withStyle(SpanStyle(fontWeight = SnackyTypography.Small.bold.fontWeight)) {
                        append(total)
                    }
                },
                style = smallRegularStyle(SnackyColor.textPrimary),
            )
            if (isCod) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(SnackyRadius.field))
                        .background(SnackyColor.bgSurface)
                        .border(1.dp, SnackyColor.borderMain, RoundedCornerShape(SnackyRadius.field))
                        .padding(horizontal = 8.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    BasicText(
                        text = "COD",
                        style = TextStyle(
                            color = SnackyColor.textSecondary,
                            fontSize = SnackyTypography.Small.bold.fontSize,
                            fontWeight = SnackyTypography.Small.bold.fontWeight,
                            lineHeight = SnackyTypography.Small.bold.lineHeight,
                            letterSpacing = SnackyTypography.Small.bold.letterSpacing,
                        ),
                    )
                }
            }
        }
        if (status == OrderStatus.Waiting && paymentDeadline != null) {
            BasicText(
                text = "Pay before $paymentDeadline",
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SnackyColor.bgSurfaceHighlight),
                style = smallRegularStyle(SnackyColor.textPrimary).copy(textAlign = TextAlign.Center),
            )
        }
        if (action != null) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                SnackyButton(text = action, onClick = onAction)
            }
        }
    }
}

/** Snacky Notification List Item - accent-tinted background for unread items. */
@Composable
fun SnackyNotificationListItem(
    title: String,
    message: String,
    modifier: Modifier = Modifier,
    unread: Boolean = false,
    onClick: (() -> Unit)? = null,
) {
    val shape = RoundedCornerShape(SnackyRadius.field)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(if (unread) SnackyColor.bgSurfaceHighlight else SnackyColor.bgSurface)
            .border(1.dp, SnackyColor.borderMain, shape)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onClick,
                    )
                } else {
                    Modifier
                },
            )
            .padding(horizontal = 12.dp, vertical = 8.dp),
    ) {
        BasicText(
            text = title,
            style = TextStyle(
                color = SnackyColor.textPrimary,
                fontSize = SnackyTypography.Small.semibold.fontSize,
                fontWeight = SnackyTypography.Small.semibold.fontWeight,
                lineHeight = SnackyTypography.Small.semibold.lineHeight,
                letterSpacing = SnackyTypography.Small.semibold.letterSpacing,
            ),
        )
        BasicText(
            text = message,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            style = smallRegularStyle(SnackyColor.textPrimary),
        )
    }
}

private fun smallRegularStyle(color: Color): TextStyle {
    val token = SnackyTypography.Small.regular
    return TextStyle(
        color = color,
        fontSize = token.fontSize,
        fontWeight = token.fontWeight,
        lineHeight = token.lineHeight,
        letterSpacing = token.letterSpacing,
    )
}
