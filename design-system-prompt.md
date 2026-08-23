# Snacky App design system - copy/paste prompt

For any AI tool that takes a text prompt rather than reading files - Google Stitch,
v0, Bolt, Lovable's chat box, Claude Artifacts, etc. Copy everything below the line
into the tool's prompt or system-context box. It's condensed from `llms.txt` for
exactly that case - if the tool can read files directly or has a design-system
config (Figma import, GitHub connection, `npm install`), use `tokens.json` and
`components.json` instead, they're more complete and won't drift from this file.

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

**Components** - the 22 documented components ship under these exact export
names. Use them verbatim; several documented "components" are really a family
(what the docs call "Input" is six separate exports, for example).

React, from `@snacky/ui` (37):
Button, IconButton, UploadButton, TextField, SearchField, OtpField,
CopyField, ChatInput, AddressResult, ProductChip, FilterChip, RadioOption,
Checkbox, Toggle, NavBar, TabRow, Header, HeroBanner, SquareBanner,
FullWidthBanner, PointBalanceBanner, AlertBanner, NotificationBadge,
DiscountTag, SoldOutBadge, VariantBadge, Callout, OrderListItem,
NotificationListItem, Accordion, BottomSheet, Section, Avatar,
Illustration, ProductImage, ProductCard, SnackyIcons

Compose, from `com.github.rezatresnas:snacky-design-system` (38):
SnackyAccordion, SnackyAddressResult, SnackyAlertBanner, SnackyAvatar,
SnackyBadge, SnackyBottomSheet, SnackyButton, SnackyCallout,
SnackyChatInput, SnackyCheckbox, SnackyCopyField, SnackyDiscountTag,
SnackyFilterChip, SnackyFullWidthBanner, SnackyHeader, SnackyHeroBanner,
SnackyIcon, SnackyIconButton, SnackyIllustration, SnackyNavBar,
SnackyNotificationListItem, SnackyOrderListItem, SnackyOtpField,
SnackyPasswordField, SnackyPointBalanceBanner, SnackyProductCard,
SnackyProductCardDetails, SnackyProductChip, SnackyProductImage,
SnackyRadioOption, SnackySearchField, SnackySection, SnackySoldOutBadge,
SnackySquareBanner, SnackyTabRow, SnackyTextField, SnackyToggle,
SnackyVariantBadge

Compose enums you will need: ButtonVariant, ButtonSize, IconButtonVariant,
IconButtonSize, AvatarSize, CalloutVariant, HeaderLeadingIcon,
IllustrationVariant, OrderStatus, ProductImageUsage.

In Compose, every image-bearing component takes the image as a `content` slot
(the package ships no image loader), and no font is bundled.

Match these values exactly rather than approximating - if a spacing/color/radius
value you'd normally default to doesn't match one listed above, use the listed value.
