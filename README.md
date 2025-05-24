# Personal Portfolio Website

A modern, minimalist personal website built with Astro and featuring a responsive design with smooth animations and professional presentation.

**🌐 Live Site:** [heliomedeiros.com](https://heliomedeiros.com)

## 🎨 Design Features

- **Minimalist Design**: Clean, spacious layout with strategic use of white space
- **Bold Typography**: Modern Inter font with varied weights for visual hierarchy
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Subtle scroll animations and hover effects
- **Professional Presentation**: Clean project showcases and contact sections
- **Security-First**: Email obfuscation and comprehensive security headers
- **Accessibility**: Built with accessibility best practices in mind

## 🚀 Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

## 🚢 Deployment to GitHub Pages

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

## 📁 Project Structure

```
src/
├── pages/
│   └── index.astro          # Main homepage with all sections
├── layouts/
│   └── Layout.astro         # Base layout with SEO and security headers
└── styles/
    └── global.css           # Global styles with Tailwind and custom CSS
```

## 🛠️ Technologies Used

- **Astro**: Static site generator optimized for performance
- **TailwindCSS v4**: Utility-first CSS framework
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: For maintainable theming
- **Intersection Observer API**: For scroll animations
- **Google Fonts**: Inter font family
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site hosting with custom domain

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## ⚡ Performance

- Optimized CSS with efficient selectors
- Smooth scroll behavior
- Lazy loading animations
- Minimal JavaScript footprint
- SEO-friendly structure
- Fast loading times with Astro's static generation

## 🔒 Security Features

- Content Security Policy (CSP) headers
- Email obfuscation to prevent spam
- Safe DOM manipulation practices
- Regular dependency auditing
- See [SECURITY.md](SECURITY.md) for full details

## 🤝 Contributing

While this is a personal portfolio, contributions for bug fixes or improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Live at:** [heliomedeiros.com](https://heliomedeiros.com) 🚀
