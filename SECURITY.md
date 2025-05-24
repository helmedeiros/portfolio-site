# Security Policy

## Security Measures Implemented

### 🔒 Frontend Security

1. **Content Security Policy (CSP)**: Prevents XSS attacks by restricting resource loading
2. **X-Frame-Options**: Prevents clickjacking attacks
3. **X-Content-Type-Options**: Prevents MIME type sniffing
4. **Referrer Policy**: Controls referrer information sharing

### 🛡️ Email Protection

- JavaScript-based email obfuscation to prevent bot scraping
- Safe DOM manipulation (no `innerHTML` with user input)
- Base64 encoding as additional protection layer

### 📦 Dependencies

- All dependencies are regularly audited via `npm audit`
- Minimal dependency footprint (only Astro and Tailwind CSS)
- No known vulnerabilities in current dependency tree

### 🔐 GitHub Actions Security

- Uses official GitHub actions (`actions/checkout@v4`, `withastro/action@v2`)
- Minimal permissions: only `contents: read`, `pages: write`, `id-token: write`
- No secrets or environment variables exposed

## Security Best Practices

### ✅ What We Do

- Never commit sensitive information (API keys, passwords)
- Use `.gitignore` to exclude environment files
- Implement email obfuscation to prevent spam
- Use safe DOM manipulation methods
- Regular dependency auditing

### 🚫 What We Avoid

- Hardcoded secrets or credentials
- Using `eval()` or `innerHTML` with dynamic content
- Including debug code in production
- Exposing sensitive information in commit history

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: hi@heliomedeiros.com
3. Include detailed information about the vulnerability
4. Allow reasonable time for response before public disclosure

## Security Audit Log

- **2025-01-24**: Initial security review completed
  - Fixed XSS risk in email display function
  - Added security headers (CSP, X-Frame-Options, etc.)
  - Verified no hardcoded secrets
  - Confirmed clean dependency tree

## Regular Maintenance

- Dependencies are audited monthly
- Security headers are reviewed quarterly
- This document is updated with any security changes
