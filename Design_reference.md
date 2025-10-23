# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

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

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

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
- Sufficient color contrast
- Respect reduced motion preferences

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


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# Autopilot Studio - Development Blueprint

Autopilot Studio is an end-to-end business OS for AI developers and agencies that automates the lifecycle from lead intake to project handover—combining AI-assisted intake, automated proposals and contracting, one-click project spin-up (repos, milestones, client portal), an AI copilot for specs and meeting minutes, integrated billing and profit analytics, launch orchestration, and one-click handover packs. The platform is multi-tenant, audit-ready, and designed for agencies, freelance teams, sales/BD, delivery leads, and client stakeholders.

## 1. Pages (UI Screens)

- Landing Page
  - Purpose: Public marketing, convert visitors to intake booking or signup.
  - Key sections/components: Hero (headline, CTA Book Intake/Explore Demo, hero illustration/video), Feature Grid (icons for Intake, Proposals, Spin-up, Copilot, Billing, Handover), How It Works (4-step illustrated flow), Pricing Teaser (plan cards), Customer Logos & Testimonials, Footer (legal, docs, blog, contact), Header (login/signup).

- Login / Signup Page
  - Purpose: User authentication entry with SSO options.
  - Key sections/components: Auth Tabs (Login / Sign up), Form fields (email, password, name, company), SSO Buttons (Google, Microsoft, GitHub, SAML), Remember Me, Forgot Password, 2FA enrollment CTA, Legal acknowledgement links.

- Password Reset
  - Purpose: Secure password recovery.
  - Key sections/components: Email request form, Reset form (new password, confirm, token validation), Security tips, Success confirmation link.

- Email Verification
  - Purpose: Confirm email addresses and continue onboarding.
  - Key sections/components: Verification status, Resend link (throttled), Next-step CTA.

- Dashboard
  - Purpose: Primary workspace summarizing pipelines, projects, KPIs and quick actions.
  - Key sections/components: Top nav (global search, create), Pipeline Overview (lead funnel), Active Projects List (cards, progress), KPI Widgets (revenue, margin, open tickets), Notifications & Activity Feed, AI Copilot Sidebar (prompts/suggestions), Quick Create.

- AI-Assisted Intake
  - Purpose: Book intake and collect qualification data; trigger auto-proposals.
  - Key sections/components: Booking widget (calendar/timezone), Intake form (goals, budget, timeline, tech stack), AI Assistant Panel (live summary, clarifying Qs, score), Attachments, Submit & Auto-Proposal Trigger.

- Proposal & SoW Generator
  - Purpose: Generate, edit, version, and send proposals/SoWs; handle negotiation and e-sign.
  - Key sections/components: Proposal preview (rich text editor / markdown), Template selector, Milestone pricing table, Version history & comments, E-sign module, PDF export, Send/remind controls.

- E-Contract & Signature
  - Purpose: Execute legally-binding contracts with audit trail.
  - Key sections/components: Contract viewer (folding clauses), Negotiation tools (comments/redlines), Signature workflow (multi-signer), Audit log, Storage & download.

- Project Workspace
  - Purpose: Central hub for delivery: milestones, tasks, repos, client portal and copilot.
  - Key sections/components: Project header (status, budget), Milestones & timeline (Gantt-like), Task board (kanban), Ticket list, Repository integrations feed, Client portal link, AI Copilot pane (specs, CRs, minutes), Launch checklist shortcut.

- Client Portal
  - Purpose: External client-facing view for approvals, assets, and billing snapshot.
  - Key sections/components: Project summary, Deliverables & approvals, Shared assets (file browser, Loom), Threaded comments, Billing snapshot, Approve/sign actions.

- Tasks & Tickets
  - Purpose: Issue/ticket management with AI synthesis and external sync.
  - Key sections/components: Ticket list & advanced filters, Ticket detail (AI-generated acceptance criteria), AI actions (split, regenerate), Sync controls (Jira/GitHub mapping).

- Meetings & Notes
  - Purpose: Schedule/record meetings, transcribe and convert to AI minutes and tickets.
  - Key sections/components: Scheduler (calendar link), Recording upload / live transcription, AI minutes (summary, actions), Export to tickets, Transcript viewer.

- Launch & Deploy
  - Purpose: Orchestrate launch checklists, deploy, publish release notes and schedule comms.
  - Key sections/components: Launch checklist (signoffs), Deployment integrator (Vercel/Cloudflare/custom), Release notes composer (auto-populate), Stakeholder comms scheduler, Rollback instructions.

- Billing & Invoicing
  - Purpose: Milestone/time-based billing, QuickBooks sync, profit analytics.
  - Key sections/components: Invoice list (states), Milestone billing engine, QuickBooks sync status, Time tracking summary, Profit analytics dashboards.

- Handover Pack
  - Purpose: One-click creation of final deliverables and SLA setup for post-launch support.
  - Key sections/components: Handover builder (select assets), Preview (PDF/ZIP), Loom embeds, SLA bot configuration, Renewal options.

- Notifications Center
  - Purpose: Manage in-app/email notifications and templates.
  - Key sections/components: Notification feed, Preferences, Template store with preview.

- Admin Dashboard
  - Purpose: Tenant and system administration, templates, audit logs, system health.
  - Key sections/components: User management, Plans & billing controls, Templates library, Audit logs & compliance exports, System health/monitoring.

- User Profile
  - Purpose: Manage account, company settings, integrations, API keys, security.
  - Key sections/components: Profile info, Company branding, Connected apps list, API keys & webhooks, Security (password/2FA/active sessions), Billing contact.

- About & Help / Docs / Changelog
  - Purpose: Onboarding docs, API docs, support.
  - Key sections/components: Getting started guides, FAQ, API docs, Support contact, Changelog.

- Pricing & Checkout
  - Purpose: Show plans and handle subscription purchases.
  - Key sections/components: Plan cards, Compare table, Checkout modal, Invoice preview & terms.

- 404 / 500 / Loading / Success
  - Purpose: Error handling and user feedback pages.
  - Key sections/components: Error messages with CTAs, Support/incident ID, Loading spinner with context, Success screens.

## 2. Features

- Multi-tenant Architecture
  - Technical details: Tenant isolation via schema-per-tenant or strong row-level tenant_id; data partitioning and encryption at rest; per-tenant config.
  - Implementation notes: AWS IAM + KMS encryption; tenant-scoped storage prefixes in S3; RBAC checks in backend middleware.

- Authentication & SSO
  - Technical details: OAuth2/OpenID Connect for SSO (Google, Microsoft, GitHub), SAML for Enterprise; JWT access tokens + refresh tokens; secure session cookies.
  - Implementation notes: Use Authorization Code flow, PKCE for public clients; store refresh tokens hashed; rate-limit auth endpoints; enforce 2FA via TOTP.

- RBAC & Admin Controls
  - Technical details: Role/permission model (Admin, Owner, PM, Dev, Client, Billing); permission checks at API layer.
  - Implementation notes: Permission matrix stored in DB, middleware authorization, admin-only endpoints require 2FA.

- AI Copilot (LLM Integration)
  - Technical details: LLM provider integration (OpenAI/Anthropic); abstract provider layer for multi-provider fallback; prompt templates with versioning and metadata; token usage accounting.
  - Implementation notes: Human-in-loop review, edit history, confidence scoring, PII redaction pre/post processing, prompt rate limiting, store explainability metadata per result.

- Meeting Transcription & Minutes
  - Technical details: Speech-to-text API (Whisper/Google), store transcripts in object storage, AI summarization pipeline to extract action items and owners.
  - Implementation notes: Attachment upload or live streaming ingestion; confidence thresholds for auto-ticket creation; UI to review/edit minutes before creating tickets.

- Intake & Auto-Qualification
  - Technical details: Intake flow captures structured fields, attachments; qualification engine (rules + ML scoring); calendar booking integration.
  - Implementation notes: Validate tech stack choices mapped to template catalogs; trigger queued job to generate proposal; webhook on booking.

- Proposal & SoW Automation
  - Technical details: Template engine supporting rich text/markdown and variable substitution; milestone pricing calculator (currency, taxes, discount rules); versioned documents; e-sign integration (DocuSign/HelloSign) with webhooks.
  - Implementation notes: PDF generation using headless Chromium or server-side renderer; comment/redline stored as deltas; document access ACLs.

- E-Contract & Signature Workflow
  - Technical details: Contract templates, signature routing, audit trail with timestamps/IPs; webhook handling for signature events.
  - Implementation notes: Store signed PDFs in S3, immutably; ensure legal metadata (signer email, IP, timestamp).

- Project Spin-up Orchestration
  - Technical details: Orchestrator (workflow engine e.g., Temporal, Cadence, or custom job queue) to run idempotent steps: create project record, create milestones, seed tasks, create client portal, link repos (via OAuth app), create CI/CD configs.
  - Implementation notes: Compensating transactions on failure, retry/backoff, monitoring of workflows, idempotency tokens.

- Repository & CI Integration
  - Technical details: OAuth/GitHub Apps for repo access with least privilege; webhook handlers for pushes/PRs/CI checks; mapping commit metadata to tickets.
  - Implementation notes: Store tokens encrypted; read-only by default; UI for repo selection and permission prompts.

- Ticketing & External Sync
  - Technical details: Normalized ticket schema, sync adapters for Jira and GitHub Issues (webhook/polling), conflict resolution strategies, audit trail.
  - Implementation notes: Bulk operations queue, mapping UI for field sync, rate-limited sync workers.

- Launch Checklists & Deployments
  - Technical details: Checklist templating, signoff tracking, deploy connectors to Vercel/Cloudflare/Custom via API, webhook-triggered deploys and status polling.
  - Implementation notes: Secure deploy tokens, capture deploy logs, connect to release notes composer.

- Billing, Invoicing & QuickBooks Integration
  - Technical details: Invoice engine (draft/send/paid states), milestone-triggered invoices, QuickBooks Online integration via OAuth, webhooks for payment updates.
  - Implementation notes: Tax calculation module (region aware), currency handling, retry logic for failed syncs, reconciliation UI.

- Profit Analytics & Time Tracking
  - Technical details: ETL pipeline aggregating revenue, costs, time entries to compute margins and rollups, charting endpoints.
  - Implementation notes: Background jobs for refresh, caching for dashboard, exportable CSVs.

- Handover Pack & SLA Automation
  - Technical details: Document assembly engine to compile selected deliverables into ZIP/PDF, oEmbed support for Loom, SLA bot configuration for post-launch automated ticketing.
  - Implementation notes: Include hashed manifest of included assets, access controls for downloads, expiry links.

- Notifications & Email Templates
  - Technical details: Integration with SendGrid/SES, template store with variable preview, templated transactional emails, retries/backoff.
  - Implementation notes: Per-tenant branding variables, unsubscribe management, bounces handling, deliverability monitoring.

- Global Search & Filters
  - Technical details: Search index (ElasticSearch/Algolia) with ACL-aware results, autocomplete, saved queries, pagination and relevance tuning.
  - Implementation notes: Indexing pipeline for projects, tickets, proposals, docs; update on change events; health checks for search cluster.

- Performance & Monitoring
  - Technical details: Integration with Sentry/Datadog, service health endpoints, background job monitoring, alerting rules and incident tracking.
  - Implementation notes: Define SLIs/SLOs, alert escalation in admin dashboard, dashboards for queue/backlog and throughput.

- Data Export & Backup
  - Technical details: Export engine for CSV/PDF/ZIP, scheduled backups to long-term storage, per-tenant export requests with audit logs, restore pathways.
  - Implementation notes: Retention policies, export request quarantine for large exports.

- Admin & Audit Controls
  - Technical details: Immutable audit logs for sensitive actions, compliance reports export, admin-only endpoints with enforced 2FA.
  - Implementation notes: Log rotation and long-term archival, queryable audit UI.

- Security & Compliance
  - Technical details: Encryption-in-transit (TLS) + at-rest (KMS), CSP headers, rate limiting, anomaly detection for auth, least-privilege tokens for integrations.
  - Implementation notes: SOC2 readiness checklist, tenant data purge workflows, data residency options for Enterprise.

## 3. User Journeys

- Prospect -> Intake -> Contract (External Prospect)
  1. Visit Landing Page; click Book Intake.
  2. Schedule meeting via Booking Widget (choose slot, timezone); fill intake form (goals, budget, tech stack, attachments).
  3. Intake submitted → System runs qualification rules + AI assistant produces summary and qualification score.
  4. If qualified, queued job generates Proposal & SoW using selected template; email sent to prospect (transactional email template).
  5. Prospect reviews proposal in email or client link; negotiates via comments/redlines.
  6. Send for signature → prospect signs via e-sign (DocuSign/HelloSign); webhook confirms signature.
  7. On signature, orchestrator triggers Project Spin-up workflow.

- Signed Contract -> Project Spin-up -> Delivery (Delivery Lead / PM)
  1. Receive notification of signed contract; verify project record created.
  2. Orchestrator creates project workspace, seeds milestones/tasks using templates, creates client portal link, and invites team.
  3. Link repositories via Git provider auth; map repo to project.
  4. AI Copilot drafts initial specs and acceptance criteria; PM reviews and publishes tickets.
  5. Tasks sync with calendars and time-tracking begins; commits and CI events populate activity feed.

- Meeting -> Minutes -> Tickets (Developer / PM)
  1. Schedule meeting from project; record or upload transcript.
  2. Transcription processed → AI summarizer generates minutes and action items.
  3. PM reviews minutes, confirms owners/deadlines; action items converted to tickets automatically.
  4. Tickets optionally synced to external trackers (Jira/GitHub) per mapping.

- Launch -> Deploy -> Handover (DevOps / PM)
  1. Switch project to Launch Mode; run configurable checklists (QA/security) and collect signoffs.
  2. Trigger deployment via connected provider (Vercel/Cloudflare); monitor status.
  3. Release notes auto-generated from commits/tickets; schedule stakeholder comms.
  4. After launch, generate Handover Pack (docs, Loom, governance); configure SLA bot and renewal options; make downloadable for client.

- Billing Lifecycle (Finance / Admin)
  1. Milestone accepted or milestone-complete event triggers invoice draft.
  2. Invoice reviewed and sent; QuickBooks sync performed via OAuth and mapping.
  3. Payments reconciled; profit analytics updated; alerts if margins deviate.

- Admin / Compliance Flow (Platform Admin)
  1. Admin views System Health and Monitoring dashboards (Sentry/Datadog).
  2. Review audit logs for sensitive tenant actions; export compliance reports.
  3. Manage templates, enable/disable integrations, review queued workflows and retry failures.

## 4. UI Guide
(Apply globally; adhere to Visual Style section below. All UI components must follow spacing, typography, colors, and interaction patterns.)

- Layout & Grid
  - App frame: persistent left sidebar (#FFFFFF) width 280px, top nav 72px, main workspace background #F8F9FB.
  - Content container: max-width 1200–1400px centered; inner padding 24–32px; consistent 16px gaps.

- Sidebar Navigation
  - Items: icon + label, left-aligned.
  - Active state: bold text (#151A29), blue highlight bar or dot, background fill #E9F3FE.
  - Secondary actions at bottom separated by divider (#E5E7EB).

- Header & Top Bar
  - Elements: global search (prominent), quick-create button (pill #4998F3), notifications, user avatar menu.
  - Search: ACL-aware autocomplete with keyboard shortcuts.

- Cards
  - Appearance: white background #FFFFFF, rounded 16px, shadow 0 4px 16px rgba(21,26,41,0.04), border radius 16px.
  - Spacing: internal padding 24px.

- Buttons & Controls
  - Primary button: pill shape, fill #4998F3, white text, soft shadow; hover: slightly darker, overlay.
  - Secondary: outline with #4998F3 text.
  - Form inputs: rounded, border #E5E7EB, focus state blue outline.
  - Toggles/pills: rounded with active blue fill.

- Typography
  - Font: Inter / Poppins; weights 400 (body) and 600 (headings).
  - Headings: clear hierarchy, left-aligned; body text medium size with high line-height.

- Colors & Feedback
  - Text primary: #151A29; secondary: #8A8F98.
  - Success: #3AC569; Error: #F44336.
  - Charts: lines use #FFA86A (orange) and #7CB8F7 (blue); axis labels light gray.

- Data Visualization
  - Use minimal axes, smooth lines, small filled data points; tooltips use dark bg #12223E with white text.

- Forms & Editors
  - Rich text editor supports markdown, inline comments, versioning controls.
  - Proposal editor: WYSIWYG with template variables, preview / PDF export.

- Modals & Overlays
  - Centered with 24px padding, rounded corners, max-width 800px, subtle backdrop blur and close on ESC.

- Notifications & Toasts
  - Top-right toasts, auto-hide with undo actions, error toasts persistent until dismissed.

- Accessibility
  - Color contrast meets WCAG AA where applicable; keyboard navigable; ARIA roles assigned.

- Component Behavior
  - Buttons and interactive elements have 44x44px touch targets.
  - Micro-interactions: fade/slide for tooltips, subtle elevation on hover.

---

Visual Style

### Color Palette:
- Primary background: #F8F9FB
- Sidebar background: #FFFFFF
- Accent color: #4998F3
- Text primary: #151A29
- Text secondary: #8A8F98
- Positive accent: #3AC569
- Negative accent: #F44336
- Chart lines: #FFA86A, #7CB8F7
- Border/Divider: #E5E7EB
- Muted icon: #EDEDED
- Hover/active overlay: #E9F3FE

### Typography & Layout:
- Font family: Inter / Poppins (rounded geometric sans-serif)
- Weights: 400 body, 600 headings
- Spacing: padding 24–32px, gaps 16px
- Alignment: left-aligned content, vertical centering within cards

### Key Design Elements
Card Design:
- Rounded 16px, white background, soft shadow, thin border or none, hover lift.

Navigation:
- Vertical left sidebar, icon+text, active highlight, static visibility, secondary at bottom.

Data Visualization:
- Smooth thin lines, small points, dark tooltips (#12223E), minimal axes.

Interactive Elements:
- Pill buttons (#4998F3), rounded inputs, clear focus states, micro-interactions.

Design Philosophy:
- Minimal, professional, data-forward, reduce cognitive load, emphasize clarity and trust.

---

Implementation Notes:
- Enforce consistent application of the design system across all components and pages.
- After every development step, verify adherence to this blueprint (pages, features, user journeys, UI guide, and visual style).
- Focus on building safety/guardrails for AI features, tenant isolation, and auditing for compliance.

Instructions to AI Development Tool:
- At completion of each development task, run a checklist:
  - Page/feature implemented matches "Pages" and "Features" sections.
  - UI components match the UI Guide styles and color tokens exactly.
  - Security controls (RBAC, encryption, token scopes) validated.
  - Integrations (LLM, Git providers, QuickBooks, e-sign) tested with sandbox keys and webhook handlers.
  - Monitoring/alerts configured (Sentry/Datadog) and workflow engine health checks passing.
  - Documentation updated: API contracts, integration guides, admin runbook.
- Only mark tasks done when all checks pass.

This blueprint provides the full product, UX, integration, and operational detail required to design, implement, and deliver Autopilot Studio per the project context and UI style requirements.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
