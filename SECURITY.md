# Security Policy

## Security Features

This portfolio website implements several security measures:

### 🔒 Web Security

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer Policy**: Controls referrer information sharing

### 🛡️ Email Protection

- JavaScript-based email obfuscation to prevent bot scraping
- Safe DOM manipulation practices
- Contact form protection against automated submissions

### 📦 Dependencies

- Regular security audits via `npm audit`
- Minimal dependency footprint (Astro + Tailwind CSS)
- Dependencies kept up to date

## Reporting Security Issues

If you discover a security vulnerability:

1. **Email**: hi@heliomedeiros.com
2. **Include**: Detailed information about the vulnerability
3. **Please**: Allow time for response before public disclosure

## Security Maintenance

- Dependencies are audited regularly
- Security headers are reviewed as needed
- This document is updated with security changes
