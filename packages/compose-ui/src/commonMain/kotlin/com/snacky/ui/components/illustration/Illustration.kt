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
 * ```
 * SnackyIllustration(IllustrationVariant.Empty) {
 *     Image(
 *         painter = painterResource(Res.drawable.illus_empty),
 *         contentDescription = "No products found",
 *     )
 * }
 * ```
 *
 * Shipping no artwork is deliberate, and the normal split - Material, Radix
 * and Chakra ship none either. The documented canvas size is the part that
 * belongs in a design system; the Snacky artwork itself is modified stock
 * and is not ours to redistribute. For bundled artwork of your own,
 * `composeResources/drawable/` is the idiomatic home (works on Android and
 * iOS, and unlike generated `ImageVector` Kotlin it does not compile a large
 * illustration into source). Open Peeps (openpeeps.com) is CC0 and drops in
 * cleanly; unDraw (undraw.co) is free without attribution but its licence
 * forbids redistributing assets "in packs", so keep it inside your own app.
 * See this package's README for the fuller note.
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
