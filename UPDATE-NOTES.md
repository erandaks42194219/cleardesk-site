# ClearDesk website update notes

Updated 5 September 2026.

## Changes made

- **Version 5:** rebuilt the three plain header page links with a separate
  `nav-page-link` class. This keeps them completely outside the dropdown script,
  including when an older browser-cached script is still present.
- Added versioned CSS and JavaScript references so GitHub Pages and visitors'
  browsers request the newest design and navigation behaviour.
- Introduced a mobile quick-reading layout: long detailed sections begin with a
  concise window and a “Show full details” control, so no content is deleted.
- Converted suitable three- and four-card groups into touch-friendly swipe rails
  on phones, with snap positioning and a clear swipe cue.
- Added stronger branded graphics through gradient section markers, animated card
  icons, coloured card accents and more compact mobile spacing.
- Made the “What you can expect from every engagement” carousel advance every five
  seconds and added a visible animated progress bar.
- Simplified the mobile footer with expandable link groups.
- Removed the duplicated Call row from every footer and retained one clean
  Phone & BOTIM entry.
- Updated Eranda De Silva's direct contact details to `eranda@cleardesk.co.nz`
  and international mobile format `+64 21 087 78576` (`+642108778576` for calling).
- Fixed the desktop header navigation bug. Pricing, About and Contact are now normal
  page links; only the two menu buttons control dropdown panels.
- Added a prominent rotating announcement bar to every page, with three messages,
  a progress animation and a pause/play control.
- Added visible staggered hero entrance animations and a restrained floating motion
  for hero visuals, while respecting reduced-motion accessibility settings.
- Replaced the old static deadline strips so the new rotating bar is consistent site-wide.
- Removed remaining public-facing references to missing UAE office or local presence.
- Rechecked the normal header links, local page paths, assets, JavaScript syntax and
  duplicate page IDs before packaging version 4.
- Reworked `/about/index.html` around the ClearDesk story, values, working standards and client assurance.
- Added a persistent **Open BOTIM** button to every page. It copies `+64 20 4010 1914`, attempts to open BOTIM and falls back to BOTIM's official download page when the app is unavailable.
- Removed public-facing wording that specifically highlights the lack of a UAE office or local registration.
- Removed the dedicated overnight-support page and its navigation links. The working approach is now explained through clear scope, progress updates and traceable results.
- Replaced footer office-address blocks with a direct call contact.
- Kept the necessary e-invoicing role statement: ClearDesk implements alongside the client’s chosen accredited service provider.
- Added Eranda De Silva's formal director portrait in a navy suit, created from his supplied real photograph with identity-preserving retouching.
- Expanded the About page to explain the team's accounting, tax, operational and technology capability, including CA-qualified and specialist partner support.
- Rewrote Eranda's profile around experience across New Zealand, the UAE, Seychelles and Sri Lanka, multiple industries and modern accounting systems.
- Removed the language and IRD rows from the About page's “At a glance” section.
- Replaced the negative footer disclaimer with a company-registration, privacy and professional-collaboration statement.
- Added restrained scroll and card animation with reduced-motion accessibility support.
- Added a client-assurance carousel without invented testimonials or client names.
- Added a persistent WhatsApp contact action alongside BOTIM and the normal telephone link.
- Checked the About, Contact, Privacy and Terms paths at each folder depth.
- Renamed `CNAME` to `CNAME-FOR-LATER.txt` so the GitHub test site can be checked before the main domain is connected.

## Image approach

The website uses Eranda's supplied photograph, professionally adapted into a formal suit portrait while preserving his identity and natural features. No invented team members or stock faces were added. Clean diagrams and interface-style visuals remain in place.

When you later add photos, use real ClearDesk work samples (fully anonymised) or licensed environmental photography without identifiable faces. Save web images in `assets/img/` and update the matching `alt` text.

## Important before publishing

- The contact form now prepares an email to `info@cleardesk.co.nz`; it does not send data to an external form service.
- Keep the accredited-provider wording. It is needed so the e-invoicing role remains accurate.
- The supplied identity-preserving formal portrait is already installed on the About
  and Director pages. Replace it only with another approved real photograph.
