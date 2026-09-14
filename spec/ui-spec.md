# UI Design System

The portal uses a calm, accessible interface designed for focused hands-on learning.

## Colors

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#0a0a0a` | Default application background |
| Surface | `#141414` | Cards, panels, and elevated sections |
| Border | `#262626` | Dividers and component boundaries |
| Accent | `#3b82f6` | Primary actions, links, and focus emphasis |
| Text | `#ededed` | Primary content |
| Muted | `#737373` | Secondary content and metadata |

Dark mode is the default. Light mode is an available option while retaining accessible contrast.

## Spacing

Use a 4px base unit. Component spacing should use multiples of 4px to maintain a consistent rhythm.

## Layout

The `/labs` page uses a 2–3 column CSS Grid Bento layout. Cards may span different columns or rows to establish visual hierarchy without sacrificing scanability or responsive behavior.

## Components

The shared component system includes:

- **Button**: primary, secondary, and destructive actions with visible focus states.
- **Card**: surface container for labs, progress, and submission summaries.
- **Input**: labeled, validated form control with accessible error messaging.
- **Badge**: compact category, difficulty, or status indicator.
- **Skeleton**: content-shaped loading placeholder; use instead of spinners for page data.
- **Toast**: concise, dismissible feedback for completed actions and recoverable errors.

## Motion

- Hover and focus transitions use `150ms ease-out`.
- Page transitions use `200ms`.
- Motion explains state changes and should remain subtle.
- Respect `prefers-reduced-motion` by reducing or removing non-essential animation.

## Accessibility

Use semantic HTML, keyboard navigation, visible focus rings, sufficient color contrast, descriptive labels, and ARIA attributes only when native semantics are insufficient. The target is WCAG AA minimum compliance.
