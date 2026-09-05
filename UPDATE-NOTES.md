# ClearDesk website update notes

Updated 5 September 2026.

## Changes made

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
- Add a real professional photo of Eranda only when you are ready; do not use an AI person as a substitute.
