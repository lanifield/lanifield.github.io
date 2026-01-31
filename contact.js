// ===================================
// CONTACT FORM HANDLING
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('form-success');
    const failureMessage = document.getElementById('form-failure');
    const sendAnotherBtn = document.getElementById('send-another');
    const tryAgainBtn = document.getElementById('try-again');
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(`${this.id}-error`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Focus first error
            const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        // Honeypot check
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value) {
            console.warn('Bot detected');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            privacy: document.getElementById('privacy').checked,
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        window.showLoading(submitBtn);
        
        try {
            // Add reCAPTCHA token if enabled
            // const recaptchaToken = await getRecaptchaToken();
            // formData.recaptcha = recaptchaToken;
            
            // Submit form (replace with your endpoint)
            const response = await submitForm(formData);
            
            if (response.success) {
                // Show success message
                form.style.display = 'none';
                successMessage.removeAttribute('hidden');
                
                // Announce to screen readers
                announceMessage('Message sent successfully');
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            form.style.display = 'none';
            failureMessage.removeAttribute('hidden');
            
            const errorMessageEl = document.getElementById('error-message');
            if (errorMessageEl) {
                errorMessageEl.textContent = error.message || 'There was a problem sending your message. Please try again or contact me directly via email.';
            }
            
            // Announce to screen readers
            announceMessage('Error sending message');
        } finally {
            window.hideLoading(submitBtn);
        }
    });
    
    // Send another message
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function() {
            form.reset();
            form.style.display = '';
            successMessage.setAttribute('hidden', '');
            
            // Clear all errors
            form.querySelectorAll('.has-error').forEach(group => {
                group.classList.remove('has-error');
            });
            form.querySelectorAll('.form-error').forEach(error => {
                error.textContent = '';
            });
            
            // Focus first field
            document.getElementById('name').focus();
        });
    }
    
    // Try again
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            form.style.display = '';
            failureMessage.setAttribute('hidden', '');
            
            // Focus first field
            document.getElementById('name').focus();
        });
    }
}

// Field validation
function validateField(field) {
    const fieldGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (!fieldGroup || !errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (field.hasAttribute('required') || field.hasAttribute('aria-required')) {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                errorMessage = 'This field is required';
            }
        } else if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
    }
    
    // Email validation
    if (isValid && field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Message length check
    if (isValid && field.id === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Please provide more details (at least 10 characters)';
        }
    }
    
    // Update UI
    if (isValid) {
        fieldGroup.classList.remove('has-error');
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');
    } else {
        fieldGroup.classList.add('has-error');
        errorElement.textContent = errorMessage;
        field.setAttribute('aria-invalid', 'true');
    }
    
    return isValid;
}

// Get reCAPTCHA token (uncomment when ready to use)
/*
async function getRecaptchaToken() {
    return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
            grecaptcha.execute('YOUR_SITE_KEY', { action: 'submit' })
                .then(token => resolve(token))
                .catch(error => reject(error));
        });
    });
}
*/

// Submit form to backend
async function submitForm(data) {
    // REPLACE THIS WITH YOUR ACTUAL ENDPOINT
    // Example implementations:
    
    // Option 1: FormSpree
    /*
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
    */
    
    // Option 2: Your own backend
    /*
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
    */
    
    // Option 3: Netlify Forms

    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    });
    
    if (response.ok) {
        return { success: true };
    } else {
        throw new Error('Submission failed');
    }

    
    // DEMO MODE - Remove this and use one of the options above
    /*
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', data);
            resolve({ success: true });
        }, 2000);
    });
    */
}

// Announce to screen readers
function announceMessage(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}
