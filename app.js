// DOM Elements
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const downloadCvBtn = document.getElementById('download-cv');
const loadingOverlay = document.getElementById('loading-overlay');

// Add notification styles immediately
function addNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: var(--space-16);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
                background: var(--color-surface);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification--success {
                background: rgba(var(--color-success-rgb), 0.15);
                color: var(--color-success);
                border: 1px solid rgba(var(--color-success-rgb), 0.25);
            }
            
            .notification--error {
                background: rgba(var(--color-error-rgb), 0.15);
                color: var(--color-error);
                border: 1px solid rgba(var(--color-error-rgb), 0.25);
            }
            
            .notification--info {
                background: rgba(var(--color-info-rgb), 0.15);
                color: var(--color-info);
                border: 1px solid rgba(var(--color-info-rgb), 0.25);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-12);
            }
            
            .notification-message {
                font-weight: var(--font-weight-medium);
                font-size: var(--font-size-sm);
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                transition: opacity var(--duration-fast) var(--ease-standard);
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-color-scheme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Mobile menu toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('show');
    mobileMenuToggle.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('show')) {
                    toggleMobileMenu();
                }
                
                // Update active link
                updateActiveNavLink(link);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Highlight active section on scroll
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Navbar scroll effects
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Contact form validation and submission
function setupContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading
        showLoading();
        
        // Simulate form submission
        setTimeout(() => {
            hideLoading();
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Download CV functionality
function setupDownloadCV() {
    downloadCvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show loading
        showLoading();
        
        // Show immediate feedback
        downloadCvBtn.textContent = 'Preparing CV...';
        downloadCvBtn.disabled = true;
        
        // Simulate PDF generation/download
        setTimeout(() => {
            hideLoading();
            
            // Reset button
            downloadCvBtn.textContent = 'Download CV';
            downloadCvBtn.disabled = false;
            
            // Show notification with more detailed message
            showNotification('CV download functionality will be implemented soon. For now, you can print this page or contact me directly!', 'info');
            
            // In a real application, you would generate and download the PDF here
            // Example implementation:
            // const element = document.body;
            // html2pdf().from(element).save('Anuj_Patel_CV.pdf');
        }, 1500);
    });
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.add('show');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Show notification
function showNotification(message, type = 'info') {
    // Ensure styles are added
    addNotificationStyles();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimer);
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll('.timeline-item, .skill-category, .education-item, .recommendation-item');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Keyboard navigation support
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
        
        // Enter key submits forms
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
            e.target.click();
        }
    });
}

// Initialize tooltips for skill tags
function setupSkillTooltips() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'translateY(-2px)';
        });
    });
}

// Handle print functionality
function setupPrintHandling() {
    window.addEventListener('beforeprint', () => {
        // Ensure all sections are visible for printing
        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach(el => {
            el.style.display = 'block';
        });
    });
    
    window.addEventListener('afterprint', () => {
        // Restore original state after printing
        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach(el => {
            el.style.display = 'none';
        });
    });
}

// Handle window resize
function setupResizeHandler() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
            
            // Recalculate positions if needed
            highlightActiveSection();
        }, 250);
    });
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize application
function initializeApp() {
    try {
        // Add notification styles first
        addNotificationStyles();
        
        // Core functionality
        initializeTheme();
        setupSmoothScrolling();
        setupContactForm();
        setupDownloadCV();
        
        // UI enhancements
        setupIntersectionObserver();
        setupKeyboardNavigation();
        setupSkillTooltips();
        setupPrintHandling();
        setupResizeHandler();
        
        // Event listeners
        themeToggle.addEventListener('click', toggleTheme);
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Throttled scroll events
        const throttledScroll = throttle(() => {
            handleNavbarScroll();
            highlightActiveSection();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', throttledScroll);
        
        // Initial setup
        handleNavbarScroll();
        highlightActiveSection();
        
        // Hide loading overlay if it was shown
        setTimeout(() => {
            hideLoading();
        }, 500);
        
        console.log('Anuj Patel CV website initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing application:', error);
        
        // Show error notification if possible
        setTimeout(() => {
            showNotification('Website loaded with some limitations. Please refresh if you experience issues.', 'error');
        }, 1000);
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        isValidEmail,
        showNotification,
        hideNotification
    };
}