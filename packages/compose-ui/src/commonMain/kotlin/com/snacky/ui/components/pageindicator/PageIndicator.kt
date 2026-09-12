package com.snacky.ui.components.pageindicator

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.snacky.ui.theme.SnackyColor
import com.snacky.ui.theme.SnackyGap

/**
 * Snacky Page Indicator - the dot row under a carousel. Figma draws the current
 * page as a 28x8 pill and every other page as an 8x8 dot, 4 apart, and the Home
 * hero carousel sits it 10 below the banner, centred. Mirrors packages/react-ui's
 * `PageIndicator`.
 *
 * It reports position, it does not change it: the dots carry no click target and
 * the row carries a single description instead. Make the pager itself operable.
 */
@Composable
fun SnackyPageIndicator(
    count: Int,
    activeIndex: Int,
    modifier: Modifier = Modifier,
    contentDescription: String = "Page ${activeIndex + 1} of $count",
) {
    Row(
        modifier = modifier.semantics { this.contentDescription = contentDescription },
        horizontalArrangement = Arrangement.spacedBy(SnackyGap.cell),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        repeat(count) { i ->
            val active = i == activeIndex
            Box(
                modifier = Modifier
                    // The current page widens into a pill rather than growing,
                    // so the row stays 8 tall whichever page is showing.
                    .width(if (active) 28.dp else 8.dp)
                    .height(8.dp)
                    .clip(RoundedCornerShape(percent = 50))
                    .background(if (active) SnackyColor.bgIndicatorActive else SnackyColor.bgIndicatorInactive),
            )
        }
    }
}
