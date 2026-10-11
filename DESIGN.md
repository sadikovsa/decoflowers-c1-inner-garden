# DecoFlowers C1 — Внутренний сад

The selected reference is DecoFlowers-C-1.png, displayed choice 1. This is a Russian-language marketing site for the Tashkent interior-botanical showroom. Its job is to take a visitor from a quiet architectural portal through object, room and space to a real enquiry.

## Visual system
Runtime token owner: dist/styles.css :root.
Canvas #121715 mineral charcoal; ink #ecebe3 warm chalk; secondary ink #bbbfb1; mineral #d8cdb9; stone #b6a48d; green #354838. Cormorant is the atmospheric display, Manrope the body/utility face, both self-hosted. Spacious 1440 desktop composition and native document flow; no card-grid template. Signature: a tall central botanical doorway expands as the user approaches the room, followed by large photographic chapters.

Hero fidelity: centered portrait portal, small mid-left wordmark, upper-right Menu, lower central two-line serif sentence and low native navigation dock. Supporting chapters continue the same limestone and golden light world. Architectural scenes are illustrative, never named as actual projects. At the user’s request, public provenance notices are omitted; asset-ledger.json retains origin records. The Instagram gallery contains real brand photographs.

## Behavior
Native scrolling and anchor navigation, no wheel hijacking. GSAP ScrollTrigger scales a hollow stone frame over one underlying room, then lets that same stage scroll out into the object chapter. Visible motion pause and reduced-motion preference fully stop these transformations. All content is readable without JS. Directions are smooth native details; keyboard focus is visible. An accessible native dialog composes an editable enquiry; it does not claim to send anything. Copy, save a text file, call and open official Instagram are real actions.

## Evidence
Official Instagram decoflowersuz provides six directions, wholesale/retail and Uzbekistan delivery. Phone +998 90 019 09 01. Repeated official June–July 2026 Instagram posts confirm Ташкент, массив Аль-Хорезми-1, 9. No unverified prices, SKUs, testimonials, counts, guarantees, project names, opening hours or installation terms.

Room chapter integration: right-aligned full-scene photo preserves the architectural wall. A borderless, full-height mineral copy plane on the right guarantees readable text across portrait desktop/tablet crops; mobile uses an opaque-enough dark copy plane over the photograph.

## S1 revision — 11 October 2026

User approved a true scroll portal, smooth menu, photographic directions, a compact contact/footer and a separate real-example section. Retain the charcoal/mineral palette, Cormorant/Manrope and original composition.

- Hero and room now occupy one pinned stage: the original doorway has a transparent centre with the sole room image behind it. The frame expands beyond the viewport and the room copy appears. No crossfade or second room is used. Reverse scrolling, pause and reduced motion preserve access to the normal document. No wheel/touch interception. `html` uses native `scroll-behavior:auto`; deliberate anchors animate separately to keep ScrollTrigger refresh measurements stable.
- Menu uses a 620ms opening panel reveal and staggered text, 450ms closing panel reveal, with inert page surfaces, focus containment and restoration. Reduced motion opens/closes immediately.
- The six illustrated accordion directions use real official Instagram images and retain native details without JavaScript. Real photographs retain their natural proportions and colours.
- New `#examples` presents six official Instagram photographs in a staggered photographic gallery. Click/tap opens a full-image viewer with arrows, Escape, focus restoration and a corresponding Instagram publication link. Captions distinguish product examples and actual published settings; the courtyard is not asserted to be a commissioned client project.
- Contact has no minimum viewport height, uses a 115px maximum title, 75/65px desktop padding and smaller mobile treatment. Footer uses 20px vertical padding and the official address.
- Address: Ташкент, массив Аль-Хорезми-1, 9. Official Instagram posts of 29 June, 1 July and 4 July 2026 repeat it; brand-content.json contains permanent evidence links.
- At the user's explicit request, all AI/art-visualization notices, image-origin FAQ and Sources UI/page are removed from public `dist`. Provenance remains in asset-ledger.json/source-notes.html; generated architectural scenes remain illustrations and are not named as actual completed projects.
- Existing variants A, B, C2 and C3 are outside this revision.

## Portal composition correction

The user requested the technique used in their earlier interior project: physically remove the doorway centre and place the next-screen photograph behind it. `portal-frame.webp` is an ImageGen RGBA aperture edit with verified centre alpha=0. `.c1-stage` contains one `.c1-room` and one room image; the hero is only a foreground frame/text layer. The stage pins during entry, holds the room briefly, then moves directly into `#object`. Entrance and menu room links land at the finished room view within this same timeline. Reduced motion, pause and no-JS expose the room directly with all copy readable; no duplicate image is introduced.
