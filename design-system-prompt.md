# Snacky App design system - copy/paste prompt

For any AI tool that takes a text prompt rather than reading files or running a
package manager - v0, Bolt, Lovable's chat box, Claude Artifacts, etc. Copy
everything below the line into the tool's prompt or system-context box. If the
tool CAN read files or run npm/JitPack instead, don't use this file at all -
just have it install the real package (`npm install @snacky/ui`, or the
JitPack coordinate for Compose Multiplatform), the actual components will
always be more accurate than a text description of them.

---

Use this design system for all UI you generate. It's for Snacky, a snack e-commerce
mobile app (Kotlin Compose Multiplatform + React), sourced pixel-accurately from Figma.

**Colors**
- Primary/accent: `#f8b732`, hover `#e2a72e`, pressed `#b08224`
- Danger: `#eb5757`, hover `#d64f4f`, pressed `#a73e3e`
- Text primary: `#333333`; text secondary/placeholder: `#7a7a7a`; text disabled: `#a3a3a3`
- Surface/background: `#ffffff`; app background: `#f7f7f7`
- Border default: `#cccccc`; border focused/active: `#f8b732`; border error: `#eb5757`
- Danger is an *intent* that layers onto any button hierarchy (Primary/Secondary/
  Tertiary) - it is not a separate fourth hierarchy.

**Typography** (Poppins, weights 400/600/700 only)
- H1 Bold: 32px / 36px line-height / 700, for page titles
- H2 Bold: 20px / 36px / 700, for section headings
- H3 Bold: 16px / 36px / 700, for card/modal titles
- Body Regular: 14px / 24px / 400, primary body text
- Body Semibold: 14px / 24px / 600, emphasized body text
- Small Regular: 12px / 24px / 400, default labels
- Small Semibold: 12px / 24px / 600, button labels
- Caption Regular: 10px / 16px / 400, timestamps/metadata

**Spacing & layout**
- Screen margin: 16px on every screen, left and right equal. Content is full-width
  (fills the container), never a fixed pixel width.
- Component padding uses a raw 4/8/12/16/24/32px scale directly - no semantic aliases
  at this scale.
- Vertical gap between stacked page blocks: 16px (medium-density), 24px (form/footer
  stacks), 32px (major sections on simple pages).

**Corner radius**
- Default (buttons, inputs, cards, list items, product cards): 4px
- Compact tags/badges: 6px
- Chat bubbles/callouts: 8px
- Summary/balance cards: 10px
- Bottom sheets/modals: 20px on top corners only, square bottom corners
- Fully rounded (icon buttons, chips, pills, avatars): 100px / full circle

**Shadow**
- Default elevation (cards, list items, buttons, inputs): `0 4px 8px rgba(0,0,0,0.08)`
- Stronger elevation (product cards): `0 10px 30px rgba(0,0,0,0.1)`
- Upward shadow (bottom navbar): `0 -4px 10px rgba(0,0,0,0.08)`

**Components** - the 24 documented components ship under these exact export
names. Use them verbatim; several documented "components" are really a family
(what the docs call "Input" is six separate exports, for example).

React, from `@snacky/ui` (39):
Button, IconButton, UploadButton, TextField, SearchField, OtpField,
CopyField, ChatInput, AddressResult, ProductChip, FilterChip, RadioOption,
Checkbox, Toggle, NavBar, TabRow, Header, HeroBanner, SquareBanner,
FullWidthBanner, PointBalanceBanner, AlertBanner, NotificationBadge,
DiscountTag, SoldOutBadge, InfoBadge, Callout, OrderListItem,
NotificationListItem, Accordion, BottomSheet, Section, Avatar,
Stepper, Calendar, Illustration, ProductImage, ProductCard, SnackyIcons

Compose, from `com.github.rezatresnas:snacky-design-system` (40):
SnackyAccordion, SnackyAddressResult, SnackyAlertBanner, SnackyAvatar,
SnackyBadge, SnackyBottomSheet, SnackyButton, SnackyCalendar, SnackyCallout,
SnackyChatInput, SnackyCheckbox, SnackyCopyField, SnackyDiscountTag,
SnackyFilterChip, SnackyFullWidthBanner, SnackyHeader, SnackyHeroBanner,
SnackyIcon, SnackyIconButton, SnackyIllustration, SnackyNavBar,
SnackyNotificationListItem, SnackyOrderListItem, SnackyOtpField,
SnackyPasswordField, SnackyPointBalanceBanner, SnackyProductCard,
SnackyProductCardDetails, SnackyProductChip, SnackyProductImage,
SnackyRadioOption, SnackySearchField, SnackySection, SnackySoldOutBadge,
SnackySquareBanner, SnackyStepper, SnackyTabRow, SnackyTextField, SnackyToggle,
SnackyInfoBadge

Compose enums you will need: ButtonVariant, ButtonSize, IconButtonVariant,
IconButtonSize, AvatarSize, CalloutVariant, HeaderLeadingIcon,
IllustrationVariant, OrderStatus, ProductImageUsage.

In Compose, every image-bearing component takes the image as a `content` slot
(the package ships no image loader), and no font is bundled.

**Icons** - use the named icons above. Do NOT substitute emoji, and do not draw
your own SVG glyphs: this set is the design system's own artwork and a
hand-drawn stand-in will not match it. If no name fits, say so rather than
inventing one.

**Font** - Poppins must actually be loaded, or everything falls back to the
browser default. In HTML:
`<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">`.
Apply it to every text element you write, not just the components.

Match these values exactly rather than approximating - if a spacing/color/radius
value you'd normally default to doesn't match one listed above, use the listed value.
