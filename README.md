# Manpreet Chaudhary — Portfolio Website

A cinematic, high-performance personal professional portfolio website built for **Manpreet Chaudhary**, Research Intern at **IIT Roorkee** working under **Dr. Neetesh Kumar** (Department of Computer Science & Engineering).

---

## Architecture & Visual System

- **Color Scheme**: Deep matte black background (`#0a0a0a`) with electric cyan (`#22d3ee`) and blue (`#3b82f6`) accents.
- **Visual Motif**: Content elements, cards, and page sections emerge smoothly from shadow with GPU-accelerated blur-to-focus and translate transitions (`200–500ms`, eased).
- **Navigation as a Guide**: Fixed frosted-glass navbar, scroll progress bar indicator, active page glowing pill, cursor-reactive hover states, and smooth client-side page transitions.
- **Zero Build Friction**: Built with semantic HTML5, modern CSS custom properties, and native ES modules. Loads in milliseconds with zero dependencies.

---

## Multi-Page Structure

1. **Home (`index.html`)**: Full-screen cinematic hero, status indicator, tagline, interactive particle constellation canvas, CTA buttons, quick stats, and featured projects preview.
2. **About (`about.html`)**: Professional biography, current role at IIT Roorkee under Dr. Neetesh Kumar (started July 6, 2026, ongoing), Autonomous Drone Development focus, and categorized skill tags.
3. **Experience (`experience.html`)**: Vertical illuminated timeline with scroll-ignited nodes, IIT Roorkee research internship details, workshop platforms lead, and verified LinkedIn certification badges.
4. **Projects (`projects.html`)**: Staggered project grid with dark-mask slide-up hover reveal, technical specs, external live links, and interactive project detail modal.
5. **Contact (`contact.html`)**: Minimal contact form with loading spinner & success checkmark micro-interactions, institutional email with copy-to-clipboard, and direct LinkedIn profile link.

---

## Local Development

Start the built-in zero-dependency server:

```bash
# Using Node.js
node server.js

# Or using npm
npm start
```

Then open `http://localhost:3000` (or `PORT=3005 node server.js`) in your web browser.

---

## Project Customization

All personal details, projects, experience items, certifications, and skills are centrally managed in:
- `js/data.js`

To add a new project, experience milestone, or certification, edit `js/data.js` and the modal and data engines will automatically reflect your changes.
