# 🚀 Production Deployment Checklist

Use this checklist before deploying AGG.homes to production.

## ✅ Pre-Deployment Tasks

### 1. Security Configuration

- [ ] Set environment variables on hosting platform:
  ```bash
  INTERCOM_API_TOKEN=your_actual_token
  ADMIN_USERNAME=your_username
  ADMIN_PASSWORD=your_secure_password
  NODE_ENV=production
  ```

- [ ] Verify `config.js` uses environment variables (not hardcoded values)
- [ ] Remove any development credentials from codebase
- [ ] Review SECURITY.md and follow all recommendations
- [ ] Enable HTTPS/SSL on hosting platform

### 2. Code Quality

- [ ] Run linting: `npm run lint` (if configured)
- [ ] Fix all ESLint warnings and errors
- [ ] Review and remove unnecessary console.log statements
- [ ] Run: `node strip-console-logs.js` to remove debug logs

### 3. Testing

- [ ] Install Playwright browsers: `npm run test:install`
- [ ] Run all tests: `npm test`
- [ ] Verify all tests pass (0 failures)
- [ ] Test on multiple browsers:
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari/WebKit
  - [ ] Mobile Chrome
  - [ ] Mobile Safari

### 4. Build & Optimization

- [ ] Run production build: `npm run build`
- [ ] Verify `dist/` directory created successfully
- [ ] Check bundle sizes are reasonable
- [ ] Test service worker registration
- [ ] Verify PWA manifest loads correctly
- [ ] Test offline functionality with `offline.html`

### 5. Content & SEO

- [ ] Verify all images have alt attributes
- [ ] Check meta descriptions on all pages
- [ ] Validate structured data (JSON-LD):
  - Use: https://search.google.com/test/rich-results
- [ ] Verify canonical URLs are correct
- [ ] Check hreflang tags for multi-language:
  - [ ] English (/)
  - [ ] Spanish (/es/)
  - [ ] Dutch (/nl/)
- [ ] Update sitemap.xml with current URLs
- [ ] Verify robots.txt allows search engines

### 6. Performance

- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Verify LCP (Largest Contentful Paint) < 2.5s
- [ ] Check FID (First Input Delay) < 100ms
- [ ] Verify CLS (Cumulative Layout Shift) < 0.1
- [ ] Test image loading and optimization
- [ ] Verify critical CSS is inlined
- [ ] Check fonts load with font-display: swap

### 7. Functionality Testing

- [ ] Test contact forms submission
- [ ] Verify WhatsApp chat integration works
- [ ] Test Intercom chat widget
- [ ] Check language switcher on all pages
- [ ] Test property matching form
- [ ] Verify admin dashboard login
- [ ] Test admin authentication and logout

### 8. Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### 9. Responsive Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet Portrait (768x1024)
- [ ] Tablet Landscape (1024x768)
- [ ] Mobile (375x667)
- [ ] Mobile (414x896)

### 10. Accessibility

- [ ] Run axe accessibility checker
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Test with browser zoom (up to 200%)

## 🔧 Deployment Steps

### Option A: Static Hosting (GitHub Pages, Netlify, Vercel)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy dist/ directory:**
   - GitHub Pages: Push to gh-pages branch
   - Netlify: Connect repo or drag-and-drop `dist/`
   - Vercel: Import project from Git

3. **Set environment variables in hosting dashboard**

4. **Configure custom domain (if applicable)**

5. **Enable HTTPS/SSL**

### Option B: Traditional Web Hosting

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload dist/ contents via FTP/SFTP**

3. **Configure .htaccess for clean URLs:**
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.html [L,QSA]
   ```

4. **Verify SSL certificate is active**

## ✅ Post-Deployment Verification

### Immediately After Deployment:

- [ ] Visit homepage and verify it loads
- [ ] Check all language versions (/, /es/, /nl/)
- [ ] Test contact form submission
- [ ] Verify WhatsApp chat works
- [ ] Test Intercom integration
- [ ] Check admin dashboard login
- [ ] Verify service worker registers (check DevTools > Application)

### Within 24 Hours:

- [ ] Monitor error logs
- [ ] Check Google Search Console for crawl errors
- [ ] Verify analytics tracking (if configured)
- [ ] Test from different geographic locations
- [ ] Check loading speeds from different networks

### Within 1 Week:

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor Core Web Vitals
- [ ] Review user feedback
- [ ] Check for any JavaScript errors in production

## 🐛 Rollback Plan

If something goes wrong:

1. **Keep previous version backup:**
   ```bash
   cp -r dist/ dist-backup/
   ```

2. **Have rollback command ready:**
   - Git: `git revert HEAD` or `git reset --hard <previous-commit>`
   - Hosting: Revert to previous deployment in dashboard

3. **Monitor error rates and user reports**

## 📊 Monitoring & Maintenance

### Regular Checks:

- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies (`npm outdated`)
- [ ] Monthly: Run security audit (`npm audit`)
- [ ] Quarterly: Performance audit with Lighthouse
- [ ] Quarterly: Accessibility audit

### Analytics to Monitor:

- Page load times
- Bounce rates
- Conversion rates (form submissions)
- Error rates
- User engagement metrics

## 🔐 Security Reminders

- **NEVER commit secrets to Git**
- Rotate API keys quarterly
- Review access logs monthly
- Keep dependencies updated
- Monitor for security vulnerabilities
- Use strong admin passwords
- Enable 2FA where possible

## 📞 Emergency Contacts

- Hosting Support: [Your hosting provider]
- Domain Registrar: [Your domain provider]
- Developer: [Your contact info]
- Intercom Support: help@intercom.com

---

## ✨ Success Criteria

Your deployment is successful when:

- ✅ All pages load without errors
- ✅ Forms submit successfully
- ✅ Chat integrations work
- ✅ Multi-language navigation functions
- ✅ Lighthouse score > 90 on all metrics
- ✅ No console errors in production
- ✅ Service worker caches assets
- ✅ Site works offline (shows offline.html)
- ✅ Admin dashboard accessible and secure

---

**Last Updated:** November 8, 2025
**Version:** 1.0.0
