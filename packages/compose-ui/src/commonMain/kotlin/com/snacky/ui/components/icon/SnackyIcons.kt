package com.snacky.ui.components.icon

import com.snacky.ui.components.icon.IconShape.Circle
import com.snacky.ui.components.icon.IconShape.Rect
import com.snacky.ui.components.icon.IconShape.SvgPath

/**
 * Snacky icon set, matching the `SnackyIcons.outline.home` /
 * `SnackyIcons.solid.home` namespace used throughout the design system's
 * documented code samples, and mirroring `packages/react-ui`'s
 * `src/icons/outline.tsx` / `solid.tsx` one-for-one.
 *
 * Every path string here is copied verbatim from the react-ui source, so
 * the two platforms render identical geometry. See [SnackyIcon]'s doc
 * comment for the set's documented gap: this is a starter subset drawn
 * generically, NOT the full 41-icon Outline / 10-icon Solid set exported
 * from the real Figma icon components.
 *
 * Usage:
 * ```
 * SnackyIcon(SnackyIcons.Outline.Home, contentDescription = "Home")
 * SnackyIcon(SnackyIcons.Solid.Home, tint = SnackyColor.iconBrand)
 * ```
 */
object SnackyIcons {

    object Outline {
        val Home = path("M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z")
        val Category = shapes(
            Rect(4f, 4f, 7f, 7f, 1f),
            Rect(13f, 4f, 7f, 7f, 1f),
            Rect(4f, 13f, 7f, 7f, 1f),
            Rect(13f, 13f, 7f, 7f, 1f),
        )
        val Cart = shapes(
            Circle(9f, 20f, 1f),
            Circle(17f, 20f, 1f),
            SvgPath("M3 4h2l2.4 11.6a1.5 1.5 0 0 0 1.47 1.2h8.06a1.5 1.5 0 0 0 1.47-1.2L20 7H6"),
        )
        val CartAdd = shapes(
            Circle(9f, 20f, 1f),
            Circle(17f, 20f, 1f),
            SvgPath("M3 4h2l2.4 11.6a1.5 1.5 0 0 0 1.47 1.2h8.06a1.5 1.5 0 0 0 1.47-1.2L20 7H6"),
            SvgPath("M18 2v5M15.5 4.5h5"),
        )
        val History = shapes(
            SvgPath("M3 12a9 9 0 1 0 3-6.7"),
            SvgPath("M3 4v4h4"),
            SvgPath("M12 8v4l3 2"),
        )
        val Account = shapes(
            Circle(12f, 8f, 3.5f),
            SvgPath("M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"),
        )
        val Eye = shapes(
            SvgPath("M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"),
            Circle(12f, 12f, 2.5f),
        )
        val EyeOff = shapes(
            SvgPath("M3 3l18 18"),
            SvgPath("M10.6 5.6A9.9 9.9 0 0 1 12 5.5c6.5 0 10 6.5 10 6.5a15.9 15.9 0 0 1-3.4 4.2M6.5 6.8A16.4 16.4 0 0 0 2 12s3.5 6.5 10 6.5a10 10 0 0 0 4-.8"),
            SvgPath("M9.9 9.9a2.5 2.5 0 0 0 3.5 3.5"),
        )
        val ChevronDown = path("M6 9l6 6 6-6")
        val ChevronUp = path("M6 15l6-6 6 6")
        val ChevronRight = path("M9 6l6 6-6 6")
        val Back = path("M15 6l-6 6 6 6")
        val Close = path("M6 6l12 12M18 6L6 18")
        val CloseCircle = shapes(
            Circle(12f, 12f, 9f),
            SvgPath("M9 9l6 6M15 9l-6 6"),
        )
        val Calendar = shapes(
            Rect(3f, 5f, 18f, 16f, 2f),
            SvgPath("M3 9h18M8 3v4M16 3v4"),
        )
        val Search = shapes(
            Circle(11f, 11f, 7f),
            SvgPath("M21 21l-4.3-4.3"),
        )
        val Location = shapes(
            SvgPath("M12 21s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12Z"),
            Circle(12f, 9f, 2.5f),
        )

        /** react-ui exports `pin` as an alias of `location`; kept identical here. */
        val Pin = Location
        val Send = path("M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z")
        val Chat = path("M21 12a8 8 0 1 1-3.3-6.5L21 4l-1 4.7A7.9 7.9 0 0 1 21 12Z")
        val MessageSquare = path("M4 4h16v12H8l-4 4V4Z")
        val Heart = path("M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9Z")
        val Bell = shapes(
            SvgPath("M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"),
            SvgPath("M10 19a2 2 0 0 0 4 0"),
        )
        val Check = path("M5 13l4 4 10-10")
        val Plus = path("M12 5v14M5 12h14")
        val Minus = path("M5 12h14")
        val Trash = path("M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13")
        val Edit = path("M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z")
        val Share = shapes(
            Circle(6f, 12f, 2.5f),
            Circle(18f, 6f, 2.5f),
            Circle(18f, 18f, 2.5f),
            SvgPath("M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4"),
        )
        val Camera = shapes(
            SvgPath("M4 8h3l2-2h6l2 2h3v11H4V8Z"),
            Circle(12f, 13.5f, 3.5f),
        )
        val Phone = path("M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z")
        val Lock = shapes(
            Rect(5f, 11f, 14f, 9f, 1.5f),
            SvgPath("M8 11V8a4 4 0 0 1 8 0v3"),
        )
        val Document = shapes(
            SvgPath("M7 3h7l4 4v14H7V3Z"),
            SvgPath("M14 3v4h4"),
        )
        val CreditCard = shapes(
            Rect(3f, 6f, 18f, 12f, 2f),
            SvgPath("M3 10h18"),
        )
        val Receipt = shapes(
            SvgPath("M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5V3Z"),
            SvgPath("M9 8h6M9 12h6"),
        )
        val Smartphone = shapes(
            Rect(7f, 2f, 10f, 20f, 2f),
            SvgPath("M11 19h2"),
        )
        val Key = shapes(
            Circle(8f, 15f, 4f),
            SvgPath("M11 12l9-9M17 6l3 3M14 9l2 2"),
        )
        val Help = shapes(
            Circle(12f, 12f, 9f),
            SvgPath("M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1-1 1.7"),
            SvgPath("M12 17h.01"),
        )
        val Logout = shapes(
            SvgPath("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"),
            SvgPath("M16 17l5-5-5-5M21 12H9"),
        )
        val Truck = shapes(
            SvgPath("M2 7h11v10H2V7Z"),
            SvgPath("M13 10h4l4 3v4h-8v-7Z"),
            Circle(7f, 19f, 1.5f),
            Circle(17f, 19f, 1.5f),
        )
        val Cash = shapes(
            Rect(2f, 6f, 20f, 12f, 2f),
            Circle(12f, 12f, 3f),
        )
        val Clock = shapes(
            Circle(12f, 12f, 9f),
            SvgPath("M12 7v5l3.5 2"),
        )
    }

    /**
     * Filled counterparts for the active/selected Navbar + Favorite states.
     * react-ui ships only these four of the documented 10 (Home, Category,
     * Cart, Document, Person, Bell, Truck, Cash, Gift, Heart); the rest
     * should come from Figma rather than being redrawn, so this port
     * deliberately stops at the same four rather than inventing the others.
     */
    object Solid {
        val Home = path("M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z", filled = true)
        val Category = SnackyIconSpec(
            listOf(
                Rect(4f, 4f, 7f, 7f, 1f),
                Rect(13f, 4f, 7f, 7f, 1f),
                Rect(4f, 13f, 7f, 7f, 1f),
                Rect(13f, 13f, 7f, 7f, 1f),
            ),
            filled = true,
        )
        val Cart = path(
            "M3 4h2l2.4 11.6a1.5 1.5 0 0 0 1.47 1.2h8.06a1.5 1.5 0 0 0 1.47-1.2L20 7H6l-.4-2H3v-1Zm6 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
            filled = true,
        )
        val Heart = path("M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9Z", filled = true)
    }
}
