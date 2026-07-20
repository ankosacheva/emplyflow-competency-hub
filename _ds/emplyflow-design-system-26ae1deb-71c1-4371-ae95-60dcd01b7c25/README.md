# EmplyFlow / ЭмплиФлоу — Design System

> A rapid-AI HR-tech brand for Performance & Assessment in the Russian market.

EmplyFlow (Russian transliteration: **ЭмплиФлоу**) is an HRM platform built around AI-driven employee evaluation, goal-setting, and motivation. The product targets medium- and large-sized businesses, with a stated economic payback of >35 млн ₽/yr per customer and >500 млн ₽ in automation savings across its first ~5 customers (Ростелеком, Транспортные инновации Москвы, Yandex Cloud, novadial, GdeTech).

The brand voice is **intelligent, smart, friendly, involving** — confident in technology while warm and approachable. Visually it blends a deep navy "night-mode" base with bright pastel tiles (mint, pink, periwinkle, peach) and a single saturated indigo as the primary CTA. The supporting illustration vocabulary is a mix of glassy 3D iridescent objects (arrows, sparkles) and hand-drawn dashed-marker accents — that combination is the brand's signature.

## Source materials

This system was synthesised from:

- The official site palette (`assets/palette.svg`) — 10 named brand colors.
- The brand logo (`assets/logo.png`) — hand-painted brush script wordmark.
- Live screenshots of `emplyflow.ru` (`assets/screenshots/*.png`) — hero, customers, modules, stats, implementation grid, footer.
- Inspiration reference: [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) (the `design-md/x.ai/` subtree was attached for tonal reference around modern AI-tech aesthetics). To go deeper, explore that repository directly — it's a useful library of marketing-page design notes from other AI brands.

No public codebase or Figma was attached — this system is built from the marketing site alone. **Where component implementations are inferred rather than lifted from source, that is called out in the relevant files.** Please attach the EmplyFlow product codebase or Figma if you want pixel-level UI-kit accuracy for in-product surfaces.

## Index

```
EmplyFlow Design System/
├─ README.md                  ← you are here
├─ SKILL.md                   ← portable skill manifest (Claude Code compatible)
├─ colors_and_type.css        ← all tokens: colors, type, spacing, radii, shadows
├─ assets/
│   ├─ logo.png               ← brush-script wordmark
│   ├─ palette.svg            ← named-swatch source of truth
│   └─ screenshots/           ← reference screenshots from emplyflow.ru
├─ preview/                   ← design-system cards (registered for the DS tab)
│   ├─ colors-*.html
│   ├─ type-*.html
│   ├─ spacing-*.html
│   └─ components-*.html
└─ ui_kits/
    └─ website/
        ├─ README.md
        ├─ index.html         ← full landing-page recreation
        └─ *.jsx              ← Nav, Hero, StatTile, ModuleCard, Footer, Button, Sparkle, etc.
```

---

## CONTENT FUNDAMENTALS

### Language & tone

- **Russian first**, with English tech terms freely interleaved when industry-standard: *Performance Review*, *HiPo*, *KPI*, *AI* (or its Russian abbreviation *ИИ*), *HRM-платформа*.
- **Formal second-person** ("Вы" implied via verb conjugation: *Узнайте, Используйте, Сократите, Получите*). Direct, encouraging, never colloquial.
- **Imperative-led hero copy.** Most hero lines start with an action: *"Сократите время на рутинные задачи..."*, *"Сделайте процессы прозрачными и управляемыми"*. The user is the protagonist; the platform is the tool.
- **Quantified specificity.** Numbers are always concrete and load-bearing: *"Экономия более 1000 часов команды по персоналу в год"*, *">35 млн ₽ — окупаемость"*, *"Повышение... на 10–15%"*. Round numbers in bold display sizes; the unit (млн ₽, в год) sits in a small pill or caption nearby.
- **Casing:** sentence case for body and most headings. Russian section names in Title case follow Cyrillic norms (only the first word capitalised — *"Анализ потенциала"*, *"Оценка результатов"*).
- **No emoji.** None in product copy, none in marketing. Sparkle motifs are illustrated, not unicode.

### Vibe & rhythm

- **Smart but warm.** The product is "AI-powered" but the copy never leans techno-cold. It pairs "ИИ" with words like *"мотивация"*, *"вовлечённость"*, *"удержание ценных специалистов"*.
- **Confidence without hype.** No exclamation marks in headlines. Exclamation appears once in the supporting paragraph ("Используйте возможности нашего решения!") — sparingly, as enthusiasm rather than shouting.
- **Pair every claim with a benefit.** A feature is never named without an outcome attached: *"Автосоздание матрицы потенциала — Удобная визуализация сотрудников для наглядного восприятия и работы с разными группами (HiPo, низкоэффективные, будущие звёзды, ключевые игроки)"*.

### Specific example openings

| Section          | Pattern                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Hero             | *"HRM-платформа для оценки, целеполагания и мотивации сотрудников **на базе ИИ**"* (pink-dashed callout on the AI mention)  |
| Sub-headline     | Question → solution: *"Хотите выстроить прозрачные процессы...? Используйте возможности нашего решения!"* |
| CTA              | Two flavors: orange-pill *"Получить доступ"* (header) + indigo-pill *"Получить демодоступ к платформе"* (body) |
| Module title     | Noun phrase: *"Анализ эффективности сотрудников и команд"*                                            |
| Stat headline    | Display number alone, unit in a separate small capsule: *">35"* + *"млн ₽"*                          |
| Footer slogan    | *"Сделайте процессы прозрачными и управляемыми"*                                                      |

---

## VISUAL FOUNDATIONS

### Color usage

- **Base canvas is always Black Rock** (`#050230`). The whole brand reads as a deep-navy night sky. Cards float on top of it.
- **Tile system.** Content cards are filled with one of five tile colors: Periwinkle, Frosted Mint, Cotton Candy, Macaroni-and-Cheese, or saturated Blue Ribbon. Each card carries dark text (Cod Gray) against its pastel — or white text against Blue Ribbon. **Adjacent tiles never repeat colors.** Cards rotate through the palette to create rhythm.
- **Cotton Candy is the spotlight.** Used for the dashed-stroke callout around "на базе ИИ", for one-word highlights in headlines, and for the pink card in stat grids. It signals *the AI thing*.
- **Macaroni-and-Cheese (orange) is the CTA.** Used for the primary header button only. The body CTA switches to saturated Blue Ribbon. This creates a deliberate two-tier action hierarchy.
- **Frosted Mint** highlights the brand name itself when it appears at display size.
- No gradients across the whole page — the dark base is *almost* flat but carries a very subtle radial purple-violet bloom toward the top-left.

### Typography

- **Manrope** is the official EmplyFlow type family — a modern wide-grotesque with strong Cyrillic coverage. The full weight set (200–800) ships locally in `fonts/Manrope-*.ttf` and is wired via `@font-face` in `colors_and_type.css`. No web-font fetch required.
- The wordmark uses a hand-painted brush script (`assets/logo.png`). Never recreated typographically — always used as the supplied image asset.
- Hero display sizes are extreme (up to 128px). Letter-spacing is tightened (-0.02 to -0.03em) at display size, neutral at body size.
- Mixed-color phrases within one headline: a noun fragment in pink/mint, the rest white. Example: *"**Сократите время** на рутинные задачи..."* (pink + white).

### Spacing, layout, rhythm

- **Generous outer margins, tight inner content.** Hero blocks breathe; card grids tile tightly.
- **No fixed grid columns** — sections are bespoke layouts. Stat tiles vary in size to create visual hierarchy (one big, two medium, one small).
- **Cards are large.** Minimum 400px tall on desktop. They feel like billboards, not list items.

### Corners

- **Radius `28–40px` on cards.** Big and friendly.
- **Pills** for buttons and tag chips (`border-radius: 999px`).
- **Soft 14px** on internal inputs.

### Borders, shadows, elevation

- **Borders are rare.** Cards rely on fill-on-dark contrast, not strokes.
- One distinctive border treatment exists: **dashed pink marker outlines** around AI-related callouts and select module sub-features. Roughly 2px stroke, dash 8px, gap 6px, color Cotton Candy. Looks deliberately hand-drawn.
- **Shadows are subtle.** A single soft drop (`0 24px 60px -20px rgba(5,2,48,0.55)`) lifts white-on-dark cards. Pastel-on-dark cards usually need none.
- **Glow accents** (large-radius colored blurs) appear behind sparkle illustrations only.

### Backgrounds

- **No imagery in section backgrounds.** The dark canvas is sometimes punctuated by a very faint radial bloom (top-left, indigo).
- **Hand-drawn arrow strokes** appear as outlined scribble illustrations in the negative space — soft purple, low contrast. They feel like a marker doodle.
- **Glassy 3D iridescent objects** (an arrow, four-point stars) are scattered into the hero. These read as decorative chrome — never functional.
- One **portrait photograph** is used inside the stat-tile grid (a young person in soft warm pink lighting). Photographic style: warm key light, pastel backdrop, candid expression, mid-saturation, no grain.

### Animation & interaction

- **Motion is restrained.** Element fades on scroll, slow subtle drifts on illustrations. No bouncy springs.
- **Hover on buttons:** brightness lifts about 6%, scale stays at 1.0.
- **Hover on cards:** slight Y-lift (translateY(-2px)) plus shadow gain. No tilt.
- **Press states:** quick scale down to 0.98 with a `120ms` ease-out.
- **Easing:** prefer `cubic-bezier(.2,.7,.2,1)` (`--ease-out`) — a calm decel.

### Transparency & blur

- **Glass panels** (e.g. the "Лучший проект Rusbase 2024" card) use `rgba(217,214,255,0.06)` with `backdrop-filter: blur(20px)` and a 1px `rgba(217,214,255,0.22)` border.
- Used sparingly — one or two glass surfaces per page.

### Imagery style

- **Warm pastel portraits**, candid expressions, soft studio light. Never corporate-stock.
- **Iridescent chrome 3D renders** as accents (arrow, sparkles, stars). Strong specular highlights.
- **No flat illustration**. No isometric drawings. No emoji.

### Layout rules

- Sticky top nav with a frosted-glass treatment.
- Footer compresses to a wide three-region grid: contact email left, legal info right, brand wordmark large bottom-right.
- All section sub-paragraphs are constrained to ~ 540px width for readability.

---

## ICONOGRAPHY

EmplyFlow's marketing site uses **very little iconography** by design. The few icons that appear are:

- **Diagonal arrow ↗ ("arrow up-right")** — used on every navigable tile in the implementation grid and on the small play-state button in the hero CTA. Solid black, 24–32px, no padding. Always indicates "go deeper / open this thing".
- **Tiny line icons** (clock for "automatic", "AI" badge, star for "key player") inside module descriptions — these are minimal stroked SVG, 16–18px, monochrome to whatever-color-the-text-is. Stroke weight ~1.75–2px.
- **Sparkle (four-point star)** — appears in two flavors: (1) **flat solid** pink/lavender, scattered as decoration inside the colorful tiles; (2) **3D iridescent chrome render**, used larger in the hero as a brand mascot-like accent.

### What is NOT used

- **No emoji anywhere.** Not in copy, not as icons.
- **No icon font** (no Material Icons, no Font Awesome).
- **No filled glyph icons.** All stroke-based.
- **No unicode chars as icons.**

### CDN substitution

Since the source repo isn't available, we substitute the inline arrow + clock + AI sparkle from **[Lucide Icons](https://lucide.dev)** (`lucide-static@latest` via unpkg). Lucide's stroke weight (1.75) and rounded line-caps match EmplyFlow's icon tone closely. **Flag this as a substitution** — when the EmplyFlow repo or Figma becomes available, swap the in-product icons for the real set.

- `lucide:arrow-up-right` → tile arrow
- `lucide:clock` → "автоматически"
- `lucide:sparkles` → AI accent
- `lucide:star` → matrix highlight
- `lucide:circle-check` → checkmarks

The decorative four-point sparkle (flat fill) is custom inline SVG — see `ui_kits/website/Sparkle.jsx`. The 3D iridescent objects are **placeholder slots** in this kit; the real product uses bespoke renders. **Please supply those renders** when available; they are crucial to brand identity.

---

## Caveats & open questions

See the trailing message in chat — TLDR: this system is built from the public marketing site only. The product (in-app) UI, the source codebase, and Figma sources are not yet available. Once they're attached, expect a meaningful refinement pass on the UI kit and iconography.
