import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// Static landing site for ASM Investments — see docs/05-deployment.md and docs/adr/.
// No SSR: everything is pre-rendered to a static `dist/` for GitHub Pages.
export default defineConfig({
  site: 'https://asmfinance.tech',
  build: {
    // /privacy -> /privacy/index.html, which GitHub Pages serves cleanly.
    format: 'directory',
    // Inline small stylesheets to cut first-paint requests; large ones stay external.
    inlineStylesheets: 'auto',
  },
  integrations: [
    // applyBaseStyles:false -> our src/styles/global.css owns the @tailwind directives
    // so we control base layer order (fonts, focus-visible, smooth-scroll).
    tailwind({ applyBaseStyles: false }),
    react(),
    icon(),
  ],
  prefetch: { prefetchAll: false },
});
