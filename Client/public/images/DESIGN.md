---
name: AssetFlow Enterprise
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  metric-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.03em
  metric-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  grid-columns: '12'
---

## Brand & Style
The design system is engineered for high-stakes asset management, prioritizing clarity, precision, and a sense of institutional stability. The aesthetic is **Corporate Modern** with a lean towards **Minimalism**, heavily influenced by the "Linear" aesthetic—utilizing high-density layouts, subtle monochromatic layering, and sharp, purposeful accents.

The target audience consists of Fortune 500 financial analysts and executives who require rapid data synthesis. The emotional response should be one of absolute control and sophisticated efficiency. Visual depth is achieved through meticulous border treatments rather than heavy shadows, ensuring the interface remains "light" despite the high information density.

## Colors
The palette is rooted in Deep Slate and White to establish a professional foundation, with Cyan used sparingly as a high-precision tool for focus and action. 

- **Primary & Secondary:** Used for structural elements, sidebars, and primary text to ground the interface.
- **Accent (Cyan):** Reserved for interactive states, active indicators, and "Glow" effects in the navigation.
- **Semantic Colors:** Success, Warning, and Critical colors follow industry standards but are slightly desaturated to maintain the premium feel.
- **Neutral/Surface:** A layered approach using #F8FAFC for the canvas and #FFFFFF for cards and interactive components to create a clear separation of concerns.

## Typography
The system employs a dual-typeface strategy. **Hanken Grotesk** (serving as the Satoshi alternative) provides a modern, high-legibility geometric base for headers and body copy. **JetBrains Mono** is utilized for all quantitative data, metrics, and labels to emphasize the technical, data-driven nature of the platform.

For mobile layouts, `display-lg` should scale down to 32px, and `headline-lg` to 24px. Ensure that all metric-based text maintains its monospaced integrity to allow for easy vertical scanning of numbers in data grids.

## Layout & Spacing
This design system utilizes a **4px baseline grid** to achieve high-density information architecture. The layout is a 12-column fluid grid that transitions into a fixed-width container at 1440px to prevent excessive line lengths on ultra-wide monitors.

- **Desktop (1200px+):** 12 columns, 32px margins, 16px gutters.
- **Tablet (768px - 1199px):** 8 columns, 24px margins, 16px gutters.
- **Mobile (<767px):** 4 columns, 16px margins, 12px gutters.

Navigation is handled via a collapsible side rail (240px expanded / 64px collapsed). Content should be grouped into logical "Zoned" areas using whitespace rather than heavy lines to reduce visual noise in data-heavy views.

## Elevation & Depth
Elevation is expressed through **Low-Contrast Outlines** and subtle tonal shifts. We avoid heavy drop shadows to maintain a "flat but layered" look.

1.  **Level 0 (Background):** #F8FAFC.
2.  **Level 1 (Cards/Surfaces):** #FFFFFF with a 1px border (#E2E8F0).
3.  **Level 2 (Modals/Popovers):** #FFFFFF with a 1px border and a very soft, diffused shadow (0px 10px 15px -3px rgba(15, 23, 42, 0.05)).
4.  **Active State:** Elements may use a subtle Cyan glow (`0px 0px 8px rgba(6, 182, 212, 0.2)`) to indicate focus or active selection, particularly in the navigation sidebar.

## Shapes
The shape language is **Soft (0.25rem/4px)**. This creates a crisp, professional look that feels modern but remains grounded. 

- **Buttons & Inputs:** 4px radius.
- **Cards & Panes:** 8px radius (rounded-lg).
- **Modals:** 12px radius (rounded-xl).
- **Data Grid Cells:** 0px radius (sharp corners) to maximize space and maintain visual alignment of tabular data.

## Components
### Buttons & Inputs
Buttons feature a high-contrast style. Primary buttons use the Deep Slate (#0F172A) background with white text. Input fields should use a subtle gray border that transitions to Cyan (#06B6D4) on focus.

### Data Grids
Advanced grids are the core of the system. Use a 32px row height for high density. Headers are `label-caps` in JetBrains Mono. Use zebra-striping only on hover states to maintain a clean look.

### Navigation Sidebar
The sidebar is collapsible. The active page is indicated by a vertical Cyan line (2px) on the left edge and a soft Cyan glow backdrop. Icons should be 20px, stroke-based, with a 1.5px weight.

### Executive Cards
Dashboard cards include "Sparklines"—simplified area charts in the top right corner using the Accent or Success color. Metrics are displayed in `metric-lg` JetBrains Mono.

### Kanban Boards
Cards within Kanban boards use the Level 1 elevation (white surface, 1px border). Drag-and-drop interactions should be smoothed with a 200ms ease-in-out transition, and the ghost-element should utilize a Cyan dashed border.