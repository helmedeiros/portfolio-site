# Personal Portfolio Website

A modern, minimalist personal website inspired by Bastien Moiroux's clean design aesthetic. Built with Astro and featuring a responsive design with smooth animations and professional presentation.

**🌐 Live Site:** [heliomedeiros.com](https://heliomedeiros.com)

## 🎨 Design Features

- **Minimalist Design**: Clean, spacious layout with strategic use of white space
- **Bold Typography**: Modern Inter font with varied weights for visual hierarchy
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Subtle scroll animations and hover effects
- **Professional Presentation**: Clean project showcases and contact sections
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
   Value: helio-medeiros.github.io
   ```

3. **Automatic Deployment**:
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles building and deploying
   - SSL certificate is automatically provided by GitHub Pages
   - Deploy on every push to `main` branch

## ✏️ Customization Guide

### Personal Information

Replace the following placeholder content with your information:

**Navigation & Branding:**

- Line 67: Change `"your name."` to your actual name
- Line 106: Update the hero title with your name
- Line 566: Update footer copyright with your name

**Contact Information:**

- Line 502: Replace email address
- Line 506: Replace phone number
- Line 507: Replace location
- Line 517: Update social media links

**Content Sections:**

- Lines 108-115: Update hero subtitle and description
- Lines 138-148: Replace about section content
- Lines 150-158: Update skills in the skills grid
- Lines 179-239: Replace project information with your actual work

### Visual Customization

**Colors:**

- Primary text: `#1a1a1a`
- Secondary text: `#666` and `#888`
- Background: `#fafafa` and `white`
- Accent: Available for work badge uses green (`#4ade80`)

**Typography:**

- Font family: Inter (loaded from Google Fonts)
- Responsive font sizes using `clamp()` for fluid scaling

**Images:**

- Replace hero placeholder with your photo as `public/helio-photo.jpg`
- Add project images in the work section

### Adding Your Photo

Replace the placeholder with your actual image:

```bash
# Add your photo to the public directory
cp your-photo.jpg public/helio-photo.jpg
```

## 📁 Project Structure

```
src/
├── pages/
│   └── index.astro          # Main homepage with all sections
├── layouts/
│   └── Layout.astro         # Base layout with SEO and global styles
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

## 🎯 Inspired by Bastien Moiroux

This design takes inspiration from [Bastien Moiroux's portfolio](https://bastienmoiroux.fr/) featuring:

- Clean, professional layout
- Bold typography hierarchy
- Minimalist color palette
- Strategic use of white space
- Professional project presentation
- Personal touch in contact section

## 🔒 Privacy & Security

- SSL certificate automatically provided by GitHub Pages
- No tracking or analytics (privacy-first approach)
- Secure hosting with GitHub's infrastructure
- Family privacy protection in content

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Live at:** [heliomedeiros.com](https://heliomedeiros.com) 🚀
