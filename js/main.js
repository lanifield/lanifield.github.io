// ===================================
// MAIN JAVASCRIPT - Global Functionality
// ===================================

document.addEventListener('DOMContentLoaded', function() {
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
    const banner = document.getElementById('cookie-banner');
    const modal = document.getElementById('cookie-modal');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const settingsBtn = document.getElementById('cookie-settings');
    const modalClose = document.querySelector('.modal-close');
    const savePrefsBtn = document.getElementById('save-preferences');
    const acceptAllModal = document.getElementById('modal-accept-all');
    
    // Check if user has already made a choice
    const cookieConsent = getCookie('cookie_consent');
    
    if (!cookieConsent && banner) {
        // Show banner after a short delay
        setTimeout(() => {
            banner.classList.add('active');
        }, 1000);
    }
    
    // Accept all cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            acceptAllCookies();
            banner.classList.remove('active');
        });
    }
    
    // Decline cookies
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            declineAllCookies();
            banner.classList.remove('active');
        });
    }
    
    // Open settings modal
    if (settingsBtn && modal) {
        settingsBtn.addEventListener('click', function() {
            modal.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    if (modalClose && modal) {
        modalClose.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    // Save preferences
    if (savePrefsBtn && modal) {
        savePrefsBtn.addEventListener('click', function() {
            savePreferences();
            closeModal(modal);
            banner.classList.remove('active');
        });
    }
    
    // Accept all from modal
    if (acceptAllModal && modal) {
        acceptAllModal.addEventListener('click', function() {
            acceptAllCookies();
            closeModal(modal);
            banner.classList.remove('active');
        });
    }
    
    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
}

function closeModal(modal) {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
}

function acceptAllCookies() {
    setCookie('cookie_consent', 'all', 365);
    setCookie('analytics_cookies', 'true', 365);
    
    // Initialize analytics here
    initAnalytics();
    console.log('All cookies accepted');
}

function declineAllCookies() {
    setCookie('cookie_consent', 'essential', 365);
    setCookie('analytics_cookies', 'false', 365);
    console.log('Non-essential cookies declined');
}

function savePreferences() {
    const analyticsConsent = document.getElementById('analytics-cookies').checked;
    
    setCookie('cookie_consent', 'custom', 365);
    setCookie('analytics_cookies', analyticsConsent ? 'true' : 'false', 365);
    
    // Initialize analytics if consented
    if (analyticsConsent) {
        initAnalytics();
    }
    
    console.log('Cookie preferences saved');
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
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
