// ===================================
// STAGGERED TEXT REVEAL ON SCROLL
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.3, // Element must be 30% visible (was 0.2)
        rootMargin: '0px 0px -150px 0px' // Trigger 150px before bottom of viewport (was -100px)
    };
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with reveal-text class
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Split text animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        const words = text.split(' ');
        heroTitle.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.classList.add('split-text');
            span.textContent = word;
            span.style.animationDelay = `${index * 0.1}s`;
            heroTitle.appendChild(span);
            
            // Add space after each word except the last
            if (index < words.length - 1) {
                heroTitle.appendChild(document.createTextNode(' '));
            }
        });
        
        // Trigger animation
        setTimeout(() => {
            const spans = heroTitle.querySelectorAll('.split-text');
            spans.forEach(span => span.classList.add('animate'));
        }, 300);
    }
});

// ===================================
// TYPEWRITER EFFECT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const heroStatement = document.querySelector('.hero-statement');
    
    if (heroStatement) {
        const originalText = heroStatement.textContent;
        const typingSpeed = 50; // milliseconds per character
        const blinkDuration = 2100; // 3 blinks at 0.7s each
        
        // Clear the text and add typewriter class
        heroStatement.textContent = '';
        heroStatement.classList.add('typewriter');
        
        let charIndex = 0;
        
        function typeCharacter() {
            if (charIndex < originalText.length) {
                heroStatement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, typingSpeed);
            } else {
                // Typing complete - add finished class for cursor blinking
                heroStatement.classList.add('finished');
                
                // Remove cursor after blinking is done
                setTimeout(() => {
                    heroStatement.classList.remove('typewriter', 'finished');
                }, blinkDuration);
            }
        }
        
        // Start typing after a brief delay
        setTimeout(typeCharacter, 500);
    }
});

// ===================================
// COPY EMAIL TO CLIPBOARD
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.querySelector('.copy-email-btn');
    const notification = document.getElementById('copyNotification');
    
    if (copyBtn && notification) {
        copyBtn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            
            // Copy to clipboard
            navigator.clipboard.writeText(email).then(function() {
                // Show notification
                notification.classList.add('show');
                
                // Change button text
                const copyText = copyBtn.querySelector('.copy-text');
                const originalText = copyText.textContent;
                copyText.textContent = 'Copied!';
                
                // Reset after 2 seconds
                setTimeout(function() {
                    notification.classList.remove('show');
                    copyText.textContent = originalText;
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
            });
        });
    }
});

// ===================================
// PORTFOLIO FILTERING
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-enhanced-item');
    
    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        // Fade in animation
                        item.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            // Toggle active class on button
            menuToggle.classList.toggle('active');
            
            // Toggle active class on nav
            nav.classList.toggle('active');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking on a nav link (mobile)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 768 && nav.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }, 250);
        });
    }
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Select all links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll if href is not just "#"
            if (href !== '#' && href.length > 1) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });
});

// ===================================
// ACTIVE NAV LINK HIGHLIGHTING
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Get all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Get the href attribute
        const linkPage = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Create and add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Update progress bar on scroll
    function updateProgressBar() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Initial call

    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe grid items for stagger animation
    const gridItems = document.querySelectorAll('.focus-home-item, .edge-item, .criteria-simple-item');
    gridItems.forEach(item => {
        item.classList.add('animate-on-scroll');
        observer.observe(item);
    });
});
