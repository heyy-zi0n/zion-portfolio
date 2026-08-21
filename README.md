# Premium Personal Portfolio Website

An award-winning, high-performance personal portfolio website built for freelancers, web developers, and virtual assistants looking to present their services, skills, and projects with a premium Scandinavian-inspired and Apple-like aesthetic.

## Features

- **Premium Design Aesthetics**: Minimalist Scandinavian layout, lots of white space, subtle interactive borders, typography hierarchy, and beautiful dark/light mode toggles.
- **Fast Loading (Targeting 95+ Lighthouse)**: Minimal dependencies, built using Vite + Tailwind CSS v4, dynamic asset loading, and optimized animations.
- **Smooth Interaction**: Smooth inertial scrolling using Lenis, micro-interactions, responsive filters, accordion questions, and custom interactive cursor with magnetic hover effect.
- **GSAP Animations**: Fade-up entries, staggered list items, counter stats count-up, slider reviews, and smooth text reveals.
- **Fully SEO & Access Optimized**: JSON-LD Person schema, meta description tags, Open Graph cards, sitemap, semantic markup, and keyboard accessibility.
- **No-Backend Contact Form**: Ready-to-go form integration with FormSubmit AJAX support for instant inline success toast states.

---

## Folder Structure

```
/portfolio
│
├── index.html          # Main semantic HTML structure & meta SEO
├── public/
│   ├── favicon.svg     # Browser icon
│   ├── robots.txt      # Crawl guidelines
│   └── sitemap.xml     # SEO indexing
│
├── src/
│   ├── main.js         # Entry JS: Lucide, mobile menu, filters, accordions
│   ├── style.css       # Tailwind v4 directives & custom CSS systems
│   │
│   └── js/
│       ├── theme.js    # LocalStorage theme management (light/dark)
│       └── animations.js # Lenis smooth scroll, custom cursor, GSAP triggers
│
├── package.json        # Script tasks & dependencies
├── vite.config.js      # Vite compilation configuration
└── README.md           # Setup & customization guide
```

---

## Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone or copy these project files into your working directory.
2. Open terminal in the project directory and run:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```
Open the provided URL (usually `http://localhost:5173`) in your browser. Changes will update instantly via Hot Module Replacement (HMR).

### Production Build

Compile and optimize the project for production deployment:
```bash
npm run build
```
This builds static optimized assets in the `/dist` directory.

---

## Customization Guide

### 1. Color Customization
You can adjust the core palette directly in `src/style.css` by modifying the CSS variables under `:root` and `.dark`:
```css
:root {
  --background: #FAFAFA;
  --surface: #FFFFFF;
  --text-primary: #111111;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --accent: #2563EB; /* Your brand color */
}
```

### 2. Update Content
To customize your profile details, services, pricing, or FAQ details:
- Edit the content in `index.html`.
- Add, remove, or modify `<div class="service-card">` or `<div class="project-card">` components. Make sure to update the `data-category` attribute on cards and the matching `data-filter` attribute on the filter buttons.

### 3. Contact Form Setup
The contact form is configured to work out-of-the-box using the free **FormSubmit AJAX API**:
1. Open `index.html` and scroll to the contact form section (`<form id="contact-form" ...>`).
2. Replace `your-email@example.com` in `action="https://formsubmit.co/ajax/your-email@example.com"` with your actual email address.
3. Submit the form once on the live website to activate and verify the email inbox. That's it! No backend configuration is required.

---

## Deployment

The optimized build is 100% static, meaning it can be hosted for free on any modern hosting provider:

### Vercel / Netlify / Cloudflare Pages
1. Connect your repository to the hosting provider dashboard.
2. Set the configuration options:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click Deploy.

### GitHub Pages
Configure your GitHub project settings to deploy from the `/docs` folder or use GitHub Actions workflow for static Vite compilation.
