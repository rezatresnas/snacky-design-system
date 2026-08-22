package com.snacky.ui.components.illustration

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * The five documented spot illustrations, each with the fixed canvas size
 * Figma authors it at. Mirrors `IllustrationVariant` in packages/react-ui's
 * Illustration.tsx exactly.
 */
enum class IllustrationVariant(val width: Dp, val height: Dp) {
    /** No results / empty list. */
    Empty(268.dp, 200.dp),

    /** Registration screen. */
    CreateAccount(360.dp, 240.dp),

    /** Welcome / login screen. */
    Welcome(200.dp, 200.dp),

    /** Order / action success. */
    Success(200.dp, 200.dp),

    /** Referral program promotion. */
    DiscountReferral(268.dp, 200.dp),
}

/**
 * Snacky Illustration - decorative spot illustration for empty states,
 * onboarding and confirmations. Mirrors packages/react-ui's
 * Illustration.tsx/Illustration.css.
 *
 * Like react-ui, this ships NO artwork: the package carries no image assets
 * and no image loader, so [content] is whatever image composable you already
 * use (Coil's `AsyncImage`, a bundled drawable, a `painterResource`). What
 * this owns is the variant's fixed canvas size, so the illustration occupies
 * the same footprint the design system documents regardless of what you
 * render inside it.
 *
 * The artwork itself can be exported from Figma the same way the icon set
 * was (see `assets/icons/icons.json` and `scripts/generate-icons.js`); it
 * is deliberately not bundled here, matching react-ui's own "host your own
 * export" decision rather than silently shipping five large assets inside a
 * component library.
 */
@Composable
fun SnackyIllustration(
    variant: IllustrationVariant,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(modifier = modifier.size(width = variant.width, height = variant.height)) {
        content()
    }
}
