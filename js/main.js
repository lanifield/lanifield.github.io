// ===================================
// MAIN JAVASCRIPT - Global Functionality
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialization');
    // Initialize all components
    initNavigation();
    initCookieConsent();
    initEmailReveal();
    initSkillToggles();
    initAnimations();
});

// ===================================
// NAVIGATION
// ===================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===================================
// COOKIE CONSENT MANAGEMENT
// ===================================
function initCookieConsent() {
  
  const COOKIE_NAME = 'cookie_consent';
  const COOKIE_DURATION = 365; // days
  
  // Your tracking IDs
  const GTAG_ID = 'G-GMG51T4XDC'; // Replace with your Google Analytics ID
  const CLARITY_ID = 'vb10n4ezgq'; // Replace with your Clarity project ID
  
  // Get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  // Set cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }
  
  // Initialize Google Analytics
  function initGoogleAnalytics() {
    // Create gtag script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
    document.head.appendChild(gtagScript);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GTAG_ID, {
      'anonymize_ip': true, // Privacy-friendly
      'cookie_flags': 'SameSite=None;Secure'
    });
    
    console.log('Google Analytics initialized');
  }
  
  // Initialize Microsoft Clarity
  function initClarity() {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_ID);
    
    console.log('Microsoft Clarity initialized');
  }
  
  // Handle consent choice
  function handleConsent(choice) {
    if (choice !== 'none') {
      setCookie(COOKIE_NAME, choice, COOKIE_DURATION);
    }
    hideBanner();
    
    if (choice === 'essential-analytics') {
      initGoogleAnalytics();
      initClarity();
    } else if (choice === 'essential-only') {
      console.log('Only essential cookies accepted');
      // Essential cookies only - no analytics
    } else if (choice === 'none') {
      console.log('No cookies accepted');
      // User rejected all cookies
      // You might want to handle this case differently
    }
  }
  
  // Show banner
  function showBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.add('show');
    }
  }
  
  // Hide banner
  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('show');
    }
  }
  
  // Initialize on page load
  function init() {
    const consent = getCookie(COOKIE_NAME);
    
    if (consent === 'essential-analytics') {
      // User previously accepted analytics
      initGoogleAnalytics();
      initClarity();
    } else if (!consent) {
      // No consent recorded - show banner
      showBanner();
      
      // Add event listeners to buttons
      document.getElementById('cookie-essential-only')?.addEventListener('click', function() {
        handleConsent('essential-only');
      });
        
      document.getElementById('cookie-essential-analytics')?.addEventListener('click', function() {
        handleConsent('essential-analytics');
      });
      
      document.getElementById('cookie-none')?.addEventListener('click', function() {
        handleConsent('none');
      });
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// ===================================
// EMAIL REVEAL (Anti-spam)
// ===================================
function initEmailReveal() {
    const emailLink = document.getElementById('email-reveal');
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const user = this.getAttribute('data-user');
            const domain = this.getAttribute('data-domain');
            const email = `${user}@${domain}`;
            
            this.href = `mailto:${email}`;
            this.textContent = email;
            this.removeAttribute('data-user');
            this.removeAttribute('data-domain');
        });
    }
}

// ===================================
// SKILL CARD TOGGLES (About Page)
// ===================================
function initSkillToggles() {
    const toggleButtons = document.querySelectorAll('.skill-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const targetId = this.getAttribute('aria-controls');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                // Toggle aria-expanded
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Toggle content visibility
                if (isExpanded) {
                    targetContent.setAttribute('hidden', '');
                    this.querySelector('span').textContent = 'Learn More';
                } else {
                    targetContent.removeAttribute('hidden');
                    this.querySelector('span').textContent = 'Show Less';
                }
            }
        });
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll('.journal-card, .skill-card, .value-card, .faq-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignore if it's just "#" or empty
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Set focus for accessibility
            target.focus();
        }
    });
});

// ===================================
// LOADING STATES
// ===================================
function showLoading(button) {
    button.disabled = true;
    button.querySelector('.btn-text').setAttribute('hidden', '');
    button.querySelector('.btn-loading').removeAttribute('hidden');
}

function hideLoading(button) {
    button.disabled = false;
    button.querySelector('.btn-text').removeAttribute('hidden');
    button.querySelector('.btn-loading').setAttribute('hidden', '');
}

// Export functions for use in other scripts
window.showLoading = showLoading;
window.hideLoading = hideLoading;
