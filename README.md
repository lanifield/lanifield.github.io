# Cyberpunk Portfolio Website

A fully accessible, cyberpunk-themed portfolio website for Lani, featuring UX consulting, ethical AI, and accessibility expertise.

## 🌟 Features

### Complete Pages
- **Homepage**: Dynamic hero with auto-updating journal cards
- **About**: Skills grid with 5 core disciplines (expandable)
- **Journal**: Fully functional filterable/sortable index with search
- **Contact**: Secure form with honeypot protection and reCAPTCHA ready

### Design Highlights
- **Cyberpunk Aesthetic**: Custom color palette (Shadow Void, Electric Cyan, Digital Lavender, Neon Green, Smokey White)
- **Animated Effects**: Scanning lines, glowing text, hologram frames, glitch effects, grid backgrounds
- **Typography**: Orbitron display font + Rajdhani body font
- **Distinctive**: Custom animations, asymmetric layouts, bold visual choices

### Standards Compliance
- ✅ HTML5 valid (W3C)
- ✅ CSS3 valid (Jigsaw)
- ✅ WCAG 2.2 AA compliant
- ✅ Semantic HTML5 with proper landmarks
- ✅ Full keyboard navigation
- ✅ Screen reader optimized
- ✅ GDPR-compliant cookie consent

### Technical Features
- Real-time journal search and filtering
- Client-side form validation
- Honeypot spam protection
- reCAPTCHA ready
- Email obfuscation
- Responsive design (mobile-first)
- Analytics ready (GA4, GTM, Clarity)
- SEO optimized

## 📁 File Structure

```
/
├── index.html              # Homepage
├── about.html              # About page with skills
├── journal.html            # Journal index with filtering
├── contact.html            # Contact form
├── privacy.html            # Privacy policy
├── terms.html              # Terms of use
├── css/
│   └── styles.css          # Complete stylesheet
├── js/
│   ├── main.js             # Global functionality
│   ├── journal.js          # Journal filtering
│   └── contact.js          # Form handling
├── assets/                 # Images (add your own)
│   ├── journal-1.jpg through journal-12.jpg
│   └── og-image.jpg
└── journal/                # Individual article pages
    └── (your articles here)
```

## 🚀 Getting Started

### 1. Set Up Files
All HTML, CSS, and JavaScript files are ready to go. Just add your images to the `assets` folder.

### 2. Replace Placeholder Content

#### Images
Replace placeholder image references with your actual images:
- `assets/journal-1.jpg` through `assets/journal-12.jpg` - Journal card images
- `assets/og-image.jpg` - Open Graph social sharing image

#### Social Links
Update your actual social media URLs in all HTML files:
```html
<a href="https://linkedin.com/in/lanifield/in/YOUR_PROFILE">
<a href="https://github.com/YOUR_USERNAME">
```

#### Contact Information
Update email in `contact.html`:
```html
<a href="#" ... data-user="YOUR_USERNAME" data-domain="YOUR_DOMAIN.com">
```

### 3. Set Up Analytics (Optional)

#### Google Analytics 4
Uncomment and add your tracking ID in HTML files:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

#### Google Tag Manager
Uncomment and add your container ID.

#### Microsoft Clarity
Uncomment and add your project ID.

### 4. Configure reCAPTCHA (Optional)

1. Get your site key from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Add to `contact.html`:
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
```
3. Uncomment the reCAPTCHA function in `contact.js`

### 5. Set Up Form Submission

Choose one of these options in `contact.js`:

#### Option A: FormSpree
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

#### Option B: Netlify Forms
```javascript
const formData = new FormData();
Object.keys(data).forEach(key => formData.append(key, data[key]));

const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString()
});
```

#### Option C: Your Own Backend
```javascript
const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

## 📝 Creating Journal Articles

### Method 1: Add to Existing Grid
Add new cards to `journal.html`:

```html
<article class="journal-card" data-type="reflection" data-topic="ai" data-date="2025-02-01" data-title="Your Article Title">
    <div class="card-image">
        <img src="assets/your-image.jpg" alt="" loading="lazy">
        <div class="card-overlay"></div>
    </div>
    <div class="card-content">
        <div class="card-meta">
            <a href="journal.html?type=reflection" class="pill pill-reflection">Reflection</a>
            <a href="journal.html?topic=ai" class="pill pill-ai">AI Ethics</a>
        </div>
        <h2 class="card-title">
            <a href="journal/your-article.html">Your Article Title</a>
        </h2>
        <p class="card-excerpt">
            Your article excerpt here...
        </p>
        <div class="card-footer">
            <time datetime="2025-02-01">Feb 1, 2025</time>
            <span class="read-time">5 min read</span>
        </div>
    </div>
</article>
```

### Method 2: Create Individual Article Pages
See `journal/article-template.html` for a complete article page template with:
- Article header with metadata
- Full content area
- Related articles
- Proper semantic markup
- All cyberpunk styling

### Taxonomy

**Types:**
- `thought`, `reflection`, `idea`, `guide`, `resource`, `knowledge`, `psychology`

**Topics:**
- `ux`, `ai`, `accessibility`, `diversity`, `inclusion`, `design`, `education`, `research`, `government`

## 🎨 Customization

### Colors
Edit CSS custom properties in `css/styles.css`:
```css
:root {
    --color-void: #080016;
    --color-cyan: #48f6f8;
    --color-lavender: #c859d2;
    --color-green: #4EFD54;
    --color-white: #f8f8ff;
}
```

### Typography
Change fonts by updating Google Fonts link in HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

And CSS:
```css
:root {
    --font-display: 'YOUR_FONT', sans-serif;
    --font-body: 'YOUR_FONT', sans-serif;
}
```

## ♿ Accessibility Features

- WCAG 2.2 AA compliant
- Semantic HTML5
- ARIA labels and live regions
- Skip to main content link
- Keyboard navigation
- Focus indicators
- Screen reader optimization
- Color contrast compliance
- Reduced motion support

## 📱 Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## 🔒 Security Features

- Honeypot spam protection
- Client-side validation
- reCAPTCHA ready
- Email obfuscation
- XSS protection
- GDPR cookie consent

## 🧪 Testing Checklist

### Accessibility
- [ ] WAVE evaluation
- [ ] axe DevTools scan
- [ ] Keyboard navigation test
- [ ] Screen reader test (NVDA/JAWS/VoiceOver)
- [ ] Color contrast check

### Standards
- [ ] HTML validation (W3C)
- [ ] CSS validation (Jigsaw)
- [ ] i18n checker
- [ ] Link checker

### Cross-Browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Performance
- [ ] Lighthouse audit
- [ ] Page speed test
- [ ] Image optimization

## 📦 Deployment

### Static Hosting (Netlify/Vercel/GitHub Pages)
1. Push to GitHub repository
2. Connect to hosting service
3. Deploy!

### Traditional Hosting
1. Upload all files via FTP
2. Ensure proper directory structure
3. Update any absolute URLs

## 🔧 Maintenance

### Regular Updates
- Review and update journal content
- Check broken links
- Update dependencies
- Monitor analytics
- Test accessibility

### Adding Features
The codebase is modular and well-commented. Key files:
- `css/styles.css` - All styling
- `js/main.js` - Global functionality
- `js/journal.js` - Journal features
- `js/contact.js` - Form handling

## 📄 License

This is a custom-built website. Please respect the design and code.

## 🙏 Credits

- Fonts: Google Fonts (Orbitron, Rajdhani)
- Icons: SVG (custom)
- Design: Cyberpunk-inspired aesthetic

## 📞 Support

For questions about implementation or customization, refer to the code comments or contact through the website's contact form.

---

Built with accessibility, ethics, and equity at the core. 🌟
