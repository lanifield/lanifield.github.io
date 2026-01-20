# Lani Field - UX + AI Portfolio Website

A fully accessible, WCAG 2.2 AA compliant website built with semantic HTML5, CSS3, and vanilla JavaScript. Features an aurora-inspired color palette, responsive design, markdown-based blog system, and privacy-first analytics consent.

## 🎨 Brand Colors

- **Void Black** (#0D011C) - Background
- **Deep Indigo** (#160059) - Borders/Shadows
- **Neon Green** (#4EFD54) - Primary CTA
- **Electric Cyan** (#41FDFE) - Accent
- **Hot Pink** (#FE41D7) - Accent
- **Ghost White** (#F8F8FF) - Body text

## 🏗️ Project Structure

```
lani-website/
├── index.html              # Homepage with hero and latest articles
├── about.html              # About page with journey and fun facts
├── blog.html               # Blog index with search and filtering
├── css/
│   └── styles.css          # Complete stylesheet with WCAG compliance
├── js/
│   └── main.js             # Main JavaScript functionality
├── blog/
│   ├── post-template.html  # Template for blog posts
│   └── *.md                # Markdown blog posts
└── images/                 # Your images go here
    ├── favicon-32x32.png
    ├── favicon-16x16.png
    ├── apple-touch-icon.png
    ├── og-image.jpg        # For social sharing
    └── blog/               # Blog post images
```

## 📋 Setup Checklist

### 1. Replace Placeholders

#### Analytics & Tracking
- [ ] Add Google Analytics 4 measurement ID in all HTML files (search for `G-XXXXXXXXXX`)
- [ ] Add Microsoft Clarity project ID in all HTML files (search for `XXXXXXXXXX`)
- [ ] Add reCAPTCHA v3 site key in `main.js` (search for `YOUR_SITE_KEY`)

#### Meta Tags & SEO
- [ ] Update LinkedIn URL throughout (search for `lanifield`)
- [ ] Update site domain throughout (search for `lanifield.com`)
- [ ] Add your educational institution in homepage schema (search for `TODO: Add your educational institution`)
- [ ] Create and add Open Graph images (`og-image.jpg`, `twitter-image.jpg`)

#### Contact Form
- [ ] Set up contact form backend endpoint (update `/api/contact` in `main.js`)
- [ ] Configure email destination for form submissions
- [ ] Add reCAPTCHA verification to form handler

### 2. Add Images

Create the following images with responsive srcset:
- Favicon (32x32, 16x16)
- Apple touch icon (180x180)
- Social sharing images (1200x630 recommended)
- Blog post images in multiple sizes:
  - 300px, 600px, 900px, 1200px, 1500px widths
  - Name format: `filename-[width].jpg`

### 3. Customize Content

#### Homepage (`index.html`)
- Update hero headline and tagline
- Review about preview section

#### About Page (`about.html`)
- Verify journey timeline content
- Update fun facts if needed
- Add any additional sections

#### Blog
- Write posts in Markdown format
- Save as `.md` files in `/blog/` directory
- Update `BlogManager.loadPosts()` in `main.js` with actual post metadata
- Or implement dynamic loading from directory

## 🎯 Key Features

### Accessibility (WCAG 2.2 AA)
- Semantic HTML5 structure
- ARIA landmarks and labels
- Keyboard navigation support
- Focus indicators throughout
- Skip to main content link
- Screen reader friendly
- Reduced motion support
- Minimum 4.5:1 color contrast

### Responsive Design
- Mobile-first approach
- Responsive images with srcset
- Breakpoints: 300px, 600px, 900px, 1200px, 1500px
- Touch-friendly targets (48x48px minimum)

### Blog System
- Markdown-based posts
- Search functionality
- Topic filtering
- Dynamic rendering
- SEO optimized

### Privacy & Compliance
- Cookie consent banner
- GA4 and Clarity integration ready
- Honeypot spam protection
- reCAPTCHA v3 support
- Privacy-first approach

### Performance
- Minimal dependencies
- Lazy loading images
- Debounced search
- Efficient animations
- Progressive enhancement

## 🚀 Deployment

### Static Hosting (Recommended)
Works with: Netlify, Vercel, GitHub Pages, Cloudflare Pages

1. **Connect your repo**
2. **Build settings:**
   - Build command: None needed (static site)
   - Publish directory: `/` (root)
3. **Environment variables:**
   - Add any API keys as environment variables
   - Never commit API keys to repo

### Custom Server
Upload all files maintaining directory structure. Ensure server is configured for:
- Clean URLs (optional)
- HTTPS
- Proper MIME types
- Caching headers

## 🔧 Customization Guide

### Color Scheme
Edit CSS custom properties in `styles.css`:
```css
:root {
  --void-black: #0D011C;
  --neon-green: #4EFD54;
  /* ... etc */
}
```

### Typography
Fonts are loaded from Google Fonts:
- **Headings:** Titillium Web (600)
- **Body:** Exo 2 (400, 500)

To change fonts, update:
1. Google Fonts link in HTML head
2. CSS custom properties for font families

### Blog Post Structure
Markdown posts support:
- Headers (H1-H3)
- Bold, italic, combined
- Links and images
- Code blocks and inline code
- Blockquotes
- Lists (unordered/ordered)
- Horizontal rules

### Adding New Pages
1. Copy an existing HTML file
2. Update navigation links
3. Add page to sitemap
4. Update schema.org markup
5. Create appropriate metadata

## 📝 Writing Blog Posts

### Markdown Template
```markdown
# Post Title

Brief introduction paragraph.

## Section Heading

Content here with **bold** and *italic* text.

![Image alt text](/images/blog/image.jpg)

### Subsection

- List item one
- List item two

> Blockquote for emphasis

`inline code` or:

```
Code block
```

---

## References

- [Link text](https://url.com)
```

### Post Metadata
Update in `main.js` `BlogManager.loadPosts()`:
```javascript
{
  id: 'unique-slug',
  title: 'Post Title',
  date: '2025-01-20',
  topic: 'Topic Name',
  excerpt: 'Brief description...',
  image: '/images/blog/image.jpg',
  imageAlt: 'Descriptive alt text',
  slug: 'unique-slug'
}
```

## 🔒 Security Considerations

1. **Form Protection:**
   - Honeypot field (hidden)
   - reCAPTCHA v3
   - Server-side validation
   - Text-only message content

2. **Email Obfuscation:**
   - Email not visible in source code
   - Contact form prevents scraping

3. **Content Security:**
   - Sanitize all user inputs
   - Use HTTPS only
   - Set security headers

## 🧪 Testing Checklist

### Accessibility
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Keyboard-only navigation
- [ ] Color contrast analyzer
- [ ] WAVE browser extension
- [ ] axe DevTools

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Responsive Testing
- [ ] Mobile (320px-600px)
- [ ] Tablet (601px-900px)
- [ ] Desktop (901px+)
- [ ] Large screens (1500px+)

### Functionality
- [ ] Navigation (desktop/mobile)
- [ ] Search and filters
- [ ] Contact form
- [ ] Privacy consent
- [ ] Blog post rendering
- [ ] All links work

### Performance
- [ ] Lighthouse audit
- [ ] PageSpeed Insights
- [ ] Image optimization
- [ ] Load time < 3 seconds

### SEO
- [ ] Meta tags complete
- [ ] Schema markup valid
- [ ] Sitemap created
- [ ] Robots.txt configured
- [ ] Search Console setup

## 📊 Analytics Setup

### Google Analytics 4
1. Create GA4 property
2. Get measurement ID (G-XXXXXXXXXX)
3. Add to all HTML files
4. Verify tracking in GA4 dashboard

### Microsoft Clarity
1. Create Clarity project
2. Get project ID
3. Add to all HTML files
4. Verify recording in Clarity dashboard

## 🤝 Maintenance

### Regular Tasks
- Update blog content weekly
- Review analytics monthly
- Check for broken links
- Update dependencies
- Test accessibility
- Backup site regularly

### Content Strategy
- Share learnings authentically
- Document journey publicly
- Engage with community
- Iterate based on feedback

## 📞 Support & Questions

Built with care by Lani Field. For questions or issues:
- LinkedIn: [Update with your profile]
- Email: Via contact form

## 📄 License

© 2025 Lani Field. All rights reserved.

---

**Note:** This is a living document. Update as you enhance the website.
