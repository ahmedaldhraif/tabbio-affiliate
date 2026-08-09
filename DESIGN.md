# Tabbio Partner Design System

> Implementation note, 2026-08-09: the local frontend prototype implements this contract in `apps/tabbio-partners` using RefRef's existing `@refref/ui` primitives plus Tabbio semantic tokens. Material 3 remains the interaction and accessibility authority; Material Web is not a runtime dependency. All operational and financial states are visibly simulated.

> Status: Direction contract for the public partner page and authenticated Partner area. This file records durable design rules. It does not turn the attached SVG exports into production assets.

## 1. Authority and intent

Apply these authorities in order:

1. User approvals and `PRD.md` define product rules, scope, money, and gates.
2. `PRODUCT.md` defines durable users, purpose, positioning, and constraints.
3. This `DESIGN.md` defines the Tabbio Partner visual and interaction contract.
4. The canonical Tabbio target repository defines established auth, shell, component, brand, and implementation conventions.
5. [Material 3](https://m3.material.io/) and [Checklist Design](https://www.checklist.design/browse) define interaction behavior and coverage gates respectively.
6. [Material Web `v2.5.0`](https://github.com/material-components/material-web/tree/b4de401eb665ec63474f39319a4ba8f2145974cc) may supply selectively reusable component code, tokens, documentation, and tests after the compatibility gate.
7. The supplied Tabbio SVGs define visual intent and content hierarchy only.
8. RefRef UI may supply headless behavior or implementation patterns after the license gate.

The roles above are intentionally bounded. Material Web never defines Tabbio's visual identity. The SVGs never override product architecture, current M3 interaction guidance, accessibility, or truthful data. RefRef never defines Tabbio's visual direction.

Material 3 is the behavior model. Material Web is one possible implementation source. Neither is a mandate to add Material UI or a second component library. Prefer existing Tabbio primitives; adopt, wrap, or port Material Web only when the target-repository spike proves that path is accessible, maintainable, themeable, and smaller than rebuilding the same behavior.

### Material Web implementation source

The pinned release is Apache-2.0, framework-neutral Web Components built with Lit. The upstream README and roadmap still state that Material Web is in maintenance mode and has no planned new component work. A recent release does not create a dependable future roadmap. Production use therefore requires a Tabbio-owned adapter boundary, pinned version, dependency monitoring, and an exit plan.

| Partner need                                                                                                 | Material Web source value                                | Tabbio decision                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Buttons, icon buttons, checkboxes, radios, switches                                                          | Strong stable primitive candidate                        | Reuse or wrap only if it matches the target stack, forms, focus behavior, and brand tokens                                       |
| Text fields, selects, sliders                                                                                | Strong stable primitive candidate                        | Spike validation, error announcement, autofill, mobile keyboard, RTL, and framework event integration                            |
| Dialog, menu, list, tabs, chips, divider                                                                     | Useful stable mechanics                                  | Wrap behind Tabbio APIs and test focus return, escape, outside click, overflow, and RTL                                          |
| Progress, focus ring, ripple, elevation                                                                      | Pattern/token source                                     | Use only when it improves feedback; reduced motion and contrast still follow this file                                           |
| Cards, badges, expressive controls                                                                           | Labs/reference only in `v2.5.0`                          | Do not ship `labs/*` as a production runtime dependency; build or port the approved behavior behind maintained Tabbio components |
| Navigation bar, navigation rail, search, snackbar, tooltip, date/time picker, autocomplete, segmented button | Not delivered as stable components on the pinned roadmap | Build with canonical Tabbio primitives and current M3 behavior                                                                   |
| Data tables, charts, earnings cards, estimator, file/resource rows                                           | Not supplied as stable product components                | Build semantically for Tabbio using the contracts below                                                                          |

Import individual components rather than `@material/web/all.js` in production. Map Material CSS custom properties into Tabbio semantic tokens instead of styling screens with raw `--md-*` values. Do not use the library's Roboto example as a brand decision; Tabbio remains Inter for English and Cairo for Arabic. Record Apache-2.0 attribution and any modified upstream files in the dependency/provenance inventory.

The pinned docs list browser floors of Chrome/Edge 120+, Firefox 119+, and Safari 16.4+, with an `ElementInternals` polyfill potentially needed for older Safari. These are upstream support claims, not Tabbio's browser decision. The compatibility spike must compare them to Tabbio's real support matrix. Material Web text fields do not support `aria-labelledby`; if adopted, use their visible internal label and independently verify descriptions, errors, and announcements.

## 2. Direction contract

**THESIS:** Useful work compounds. The public page makes recurring commission understandable by showing the stack grow, while the product area makes each source event and money state inspectable. It refuses the generic affiliate pattern of hype, leaderboard gamification, and unexplained totals.

**OWN WORLD:** Bright, quiet operating surfaces use Tabbio violet as the only regular action accent. A violet-to-pink earning gradient is reserved for the calculator, the primary earning total, and the strongest CTA. Thin neutral borders, large clear type, sparse line icons, and generous white space carry the rest.

**STORY:** A visitor understands what qualifies, estimates a non-guaranteed outcome, sees three real Tabbio-native ways to earn, and applies. A partner sees the next useful task, shares or creates work, follows attribution, and reconciles every amount.

**FIRST VIEWPORT:** The public page pairs “Your work keeps paying” and one primary join action with a live, labelled earnings estimator. The authenticated area opens on one earnings focal card, three operational metrics, and one next task, never a wall of equal cards.

**FORM:** Public surfaces are Persuade; authenticated surfaces are Operate. The supplied composition is the pinned direction. Rebuild it semantically and adaptively without running a replacement-style exercise.

## 3. Visual foundations

### Color strategy

Use a committed brand treatment on the public first viewport and a restrained treatment inside the app.

| Semantic token          |      Provisional value | Use                                                          |
| ----------------------- | ---------------------: | ------------------------------------------------------------ |
| `brand.primary`         |              `#5A2AFF` | Primary actions, active navigation, links, focus accents     |
| `brand.primaryStrong`   |              `#512EFF` | Pressed/strong brand state after contrast verification       |
| `brand.heroField`       | `#5F9FF4` to `#7968EE` | Public blue-violet textured hero field                       |
| `brand.earningGradient` | `#5A2AFF` to `#FE97E9` | Calculator result, one earnings focal surface, strongest CTA |
| `text.strong`           |              `#2B2B2B` | Primary copy and important values                            |
| `text.default`          |              `#4A4A4D` | Body copy and table values                                   |
| `text.muted`            |              `#6B7280` | Supporting copy that still passes contrast                   |
| `surface.canvas`        |              `#F9FBFA` | App background                                               |
| `surface.default`       |              `#FFFFFF` | Primary working surface                                      |
| `surface.subtle`        |              `#F3F4F6` | Grouped rows and quiet controls                              |
| `border.default`        |              `#E5E7EB` | Dividers, fields, and containers                             |
| `status.success`        |              `#3F996A` | Success only with text/icon                                  |
| `status.warning`        |              `#FBBA4A` | Warning only with text/icon                                  |
| `status.error`          |                    TBD | Derive an AA-compliant error pair before implementation      |

The values above were extracted from the SVG exports and are provisional. Consolidate near-duplicate grays in code, generate hover/pressed/container roles from semantic tokens, and verify every foreground/background pair. Pink is not a general-purpose second accent. Gradients never carry status.

### Typography

- Inter is the supplied English UI typeface.
- Cairo is the supplied Arabic UI typeface.
- Confirm font files, weights, language coverage, and licenses in the target repository before bundling them.
- Use tabular numerals for money, percentages, dates, and dashboard metrics.
- Use sentence case. Avoid all-caps utility labels except where the canonical Tabbio system already requires them.

| Role       | Desktop guidance        | Compact guidance        | Use                             |
| ---------- | ----------------------- | ----------------------- | ------------------------------- |
| Display    | 52 to 64 / 1.05 to 1.12 | 40 to 48 / 1.08 to 1.15 | Public first-view claim only    |
| Headline   | 32 to 40 / 1.15 to 1.25 | 28 to 34 / 1.18 to 1.28 | Page and major section headings |
| Title      | 20 to 24 / 1.25 to 1.35 | 18 to 22 / 1.25 to 1.4  | Cards, dialogs, major values    |
| Body       | 16 / 1.5                | 16 / 1.5                | Primary reading copy            |
| Body small | 14 / 1.45               | 14 / 1.45               | Dense product copy and tables   |
| Label      | 13 to 14 / 1.3          | 14 / 1.35               | Controls, chips, and metadata   |

Do not shrink financial explanations below the small-body role. Public long-form copy should remain comfortable at 200% zoom.

### Spacing, shape, and elevation

- Use a 4px base with named steps `4, 8, 12, 16, 24, 32, 48, 64, 96`.
- Keep more space above a heading than below it. Dense data passages must be followed by quieter space.
- Minimum interactive target: 48 by 48 CSS px for touch-first controls and at least 44 by 44 CSS px for pointer controls, with about 8px separation.
- Use 8px radii for compact controls, 12px for normal fields/rows, 16px for grouped surfaces, and 24px only for public or focal containers.
- Pills are reserved for statuses, segmented controls, compact filters, and the designer's primary CTA. Do not make every container a pill.
- Prefer borders and tonal separation over shadows. Use one quiet elevation level for menus, popovers, dialogs, and sticky overlays.

### Icons and imagery

- The geometric violet Tabbio `t` path extracted from the supplied designer SVG is the canonical prototype mark. Do not substitute a sparkle, generic app glyph, rounded-square badge, or invented logo treatment.
- Use one outlined icon family already present in Tabbio. Every interactive icon has an accessible name and a visible tooltip on hover and focus where its label is otherwise absent.
- The public textured hero can be rebuilt as an optimized responsive asset or CSS/canvas treatment after performance testing. It must not reduce text contrast.
- The SVG screenshots are not shippable UI. Do not embed them as page images, crop their outlined text, or extract inaccessible controls from them.
- Real partner examples, customer photos, earnings, permits, badges, or provider logos require verified source material and permission. Label synthetic examples.

## 4. Adaptive layout and navigation

Use the current Material 3 window classes:

| Class       |         Width | Partner behavior                                                                                                                                                                                                                                              |
| ----------- | ------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compact     |      `<600px` | One pane. The main shell owns its one flexible navigation bar. Partner-local destinations use a labelled page-level section control or tabs/More pattern without adding a second bar. Tables become complete summary rows/list-detail.                        |
| Medium      |   `600-839px` | One pane by default. The main shell owns the sole bar or collapsed rail; Partner-local navigation stays in the content header unless the shell can render it inside the same navigation component.                                                            |
| Expanded    |  `840-1199px` | The main shell uses its collapsed or expanded rail. Partner-local destinations may nest inside that rail only if the canonical shell supports sections; otherwise use one content-level section control. List-detail is allowed where it improves inspection. |
| Large       | `1200-1599px` | The main shell uses its expanded rail and content may use up to two working panes. Keep line lengths and dense tables bounded.                                                                                                                                |
| Extra large |     `1600px+` | Up to three panes only when the third pane has a real job such as contextual payout evidence. Never stretch content across the entire viewport.                                                                                                               |

Current Material 3 guidance favors flexible navigation bars and collapsed/expanded rails over the legacy drawer pattern. Never show a navigation rail and bottom bar at the same time, and never stack a Partner rail beside an existing product rail.

The main Tabbio shell owns primary product navigation. Add one primary destination named `Partner`. Within Partner, use one route-aware local section control for Overview, Clients, Create, Links, Earnings, Resources, and Settings. It may render inside the existing shell rail when that shell supports grouped destinations; otherwise it renders in the content header as accessible tabs plus More or a labelled menu/select. It never creates a competing persistent navigation surface. Preserve the user's context when switching routes.

On compact screens, prioritize Overview, Create, Links, and Earnings. Put Clients, Resources, and Settings behind More. Every destination remains at most two actions from the Partner entry point.

## 5. Component contracts

### Buttons and actions

- Prefer one high-emphasis filled action per page. Use specific verbs: `Become a partner`, `Create link`, `Copy link`, `Create CV`, `Save changes`, `View payout`.
- A secondary outlined or tonal action may sit beside it. Tertiary actions are text links or menu items.
- Never use `OK`, `Submit`, or an unlabeled arrow where the result is more specific.
- Loading preserves the button width, prevents duplicate submission, and exposes progress text to assistive technology.
- Destructive actions use the error role and require an explicit consequence. A dialog is reserved for high-risk or irreversible actions.

### Text fields, selects, and forms

- Every field has a persistent visible label. Placeholder text is an example, never the label.
- Supporting text explains purpose or format. On error, it becomes a corrective message without moving unrelated content.
- Required and optional conventions are consistent across the product.
- Validate on blur and submit. Do not interrupt normal typing with premature errors.
- Error states use text plus an icon or second cue, are programmatically associated with the field, and are announced.
- Preserve entered data on recoverable errors. Show a clear success state after save.
- Long onboarding work auto-saves locally or server-side and tells the user when it last saved.

### Estimator and sliders

- Each slider has a visible label, current value, minimum, maximum, step, and paired numeric input.
- Keyboard arrows, Page Up/Down, Home, and End work where the chosen primitive supports them.
- Recalculate from live plan data and state assumptions beside the result.
- Label the output `Estimated commission`, not `earnings` or `guaranteed income`.
- Announce the result only after the user pauses or leaves a control to avoid screen-reader noise.

### Navigation and wayfinding

- Active destinations use label, icon, and selected container, not color alone.
- Labels stay visible and do not silently truncate.
- Include a skip link, semantic landmarks, one meaningful H1, and sequential heading levels.
- Keep DOM and focus order aligned with the visual order at every breakpoint.

### Metrics, charts, and money

- Every metric names its time range and scope. A tooltip or linked definition explains the calculation.
- Money uses ISO currency, locale formatting, and a textual status. Negative entries include a minus sign and a reason.
- Charts require a title, axes/units where relevant, a text summary, and an accessible data table or list.
- Do not animate from zero in a way that temporarily displays a false balance.
- Dashboard totals must reconcile from the immutable ledger: positive accrual entries plus pre-payout reversals plus post-payout negative recovery entries. Pending, held, payable, scheduled, paid history, and current negative balance must be shown without changing the state of an already paid entry.

### Tables and lists

Material 3 does not currently define a data-table component. Use semantic HTML and Checklist Design coverage.

- Provide a caption or adjacent heading, header cells, row differentiation, consistent alignment, search, sort/filter where useful, pagination for large sets, and labelled row actions.
- Numeric columns align consistently and use tabular numerals.
- Status is full text with icon/shape, never a colored dot alone.
- On compact screens, use complete summary rows with an explicit `View details` action. Do not hide columns that contain the only copy of critical data.
- Distinguish first-use empty, filtered no-results, permission-limited, load-error, and end-of-list states.

### Feedback and states

- Under 200ms: no loader. From 200ms to 5s: a local loading indicator or layout-matched skeleton. Over 5s: labelled progress with honest determinate progress when known.
- Snackbars are non-blocking and appear one at a time. Important web confirmations also remain inline or persistent; do not rely on a disappearing message.
- Dialogs contain one task and no more than two actions, trap focus, and return focus to the trigger.
- Banners communicate persistent account, compliance, provider, or payout states. Critical banners cannot be dismissed until resolved.
- Every screen specifies loading, first-use empty, no-results, error, offline/retry, success, permission, suspended, and realistic overflow states as applicable.

### FAQ accordion

- The question is the full clickable header. Use a clear expand/collapse icon and expose the state programmatically.
- Keyboard focus is visible. Multiple answers may remain open so users can compare program rules.
- Put contact/support after the FAQ when an answer does not resolve the issue.

## 6. Surface specifications

### Public `/partners`

1. Header: existing Tabbio marketing navigation, language switch, sign-in, and `Become a partner`.
2. First viewport: `Your work keeps paying`, one plain-language sentence, one join action, one `Preview Partner App` action, and the live estimator. The estimator appears once.
3. Audience paths: three visually committed surfaces name career coaches and CV writers, UGC creators, and recruiters or agencies before listing shared program facts. Each surface shows useful work, the tracked handoff, and the eligible subscription outcome.
4. Product proof: one large preview uses the actual Partner app structure, navigation, metrics, task choices, and ledger language with labelled deterministic sample data. Never fabricate partner work, testimonials, or earnings.
5. Application: one embedded split surface pairs the Tabbio color field with a visible-label M3-style form. Ask for one primary lane, adapt the work prompt to that lane, preserve the draft locally, focus the first error, and show a persistent success state with an explicit demo-app entrance.
6. Review path: Apply, human review, then access to links, resources, and dashboard. Do not promise instant approval while review infrastructure is absent.
7. FAQ: eligibility, commission definition, attribution, payout, permit, CV styles, leaving, suspension/removal, privacy, and support.
8. Footer: terms, privacy, program terms, disclosure guidance, accessibility, and contact.

The conversion order above is informed by the Higgsfield creator partnership page, not its visual identity. Tabbio retains its supplied blue-violet system, geometric mark, product workflows, copy, and evidence standard.

### Authenticated Partner area

- **Overview:** one earnings focal card, clicks, attributed signups, paying customers, one next task, an accessible trend, and recent ledger activity.
- **Clients:** search, create CV, style/status filters, semantic results, claim-link state, last edit, and explicit row action.
- **Create:** Script/Post/Article selection, prompt, optional settings, generated draft, editor, disclosure insertion, save/history, and explicit export/copy. No automatic publishing.
- **Links:** main link and QR, create tracked link, channel/campaign/destination fields, archive, scoped metrics, and consistent conversion definitions.
- **Earnings:** balance definitions, ledger, filters, payout history/detail, statement download, provider state, disputes, and support.
- **Resources:** versioned brand kit, approved copy, correct partner disclosure, promotion rules, writing/playbook resources, and file metadata.
- **Settings:** public profile, lane, language, notifications, agreement version, compliance checks, payout account, security handoff, and deactivate/leave flow.

### Admin and finance

Admin surfaces inherit the same Operate system but prioritize dense inspection. Use list-detail for applications, partners, attribution disputes, fraud cases, commission entries, and payout batches. Every override shows source evidence, reason, actor, timestamp, and the resulting reversal/replacement entry.

## 7. Content and localization

- Use direct human copy. Avoid generic claims such as `supercharge`, `unlock`, `seamless`, or `revolutionize`.
- Do not use em dashes in customer-facing copy.
- Distinguish `signups`, `attributed customers`, `paying customers`, `paid invoices`, and `commission entries`.
- Explain why an item is pending and what happens next. Never show `Verified` while an external check is only submitted.
- Store copy and resource versions so a partner can see which agreement, disclosure, or promotion rule applied at a given time.
- English and Arabic layouts must be content-driven, not mirrored screenshots. Icons with directional meaning mirror in RTL; brand marks and numeric data do not.
- Dates, currencies, pluralization, names, and phone numbers use locale-aware formatting. Legal copy receives professional translation and review.

## 8. Motion

- The signature public motion is the estimator stack updating as inputs change. Use a short 180 to 240ms transform/opacity transition and preserve the exact numeric result.
- In-product motion communicates continuity: row insertion, status change, panel transition, or copy confirmation. It never delays work.
- Avoid scroll-jacking, parallax that moves text, infinite decorative motion, and celebratory animation for money that is only pending.
- Respect `prefers-reduced-motion`; remove nonessential movement and use instant state changes with the same feedback.

## 9. Accessibility release floor

- WCAG 2.2 AA automated and manual testing is required.
- Contrast: 4.5:1 for normal text and 3:1 for large text, meaningful graphics, focus, and control boundaries.
- All routes work by keyboard alone. Test Tab, Shift+Tab, arrows, Enter, Space, Escape, and focus return after overlays.
- Test one current screen reader on Windows and one on a mobile platform for onboarding, link creation, earnings inspection, and payout-account change.
- Test 200% text zoom and 400% browser zoom/reflow without loss of information or horizontal page scrolling, except within intentionally scrollable data regions.
- Status, error, progress, copy confirmation, and asynchronous updates are announced through appropriate live regions.
- Step-up authentication is required before changing payout destination, tax details, primary email, password, or 2FA.

## 10. Checklist Design completion gate

Before a surface is accepted, map its implementation to the relevant Checklist Design entries and record pass, fail, not applicable, owner, and evidence URL or screenshot.

Required component coverage:

- Navigation, button, input field, select/radio, slider, search, table, tabs/segmented controls, accordion, banner, toast/snackbar, dialog, tooltip, loading, skeleton, and empty state.

Required flow coverage:

- Onboarding, verifying an account/check, submitting a form, showing input error, saving changes, filtering data, connecting a payout account, resetting credentials through the main Tabbio auth flow, contacting support, and leaving/deactivating the program.

Checklist Design does not replace WCAG, security, privacy, performance, financial reconciliation, migration, rollback, or provider testing.

## 11. Known corrections to the supplied exports

- Replace impossible sample totals and analytics with one coherent, labelled example dataset.
- Give Overview and Links an explicit period and metric definition.
- Never show more customers than clicks for the same link and scope.
- Replace the duplicated `Partner disclosure` text with approved disclosure copy.
- Replace repeated promotion-rule helper text with rule-specific guidance.
- Correct `quiet`, `turn a PDF CV into one live link`, and other copy defects before implementation.
- Replace colored-dot-only CV statuses with distinct labels and meanings.
- Use one consistent example identity per scenario and mark all examples.
- Add missing actions for Create CV, Create tracked link, payout details, notification settings, and public-page preview.
- Resolve the holdback rounding example and every financial definition in `PRD.md` before rendering real values.

## 12. Public landing implementation decision

The 2026-08-09 landing revision treats the supplied 1512px SVG composition as the visual authority while following the user's later instruction to remove repetition and reduce copy.

- `/partners` is the only indexable landing route. `/` redirects to it so the same page is not published twice.
- The supplied composition repeats the estimator once as a compact calculation proof. Both instances share the same state so the repetition demonstrates the stack without conflicting totals.
- Visible copy is limited to one offer sentence, four short steps, three earning paths, four toolkit items, six concise questions, and one final action.
- Visual explanation takes priority: the split estimator, compact calculation proof, CV claim card, generous card whitespace, numbered steps, and oversized footer wordmark carry the story.
- SEO is implemented through the title, description, canonical URL, semantic headings, concise first paragraph, FAQ JSON-LD, robots, sitemap, and `llms.txt`. It must not add keyword filler or duplicate visible sections.
- The public design uses the supplied geometric Tabbio mark, blue-violet grain field, neutral surfaces, compact Inter typography, and one violet-to-pink earning gradient.
