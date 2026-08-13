---
name: nubcoders
description: A full-stack developer portfolio that runs like the infrastructure it ships.
colors:
  console-bg: "#0d1117"
  surface: "#161a20"
  surface-raised: "#1c2430"
  ink: "#ffffff"
  ink-muted: "rgba(255, 255, 255, 0.6)"
  hairline: "rgba(93, 106, 129, 0.2)"
  signal-violet: "#8750fd"
  signal-indigo: "#3735f1"
  signal-teal: "#2ec594"
  violet-hover: "#9d6bff"
  violet-dim: "rgba(135, 80, 253, 0.5)"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(3rem, 9vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(1.875rem, 4.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  lg: "6px"
  xl: "20px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  section: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-violet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.9rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.violet-hover}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.9rem 2rem"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1rem"
  input-field-focus:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1rem"
  pill:
    backgroundColor: "{colors.console-bg}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.xs}"
    padding: "0.35rem 0.75rem"
  code-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    size: "2rem"
---

# Design System: nubcoders

## Overview

**Creative North Star: "The Running System"**

This portfolio doesn't describe infrastructure — it behaves like it. The organizing idea is that every surface reads as a live readout of something that is actually up: a terminal deploy prompt with a blinking cursor, a pulsing "live" status ring, a request/response packet pinging between a client node and a server node, an envelope that breathes. The design's job is to make one claim self-evident before a word is read — *this developer ships real, self-hosted systems, not demos* — so the motifs are instruments, not ornaments. When a new screen is designed for this system, the test is: does this element read like a gauge on a running board, or like decoration bolted onto one?

The material is a GitHub-dark console: a near-black `#0d1117` field, faintly grained, with white type and monospace instrumentation labels. Density is calm and generous — wide gutters, a 1200px measure, sections that breathe — so that the one saturated element on the board, the violet→indigo→teal **Signal Gradient**, always reads as the live signal. Restraint is load-bearing here: the palette is disciplined specifically so the gradient can carry meaning wherever it appears (the logo, the primary button, an accent bar loading like a meter). Two typefaces only — Archivo for structure and voice, JetBrains Mono for the instrumentation layer — paired on a real contrast axis, never two similar sans.

This system explicitly rejects the generic AI developer-portfolio template it could so easily have become: it is not a purple-gradient-on-dark card wall with numbered section eyebrows and a reflex sans pairing. The numbers on the project rows are a real, ordered sequence (001–004), not scaffolding on every heading. Motion is confirmation, never flourish — each project has its *own* signature entrance and ambient loop tied to what that project *does*, rather than one uniform reveal applied everywhere. Effects that would perform instead of communicate are out.

**Key Characteristics:**
- A dark console surface (`#0d1117`) where a single violet→teal Signal Gradient is the only saturated voice.
- Instrument-grade components: hairline borders, tight radii, accent only on state, motion that confirms.
- Per-project signature motifs (terminal, mail, audio, download) — the identity is the through-line, never a repeated card.
- Two-family type system: Archivo (display + body) over JetBrains Mono (labels + code), paired on contrast.
- Production-grade by construction: reduced-motion aware, keyboard-navigable, WCAG 2.1 AA.

## Colors

A disciplined dark console: three near-black surface steps, white ink at graded opacities, one hairline divider, and a single three-stop gradient that is the only saturated color on the board.

### Primary
- **Signal Violet** (`#8750fd`): The live signal at rest. Solid-fill on the primary button, focus outlines, the terminal cursor and status rings, hover borders (`--accent-dim`, `rgba(135,80,253,0.5)`), and the origin stop of the Signal Gradient. This is the color that means "interactive / live."
- **Signal Indigo** (`#3735f1`): The gradient's middle stop only — the transition between build (violet) and live (teal). Never used as a solid fill on its own.
- **Signal Teal** (`#2ec594`): The gradient's landing stop and the "green light" of the system — the live status dot, the healthy end of the accent bar. Reads as *running / up*.

### Neutral
- **Console** (`#0d1117`): The page. A near-black GitHub-dark field carrying a ~2.5%-opacity fractal-noise grain for tooth. Every other surface is measured against it.
- **Surface** (`#161a20`): Resting fill for form inputs, the code-link chips, and stat cards — one step off the console so controls read as inset.
- **Surface Raised** (`#1c2430`): The focus/active step — an input's background lifts to this on focus, pairing with the accent border as the focus cue.
- **Ink** (`#ffffff`): Primary text, headings, and active states. Full white on the console clears AAA by a wide margin.
- **Ink Muted** (`rgba(255,255,255,0.6)`): Body copy, descriptions, nav links, labels at rest. ~7.2:1 on the console — the intentional secondary voice, still AA-comfortable. Note: it is *deliberately overridden to full white* on the bright gradient focus cards, where 0.6 white would fail.
- **Hairline** (`rgba(93,106,129,0.2)`): The single border/divider token. A cool blue-gray at low opacity — structure without weight. Borders warm toward `--accent-dim` on hover.

### Named Rules
**The One Signal Rule.** The Signal Gradient (and saturated violet/teal generally) is the only saturated color on any screen, and it appears sparingly — the logo, the primary CTA, accent bars, status lights. Its rarity is what lets it *mean* "live." If a second saturated color shows up competing for attention, the board stops reading as an instrument.

**The Ink Ladder Rule.** Text is white at exactly two opacities: `#fff` for primary and `rgba(255,255,255,0.6)` for secondary. Don't introduce intermediate grays "for hierarchy." On a saturated gradient card the muted step is invalid — switch to full white, never a mid-gray.

## Typography

**Display Font:** Archivo (with `sans-serif` fallback) — an engineered grotesque, weights 400–800.
**Body Font:** Archivo — same family, lighter weights.
**Label / Mono Font:** JetBrains Mono (with `monospace` fallback) — weights 400/500.

**Character:** One workhorse grotesque carries both display and body, so the voice is consistent and structural — tight, confident, a little industrial at 800 weight. The contrast axis is grotesque-vs-monospace: JetBrains Mono is the instrumentation layer (section eyebrows, nav, pills, the terminal prompt, form labels, the copyright), and its mechanical rhythm is what makes the whole thing read as a developer's console rather than a marketing page. The two families are never confused for each other — that's the point of pairing on contrast, not similarity.

### Hierarchy
- **Display** (Archivo 800, `clamp(3rem, 9vw, 6rem)`, line-height 0.92, `-0.02em`): The hero name and the contact headline only. Ceiling is 6rem — it fills the viewport, it doesn't shout past it. `text-wrap: balance`.
- **Headline** (Archivo 700, `clamp(1.875rem, 4.5vw, 3rem)`, line-height 1.05, `-0.015em`): Section titles ("Now", "Projects"). `text-wrap: balance`.
- **Title** (Archivo 700, `1.5rem`, `-0.01em`): Project names, the 404 title. Carries an animated underline that wipes in on hover.
- **Body** (Archivo 400, `1rem`, line-height 1.7): Running copy and descriptions. Lead paragraphs step up to `1.125rem`. Descriptions cap at ~34rem measure; keep prose within 65–75ch.
- **Label** (JetBrains Mono 500, `0.75rem` / `0.6875rem` micro, `0.08–0.12em`, UPPERCASE): The instrumentation layer — nav, section eyebrows, pills, form labels, terminal text, project indices.

### Named Rules
**The Instrument Layer Rule.** If text labels, indexes, tags, or narrates the machine (nav, kickers, pills, the deploy prompt, `// comments`, the copyright), it is JetBrains Mono, uppercase, tracked. If text *speaks* (headings, prose), it is Archivo. The two never trade jobs.

**The One Sequence Rule.** Numbered markers (`001`–`004`) appear on exactly one surface — the projects list — because those projects *are* an ordered set. Numbers never become per-section scaffolding elsewhere.

## Layout

A single centered column, `max-width: 1200px`, with `4rem 2rem` section padding (tightening to `3rem 1.25rem` on mobile). Rhythm is deliberately varied rather than a fixed vertical step — section heads sit ~2.5rem above their content, cards and rows breathe at 1–2rem gaps — so the page has cadence instead of a metronome.

Two-column split grids (`1fr 1fr`) structure the About and Contact sections and collapse to a single column ≤768px. The Now grid is a fixed `repeat(3, 1fr)` of feature cards; the Tech grid uses breakpoint-free `repeat(auto-fit, minmax(220px, 1fr))`. Project rows are a three-column grid (`80px 1fr auto`: index · content · actions rail) that reflows on mobile to a two-column head with the actions rail dropping to its own full-width line — the content never gets crushed into a narrow third column. The fixed nav respects `env(safe-area-inset-*)` so it clears the notch in landscape.

## Elevation & Depth

Flat by construction. Depth comes from **tonal layering** — the three-step console→surface→surface-raised ramp and the hairline border — not from drop shadows on resting surfaces. Shadows appear only in two deliberate places: a hover lift on the Now feature cards (`0 14px 40px rgba(0,0,0,0.45)`) and a grounding shadow under the circular GitHub avatar. Dark feature cards carry an *inset* hairline (`inset 0 0 0 1px rgba(255,255,255,0.1)`) rather than an outer shadow, so they read as recessed panels on the board.

The hero is the one place depth becomes atmospheric: a full-bleed layered radial "glow" (a purple/white light pool, crossing light arcs screen-blended over it, and a vignette that fades back into the flat `#0d1117`) sits at `z-index: 0`, with all content lifted above it.

### Named Rules
**The Flat-Board Rule.** Surfaces are flat at rest; elevation is a *response to state* (hover lift, focus fill), never a decorative default. If you reach for a resting drop shadow, use a tonal step or the hairline instead.

## Shapes

Tight, functional radii — the form language is precise, not soft. The scale runs `2px` (pills, tags) → `3px` (inputs, buttons) → `4px` (principle rows, contact links, stat cards, skip link) → `6px` (nav toggle) → `999px` (the circular code-link chip and the meter-style bars). The one deliberate exception is the Now feature cards at `20px`, whose large friendly radius sets them apart as the page's one "poster" moment against an otherwise sharp system. Borders are uniformly hairline (`1px`) and full — never a side-stripe accent. Project rows drop their side/top borders entirely and use a single bottom hairline as a list divider.

## Components

Instrument-grade across the board: hairline borders, tight radii, accent reserved for state, and motion that confirms an action rather than performing. Every interactive element has a visible `:focus-visible` ring (2px Signal Violet, 2px offset).

### Buttons
- **Shape:** Slightly rounded (`3px`).
- **Primary** (`.form-btn`): Solid Signal Violet fill, white Archivo 700 text, `0.9rem 2rem` padding, full-width in the form context.
- **Hover / Focus:** Background shifts to Violet Hover (`#9d6bff`); `:active` scales to `0.98`. A `.sending` state drops opacity to 0.7 and blocks pointer events.
- **Ghost / utility:** The 404 link and code-link chips are transparent/surface-filled with a hairline border that warms to `--accent-dim` on hover.

### Chips / Pills
- **Style:** Console background, muted-ink text, hairline border, `2px` radius, `0.35rem 0.75rem` padding, JetBrains-Mono-adjacent sizing.
- **State:** Border warms to `--accent-dim` and text lifts to full ink on hover. Project tags are hidden at rest and fade up on row hover/focus — but shown unconditionally on touch (`@media (hover: none)`) so they're never gated behind a hover a phone can't do.

### Cards / Containers
- **Now feature cards:** `20px` radius, generous `2rem 1.75rem 2.25rem` padding. Alternating treatment — odd cards are a bright violet base with a 135° gradient wash plus teal (top-right) and violet (bottom-left) radial pools; even cards are a dark radial glow with an inset hairline. Odd-card body text is forced to full white for contrast on the bright fill. Hover lifts `-3px` with the ambient shadow.
- **Principle / contact rows:** Flat, hairline border, `4px` radius; border warms to `--accent-dim` and background picks up a ~3% violet tint on hover.

### Inputs / Fields
- **Style:** Surface (`#161a20`) fill, hairline border, `3px` radius, `0.85rem 1rem` padding, full-ink text.
- **Placeholder:** Muted ink at full opacity (`opacity: 1`) — never the browser's faint default, so it stays legible.
- **Focus:** Border becomes Signal Violet and the background lifts to Surface Raised (`#1c2430`) — the border+fill *is* the focus cue, so the offset outline is suppressed on fields only (it would double the border).
- **Client caps:** `maxLength` mirrors the server's limits (name 100, email 200, subject 200, message 5000) as a UX guard, not the source of truth.

### Navigation
- **Style:** Fixed, transparent at top; on scroll it gains a frosted `rgba(8,8,8,0.92)` fill, a hairline bottom border, and a `blur(12px)` backdrop (the one purposeful use of backdrop-filter). Links are JetBrains Mono, uppercase, tracked, muted→full-ink on hover, full-ink at `aria-current`.
- **Mobile (≤768px):** A hamburger toggle (its bars animating into an ✕) opens a full-screen frosted overlay. The overlay deliberately sits *below* the bar and toggle in the z-scale so both stay reachable to close it.

### Signature Project Motifs
The defining custom component: each project row carries its own identity tied to what the project *does*, not a shared template. **001 Terminal** — a monospace deploy prompt that types out on hover, a horizontal accent bar that loads left-to-right, and an ambient pulsing "live" status ring. **002 Mail** — an envelope flap that lifts in 3D with a notification ping, over a breathing envelope. **003 Audio** — musical notes rising and fading. **004 Download** — an accent bar that loops like a progress meter, over a request/response packet pinging between a client and server node. Each has a bespoke scroll-reveal entrance (`projInTerminal`, `projInMail`, …). All hover-gated motion rests in its revealed state on touch devices so identity survives without a pointer.

### Named Rules
**The Meter, Not the Sweep Rule.** Bars and reveals animate with GPU transforms (`scaleX`/`scaleY` from an origin, `translate`), easing out on `cubic-bezier(0.19, 1, 0.22, 1)` — they *load* like a meter. Never animate `width`/`height` (layout thrash), never bounce or overshoot with elastic.

## Do's and Don'ts

### Do:
- **Do** treat the Signal Gradient (`linear-gradient(45deg, #8750fd 20%, #3735f1 40%, #2ec594 90%)`) as the one saturated voice — logo, primary CTA, accent bars, scroll progress. Keep it rare.
- **Do** route every label, index, kicker, and machine-narration through JetBrains Mono uppercase; keep headings and prose in Archivo.
- **Do** give each project its own signature motif tied to what it does, and give every animation a `prefers-reduced-motion` rest state.
- **Do** force body text to full white on the bright gradient feature cards; the `rgba(255,255,255,0.6)` muted step fails there.
- **Do** convey depth with the console→surface→surface-raised tonal ramp and the hairline border; reserve shadows for hover/elevation state.
- **Do** animate with `transform`/`opacity` on ease-out curves; use `scaleX/scaleY` for bars.

### Don't:
- **Don't** add a second saturated color competing with the Signal Gradient, or spend the gradient on large fills where it stops meaning "live."
- **Don't** introduce intermediate gray text tones; ink is white at exactly two opacities (`#fff`, `0.6`).
- **Don't** put numbered markers or tracked eyebrows on every section — the `001–004` sequence lives on the projects list alone because it's a real ordered set.
- **Don't** use side-stripe borders, gradient *text*, decorative glassmorphism, or resting drop shadows — all are off-system here.
- **Don't** animate layout properties (`width`, `height`, `top`) for the bars or reveals; transform only.
- **Don't** gate content visibility behind hover alone — mirror every hover affordance for touch (`@media (hover: none)`) and keyboard focus.
