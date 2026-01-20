// ===================================
// Lani Field - UX + AI Portfolio
// Main JavaScript Functionality
// ===================================

// === Utility Functions ===
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// === Mobile Navigation ===
class MobileNav {
  constructor() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.mainNav = document.querySelector('.main-nav');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    if (this.menuToggle && this.mainNav) {
      this.init();
    }
  }
  
  init() {
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.mainNav.contains(e.target) && !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    const isOpen = this.mainNav.classList.toggle('open');
    this.menuToggle.setAttribute('aria-expanded', isOpen);
    this.menuToggle.textContent = isOpen ? 'Close Menu' : 'Menu';
  }
  
  closeMenu() {
    this.mainNav.classList.remove('open');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.textContent = 'Menu';
  }
}

// === Privacy Consent Manager ===
class PrivacyConsent {
  constructor() {
    this.banner = document.querySelector('.privacy-banner');
    this.acceptBtn = document.getElementById('accept-privacy');
    this.declineBtn = document.getElementById('decline-privacy');
    this.CONSENT_KEY = 'lani-privacy-consent';
    
    if (this.banner) {
      this.init();
    }
  }
  
  init() {
    // Check if user has already made a choice
    const consent = localStorage.getItem(this.CONSENT_KEY);
    
    if (!consent) {
      this.showBanner();
    } else if (consent === 'accepted') {
      this.loadAnalytics();
    }
    
    // Event listeners
    if (this.acceptBtn) {
      this.acceptBtn.addEventListener('click', () => this.acceptConsent());
    }
    
    if (this.declineBtn) {
      this.declineBtn.addEventListener('click', () => this.declineConsent());
    }
  }
  
  showBanner() {
    setTimeout(() => {
      this.banner.classList.add('show');
    }, 1000);
  }
  
  hideBanner() {
    this.banner.classList.remove('show');
  }
  
  acceptConsent() {
    localStorage.setItem(this.CONSENT_KEY, 'accepted');
    this.hideBanner();
    this.loadAnalytics();
  }
  
  declineConsent() {
    localStorage.setItem(this.CONSENT_KEY, 'declined');
    this.hideBanner();
  }
  
  loadAnalytics() {
    // Google Analytics 4
    // TODO: Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
    /*
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
    
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(gaScript);
    */
    
    // Microsoft Clarity
    // TODO: Replace 'XXXXXXXXXX' with your actual Clarity project ID
    /*
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "XXXXXXXXXX");
    */
    
    console.log('Analytics consent accepted. Add your GA4 and Clarity codes above.');
  }
}

// === Markdown Parser ===
class MarkdownParser {
  constructor() {
    this.rules = [
      // Headers
      { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
      { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
      { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
      
      // Bold and Italic
      { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
      { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
      { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
      
      // Links
      { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2">$1</a>' },
      
      // Images with optional alt text
      { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" loading="lazy" />' },
      
      // Code blocks
      { pattern: /```(\w+)?\n([\s\S]*?)```/g, replacement: '<pre><code>$2</code></pre>' },
      { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
      
      // Blockquotes
      { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
      
      // Lists
      { pattern: /^\* (.*$)/gim, replacement: '<li>$1</li>' },
      { pattern: /^- (.*$)/gim, replacement: '<li>$1</li>' },
      { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' },
      
      // Horizontal rule
      { pattern: /^---$/gim, replacement: '<hr />' },
      
      // Line breaks
      { pattern: /\n\n/g, replacement: '</p><p>' },
    ];
  }
  
  parse(markdown) {
    let html = markdown;
    
    // Apply all rules
    this.rules.forEach(rule => {
      html = html.replace(rule.pattern, rule.replacement);
    });
    
    // Wrap lists in ul/ol tags
    html = html.replace(/(<li>.*<\/li>)/s, (match) => {
      return '<ul>' + match + '</ul>';
    });
    
    // Wrap content in paragraphs if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  }
}

// === Blog Manager ===
class BlogManager {
  constructor() {
    this.posts = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.parser = new MarkdownParser();
    
    // Elements
    this.articlesGrid = document.querySelector('.articles-grid');
    this.searchInput = document.getElementById('blog-search');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    
    if (this.articlesGrid) {
      this.init();
    }
  }
  
  async init() {
    await this.loadPosts();
    this.renderPosts();
    this.setupEventListeners();
  }
  
  async loadPosts() {
    // In a real implementation, this would fetch from your blog directory
    // For now, using sample data structure
    this.posts = [
      {
        id: 'ai-research-methods',
        title: 'AI-Assisted Research Methods',
        date: '2025-01-15',
        topic: 'AI Research',
        excerpt: 'Exploring how AI tools can enhance qualitative research while maintaining ethical standards and human insight.',
        image: '/images/blog/ai-research.jpg',
        imageAlt: 'Visualization of AI-assisted research workflow',
        slug: 'ai-research-methods'
      },
      {
        id: 'inclusive-design-ai',
        title: 'Inclusive Design in AI Products',
        date: '2025-01-08',
        topic: 'Inclusive Design',
        excerpt: 'Key considerations for ensuring AI products serve diverse users and communities equitably.',
        image: '/images/blog/inclusive-design.jpg',
        imageAlt: 'Diverse users interacting with AI interfaces',
        slug: 'inclusive-design-ai'
      },
      {
        id: 'conversational-design-patterns',
        title: 'Conversational Design Patterns',
        date: '2025-01-02',
        topic: 'Conversational Design',
        excerpt: 'Practical patterns for designing natural, helpful conversations with AI systems.',
        image: '/images/blog/conversational-design.jpg',
        imageAlt: 'Chat interface showing conversational flow',
        slug: 'conversational-design-patterns'
      }
    ];
  }
  
  renderPosts(posts = this.posts) {
    if (!this.articlesGrid) return;
    
    const filteredPosts = this.filterAndSearch(posts);
    
    if (filteredPosts.length === 0) {
      this.articlesGrid.innerHTML = '<p>No articles found matching your criteria.</p>';
      return;
    }
    
    this.articlesGrid.innerHTML = filteredPosts.map(post => `
      <article class="article-card">
        <img 
          src="${post.image}" 
          alt="${post.imageAlt}"
          class="article-image"
          loading="lazy"
          onerror="this.src='/images/placeholder.jpg'"
        />
        <div class="article-content">
          <div class="article-meta">
            <time datetime="${post.date}">${this.formatDate(post.date)}</time>
            <span class="article-topic">${post.topic}</span>
          </div>
          <h3><a href="/blog/${post.slug}.html">${post.title}</a></h3>
          <p class="article-excerpt">${post.excerpt}</p>
          <a href="/blog/${post.slug}.html" class="read-more">Read article</a>
        </div>
      </article>
    `).join('');
  }
  
  filterAndSearch(posts) {
    let filtered = posts;
    
    // Apply topic filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(post => 
        post.topic.toLowerCase() === this.currentFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.topic.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }
  
  setupEventListeners() {
    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', debounce((e) => {
        this.searchQuery = e.target.value;
        this.renderPosts();
      }, 300));
    }
    
    // Filters
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderPosts();
      });
    });
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

// === Blog Post Renderer ===
class BlogPostRenderer {
  constructor() {
    this.postContent = document.getElementById('post-content');
    this.parser = new MarkdownParser();
    
    if (this.postContent) {
      this.init();
    }
  }
  
  async init() {
    const slug = this.getSlugFromURL();
    if (slug) {
      await this.loadPost(slug);
    }
  }
  
  getSlugFromURL() {
    const path = window.location.pathname;
    const match = path.match(/\/blog\/(.+)\.html/);
    return match ? match[1] : null;
  }
  
  async loadPost(slug) {
    try {
      // Attempt to load markdown file
      const response = await fetch(`/blog/${slug}.md`);
      
      if (!response.ok) {
        throw new Error('Post not found');
      }
      
      const markdown = await response.text();
      const html = this.parser.parse(markdown);
      this.postContent.innerHTML = html;
      
      // Process images for responsive srcset
      this.processImages();
      
    } catch (error) {
      console.error('Error loading blog post:', error);
      this.postContent.innerHTML = `
        <p>Sorry, this article couldn't be loaded. Please check back later.</p>
        <p><a href="/blog.html">Return to blog index</a></p>
      `;
    }
  }
  
  processImages() {
    const images = this.postContent.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      const baseName = src.replace(/\.[^/.]+$/, ''); // Remove extension
      
      // Add responsive srcset
      img.setAttribute('srcset', `
        ${baseName}-300.jpg 300w,
        ${baseName}-600.jpg 600w,
        ${baseName}-900.jpg 900w,
        ${baseName}-1200.jpg 1200w,
        ${baseName}-1500.jpg 1500w
      `);
      
      img.setAttribute('sizes', `
        (max-width: 600px) 300px,
        (max-width: 900px) 600px,
        (max-width: 1200px) 900px,
        (max-width: 1500px) 1200px,
        1500px
      `);
    });
  }
}

// === Contact Form Handler ===
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.honeypot = document.getElementById('website');
    this.submitButton = this.form?.querySelector('.submit-button');
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    // Check honeypot
    if (this.honeypot && this.honeypot.value) {
      console.log('Spam detected');
      return;
    }
    
    // Get form data
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: 'Website Contact: ' + formData.get('subject'),
      message: this.sanitizeText(formData.get('message'))
    };
    
    // Validate
    if (!this.validateForm(data)) {
      this.showMessage('Please fill in all required fields correctly.', 'error');
      return;
    }
    
    // Disable submit button
    this.submitButton.disabled = true;
    this.submitButton.textContent = 'Sending...';
    
    try {
      // TODO: Replace with your actual form handling endpoint
      // This could be a serverless function, PHP script, or third-party service
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        this.showMessage('Thank you! Your message has been sent.', 'success');
        this.form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage('Sorry, there was an error sending your message. Please try emailing directly via LinkedIn.', 'error');
    } finally {
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Send Message';
    }
  }
  
  validateForm(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }
    
    // Required fields
    if (!data.name || !data.email || !data.message) {
      return false;
    }
    
    return true;
  }
  
  sanitizeText(text) {
    // Remove any HTML tags and script content
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
  }
  
  showMessage(message, type) {
    // Remove existing status messages
    const existingStatus = this.form.querySelector('.form-status');
    if (existingStatus) {
      existingStatus.remove();
    }
    
    // Create new status message
    const statusDiv = document.createElement('div');
    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;
    statusDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    
    this.form.appendChild(statusDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      statusDiv.remove();
    }, 5000);
  }
}

// === Active Navigation Link ===
class NavigationHighlighter {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.currentPath = window.location.pathname;
    
    if (this.navLinks.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Exact match or starts with (for blog posts)
      if (this.currentPath === href || 
          (href !== '/' && this.currentPath.startsWith(href.replace('.html', '')))) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }
}

// === Smooth Scroll for Anchor Links ===
class SmoothScroll {
  constructor() {
    this.anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    if (this.anchorLinks.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update focus for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      });
    });
  }
}

// === Initialize Everything on DOM Ready ===
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
  new PrivacyConsent();
  new BlogManager();
  new BlogPostRenderer();
  new ContactForm();
  new NavigationHighlighter();
  new SmoothScroll();
  
  // Add reCAPTCHA v3
  // TODO: Add your reCAPTCHA site key
  /*
  const recaptchaScript = document.createElement('script');
  recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY';
  document.head.appendChild(recaptchaScript);
  */
});

// === Service Worker Registration (for PWA support) ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you have a service worker
    // navigator.serviceWorker.register('/sw.js');
  });
}
