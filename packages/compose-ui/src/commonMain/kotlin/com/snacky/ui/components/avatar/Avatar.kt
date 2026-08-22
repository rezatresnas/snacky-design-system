package com.snacky.ui.components.avatar

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import com.snacky.ui.theme.SnackySize

enum class AvatarSize { Small, Medium, Large }

/**
 * Snacky Avatar - circular profile photo in three fixed sizes (32/56/72dp).
 * Confirmed against Figma (node 8807:6467, page "Avatar"): a plain circle
 * with an image fill, no border or ring in any size.
 *
 * Ships no image loader (this package has no network/bitmap-loading
 * dependency, the same documented gap as Illustration) - [content] is
 * whatever image composable you already use (Coil's `AsyncImage`, a raw
 * `Image(bitmap = ...)`, etc.), this just handles the fixed size and
 * circular clip.
 */
@Composable
fun SnackyAvatar(
    modifier: Modifier = Modifier,
    size: AvatarSize = AvatarSize.Medium,
    content: @Composable () -> Unit,
) {
    val dimension = when (size) {
        AvatarSize.Small -> SnackySize.Avatar.sm
        AvatarSize.Medium -> SnackySize.Avatar.md
        AvatarSize.Large -> SnackySize.Avatar.lg
    }
    Box(
        modifier = modifier
            .size(dimension)
            .clip(CircleShape),
    ) {
        content()
    }
}
