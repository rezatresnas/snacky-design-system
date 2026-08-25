package com.snacky.ui.components.calendar

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.snacky.ui.components.button.SnackyButton
import com.snacky.ui.components.icon.SnackyIcon
import com.snacky.ui.components.icon.SnackyIcons
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackySpacingPrimitive
import com.snacky.ui.theme.SnackyTypography

/** One cell of the month grid. `inMonth = false` are the padding days either side. */
data class CalendarDay(
    val label: String,
    val inMonth: Boolean = true,
    val selected: Boolean = false,
    val inRange: Boolean = false,
    val marked: Boolean = false,
)

/**
 * Snacky Calendar - the month grid behind Modal's `Calendar` variant, and the
 * panel the Input family's Date Picker field is meant to open. Mirrors
 * packages/react-ui's Calendar.tsx/Calendar.css.
 *
 * Figma already had this as a COMPONENT (360x505) with a full structure, but no
 * package ever shipped it, so the Date Picker field existed as a component
 * while the calendar it opens did not, and every screen drew its own grid.
 *
 * Days are passed in rather than computed here: commonMain has no date library,
 * and the caller already knows its own calendar system and locale. `weeks` is a
 * list of 7-day rows.
 */
@Composable
fun SnackyCalendar(
    label: String,
    weeks: List<List<CalendarDay>>,
    modifier: Modifier = Modifier,
    weekdayLabels: List<String> = listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
    onPrevMonth: (() -> Unit)? = null,
    onNextMonth: (() -> Unit)? = null,
    onSelect: ((CalendarDay) -> Unit)? = null,
    actionLabel: String? = "Select Date",
    onAction: (() -> Unit)? = null,
) {
    Column(
        modifier = modifier
            .width(360.dp)
            .background(SnackyColor.bgSurface)
            .padding(SnackySpacingPrimitive.space24),
        // Figma: VERTICAL, 24 gap, 24 padding.
        verticalArrangement = Arrangement.spacedBy(SnackySpacingPrimitive.space24),
    ) {
        // "Calendar Header Container": 312x36, 24dp arrows either side.
        Row(
            modifier = Modifier.fillMaxWidth().height(36.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            NavArrow(onClick = onPrevMonth)
            BasicText(
                text = label,
                modifier = Modifier.weight(1f),
                style = TextStyle(
                    color = SnackyColor.textPrimary,
                    fontSize = SnackyTypography.H3.bold.fontSize,
                    fontWeight = SnackyTypography.H3.bold.fontWeight,
                    lineHeight = SnackyTypography.H3.bold.lineHeight,
                    letterSpacing = SnackyTypography.H3.bold.letterSpacing,
                    textAlign = TextAlign.Center,
                ),
            )
            NavArrow(onClick = onNextMonth, flip = true)
        }

        Column(
            // Figma's row pitch is 59 (a 36 row plus a 23 gap). The cell here is
            // 40 because the selected day's circle is 40 and would otherwise
            // overflow, so the gap is 59 - 40 = 19 to keep the same pitch.
            verticalArrangement = Arrangement.spacedBy(19.dp),
        ) {
            Row(modifier = Modifier.fillMaxWidth().height(30.dp)) {
                weekdayLabels.forEach { d ->
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                        BasicText(
                            text = d,
                            style = TextStyle(
                                color = SnackyColor.textPrimary,
                                fontSize = SnackyTypography.Small.regular.fontSize,
                                fontWeight = SnackyTypography.Small.regular.fontWeight,
                                lineHeight = SnackyTypography.Small.regular.lineHeight,
                            ),
                        )
                    }
                }
            }
            weeks.forEach { week ->
                Row(modifier = Modifier.fillMaxWidth().height(40.dp)) {
                    week.forEach { day ->
                        DayCell(day, onSelect)
                    }
                }
            }
        }

        if (actionLabel != null && onAction != null) {
            SnackyButton(text = actionLabel, onClick = onAction, modifier = Modifier.fillMaxWidth())
        }
    }
}

@Composable
private fun androidx.compose.foundation.layout.RowScope.DayCell(
    day: CalendarDay,
    onSelect: ((CalendarDay) -> Unit)?,
) {
    Box(
        modifier = Modifier
            .weight(1f)
            .height(40.dp)
            // The range band sits behind the whole cell; the two ends also get
            // the filled circle below.
            .background(if (day.inRange || day.selected) SnackyColor.bgSurfaceHighlight else Color.Transparent)
            .then(
                if (day.inMonth && onSelect != null) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = { onSelect(day) },
                    )
                } else {
                    Modifier
                }
            ),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(if (day.selected) SnackyColor.bgActionPrimary else Color.Transparent),
            contentAlignment = Alignment.Center,
        ) {
            BasicText(
                text = day.label,
                style = TextStyle(
                    color = if (day.inMonth) SnackyColor.textPrimary else SnackyColor.textDisabled,
                    fontSize = 16.sp,
                    fontWeight = if (day.selected) {
                        SnackyTypography.H3.bold.fontWeight
                    } else {
                        SnackyTypography.Body.regular.fontWeight
                    },
                    lineHeight = 36.sp,
                    textAlign = TextAlign.Center,
                ),
            )
        }
        if (day.marked) {
            // Figma "Ellipse 38": an 8dp accent dot under a marked day.
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 2.dp)
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(SnackyColor.bgActionPrimary),
            )
        }
    }
}

/** The set has no forward arrow, so the next control is the back glyph mirrored. */
@Composable
private fun NavArrow(onClick: (() -> Unit)?, flip: Boolean = false) {
    Box(
        modifier = Modifier
            .size(24.dp)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onClick,
                    )
                } else {
                    Modifier
                }
            )
            .then(if (flip) Modifier.rotate(180f) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        SnackyIcon(SnackyIcons.Outline.Back, size = 24.dp, tint = SnackyColor.iconPrimary)
    }
}
