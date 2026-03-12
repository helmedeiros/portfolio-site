# Personal Portfolio Website

A modern, minimalist personal website built with Astro and featuring a responsive design with smooth animations and professional presentation.

**Live Site:** [heliomedeiros.com](https://heliomedeiros.com)

## Design Features

- **Minimalist Design**: Clean, spacious layout with strategic use of white space
- **Bold Typography**: Modern Inter font with varied weights for visual hierarchy
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Subtle scroll animations and hover effects
- **Professional Presentation**: Clean project showcases and contact sections
- **Security-First**: Email obfuscation and comprehensive security headers
- **Accessibility**: Built with accessibility best practices in mind

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

## Deployment to GitHub Pages

This site is configured for automatic deployment to GitHub Pages with a custom domain.

### Automatic Deployment

- **Trigger**: Every push to the `main` branch
- **Build**: Automated via GitHub Actions
- **Deploy**: Automatic to GitHub Pages
- **Domain**: Custom domain `heliomedeiros.com`

### Manual Deployment

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

### GitHub Pages Setup

1. **Repository Settings**:

   - Go to repository Settings → Pages
   - Source: "Deploy from a branch" → "GitHub Actions"
   - Custom domain: `heliomedeiros.com`

2. **DNS Configuration**:

   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153

   Type: CNAME
   Name: www
   Value: helmedeiros.github.io
   ```

3. **Automatic Deployment**:
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles building and deploying
   - SSL certificate is automatically provided by GitHub Pages
   - Deploy on every push to `main` branch

## Project Structure

```
src/
├── pages/
│   └── index.astro          # Main homepage with all sections
├── layouts/
│   └── Layout.astro         # Base layout with SEO and security headers
└── styles/
    └── global.css           # Global styles with Tailwind and custom CSS
```

## Technologies Used

- **Astro**: Static site generator optimized for performance
- **TailwindCSS v4**: Utility-first CSS framework
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: For maintainable theming
- **Intersection Observer API**: For scroll animations
- **Google Fonts**: Inter font family
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site hosting with custom domain

## Responsive Design

The website is fully responsive with breakpoints:

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## Performance

- Optimized CSS with efficient selectors
- Smooth scroll behavior
- Lazy loading animations
- Minimal JavaScript footprint
- SEO-friendly structure
- Fast loading times with Astro's static generation

## Security Features

- Content Security Policy (CSP) headers
- Email obfuscation to prevent spam
- Safe DOM manipulation practices
- Regular dependency auditing
- Automated dependency updates via Dependabot
- See [SECURITY.md](SECURITY.md) for full details

## Automated Maintenance

### Dependabot Configuration

This repository uses Dependabot for automatic dependency management:

- **Schedule**: Weekly updates on Mondays at 9:00 AM (Berlin time)
- **NPM Dependencies**: Automatically updates Astro, Tailwind, and all other dependencies
- **GitHub Actions**: Keeps workflow actions up-to-date
- **Grouped Updates**: Related packages are grouped together (e.g., Astro ecosystem, Tailwind ecosystem)
- **Security Updates**: High-priority security updates are created immediately
- **Pull Request Limits**: Maximum 5 dependency PRs and 2 GitHub Actions PRs open at once

### What Gets Updated Automatically

- Astro framework and related packages
- Tailwind CSS and plugins
- Development dependencies
- GitHub Actions workflows
- Security patches (immediate)

All updates are reviewed before merging to ensure compatibility.

## Contributing

While this is a personal portfolio, contributions for bug fixes or improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Development Setup

### Local Development

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

3. **Run Tests**:
   ```bash
   npm test              # Watch mode
   npm run test:run      # Single run
   npm run test:coverage # With coverage
   ```

### Pre-Push Quality Checks

To prevent CI failures, always run these commands before pushing:

```bash
# Quick check (recommended before every push)
npm run pre-push

# Comprehensive check (includes preview)
npm run ci-check
```

### Git Hooks Setup (Optional but Recommended)

Install the pre-push hook to automatically run checks:

```bash
# Make the script executable (already done if you cloned recently)
chmod +x pre-push.sh

# Set up the Git hook
cp pre-push.sh .git/hooks/pre-push

# Now Git will automatically run tests and build before every push
```

This prevents:

- Broken builds from reaching CI
- Test failures in production
- Runtime errors in deployed code

---

**Live at:** [heliomedeiros.com](https://heliomedeiros.com)
# Test change
