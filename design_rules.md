# Design Rules for This Project

## Project Design Pattern: ---

## Visual Style

### Color Palette:
- Primary background: #F8F9FB (off-white, used for main workspace and cards)
- Sidebar background: #FFFFFF (pure white for navigation sidebar)
- Accent color: #4998F3 (blue, used for buttons and highlights)
- Text primary: #151A29 (very dark navy, for titles and main text)
- Text secondary: #8A8F98 (medium gray, for descriptions and secondary info)
- Positive accent: #3AC569 (green, for success/numbers up)
- Negative accent: #F44336 (red, for alerts/numbers down)
- Chart lines: #FFA86A (orange), #7CB8F7 (blue)
- Border/Divider: #E5E7EB (light gray for card edges and separator lines)
- Muted icon: #EDEDED (background for status icons)
- Hover/active: subtle, with light blue (#E9F3FE) or gray overlay

### Typography & Layout:
- Font family: Rounded geometric sans-serif (e.g., Inter, Poppins, or similar)
- Font weights: Regular (400) for body, SemiBold (600) for headings
- Headings: Large, left-aligned, clear hierarchy with increased size and weight
- Body text: Medium size, high line height for readability
- Spacing: Generous padding (24-32px) around main sections; consistent 16px gaps between elements
- Alignment: Left-aligned text and content; cards and components are center-aligned vertically within sections
- Section headers: Slightly lighter color for subtext/descriptions

### Key Design Elements
#### Card Design:
- Cards: Rounded corners (16px radius), white background (#FFFFFF)
- Shadow: Very soft, subtle elevation (0 4px 16px rgba(21,26,41,0.04))
- Borders: Thin, light gray (#E5E7EB) or no border
- Hover state: Slight lift with increased shadow and faint color overlay
- Hierarchy: Title at top, main stats or content in bold, secondary info below in muted color

#### Navigation:
- Sidebar: Vertical, left-aligned with icon+text for each primary nav item
- Active state: Bold text, blue dot or highlight bar, background subtly filled (#E9F3FE)
- Collapsible: Not shown; navigation remains static and always visible
- Secondary actions: Grouped at the bottom (help, logout), separated by divider

#### Data Visualization:
- Line charts: Smooth, thin lines in soft accent colors (#FFA86A orange, #7CB8F7 blue)
- Data points: Small filled circles, tooltip with dark background (#12223E)
- Axis: Minimal, light gray lines with simple numeric labels
- Overall: Clean, minimal, data-forward with no clutter

#### Interactive Elements:
- Buttons: Rounded pill shape, solid accent fill (#4998F3) with white text; subtle shadow
- Button hover: Slight darkening of accent color, soft shadow
- Forms: Rounded input fields, light border (#E5E7EB), clear focus state with blue outline
- Toggles/filters: Rounded, pill-shaped selectors with active blue fill
- Micro-interactions: Fade and slide animations for tooltips and state changes

### Design Philosophy
This interface embodies:
- A modern, minimalist, and highly professional aesthetic
- Clean lines, open space, and a focus on clarity and usability
- Visuals that promote trust, efficiency, and approachability for business users
- User experience goals: reduce cognitive load, make workflows intuitive, and surface key metrics at a glance
- Visual strategy: Light, airy, and unobtrusive with carefully chosen accent colors to guide user attention and reinforce brand personality

---

This project follows the "---

## Visual Style

### Color Palette:
- Primary background: #F8F9FB (off-white, used for main workspace and cards)
- Sidebar background: #FFFFFF (pure white for navigation sidebar)
- Accent color: #4998F3 (blue, used for buttons and highlights)
- Text primary: #151A29 (very dark navy, for titles and main text)
- Text secondary: #8A8F98 (medium gray, for descriptions and secondary info)
- Positive accent: #3AC569 (green, for success/numbers up)
- Negative accent: #F44336 (red, for alerts/numbers down)
- Chart lines: #FFA86A (orange), #7CB8F7 (blue)
- Border/Divider: #E5E7EB (light gray for card edges and separator lines)
- Muted icon: #EDEDED (background for status icons)
- Hover/active: subtle, with light blue (#E9F3FE) or gray overlay

### Typography & Layout:
- Font family: Rounded geometric sans-serif (e.g., Inter, Poppins, or similar)
- Font weights: Regular (400) for body, SemiBold (600) for headings
- Headings: Large, left-aligned, clear hierarchy with increased size and weight
- Body text: Medium size, high line height for readability
- Spacing: Generous padding (24-32px) around main sections; consistent 16px gaps between elements
- Alignment: Left-aligned text and content; cards and components are center-aligned vertically within sections
- Section headers: Slightly lighter color for subtext/descriptions

### Key Design Elements
#### Card Design:
- Cards: Rounded corners (16px radius), white background (#FFFFFF)
- Shadow: Very soft, subtle elevation (0 4px 16px rgba(21,26,41,0.04))
- Borders: Thin, light gray (#E5E7EB) or no border
- Hover state: Slight lift with increased shadow and faint color overlay
- Hierarchy: Title at top, main stats or content in bold, secondary info below in muted color

#### Navigation:
- Sidebar: Vertical, left-aligned with icon+text for each primary nav item
- Active state: Bold text, blue dot or highlight bar, background subtly filled (#E9F3FE)
- Collapsible: Not shown; navigation remains static and always visible
- Secondary actions: Grouped at the bottom (help, logout), separated by divider

#### Data Visualization:
- Line charts: Smooth, thin lines in soft accent colors (#FFA86A orange, #7CB8F7 blue)
- Data points: Small filled circles, tooltip with dark background (#12223E)
- Axis: Minimal, light gray lines with simple numeric labels
- Overall: Clean, minimal, data-forward with no clutter

#### Interactive Elements:
- Buttons: Rounded pill shape, solid accent fill (#4998F3) with white text; subtle shadow
- Button hover: Slight darkening of accent color, soft shadow
- Forms: Rounded input fields, light border (#E5E7EB), clear focus state with blue outline
- Toggles/filters: Rounded, pill-shaped selectors with active blue fill
- Micro-interactions: Fade and slide animations for tooltips and state changes

### Design Philosophy
This interface embodies:
- A modern, minimalist, and highly professional aesthetic
- Clean lines, open space, and a focus on clarity and usability
- Visuals that promote trust, efficiency, and approachability for business users
- User experience goals: reduce cognitive load, make workflows intuitive, and surface key metrics at a glance
- Visual strategy: Light, airy, and unobtrusive with carefully chosen accent colors to guide user attention and reinforce brand personality

---" design pattern.
All design decisions should align with this pattern's best practices.

## General Design Principles

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)
- Adjust shadow intensity based on theme (lighter in dark mode)

---

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast (both themes)
- Respect reduced motion preferences

---

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions
9. **Be Themeable** - Support both dark and light modes seamlessly

---

