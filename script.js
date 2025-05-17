// Main JavaScript for Katip Çelebi Anadolu İmam Hatip Lisesi Website

document.addEventListener('DOMContentLoaded', function() {
    // Apply dark mode settings as early as possible
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    // Apply saved theme or device preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (darkModeToggle) {
            darkModeToggle.querySelector('i').className = 'fas fa-sun';
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (darkModeToggle) {
            darkModeToggle.querySelector('i').className = 'fas fa-moon';
        }
    }
    
    // Mobile device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent document click from firing immediately
            mainNav.classList.toggle('show');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Add overlay to page when menu is open
                addMenuOverlay();
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Remove overlay when menu is closed
                removeMenuOverlay();
            }
        });
        
        // Add menu overlay function
        function addMenuOverlay() {
            // Only add if it doesn't exist
            if (!document.querySelector('.menu-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'menu-overlay';
                document.body.appendChild(overlay);
                
                // Add CSS for overlay
                const style = document.createElement('style');
                style.textContent = `
                    .menu-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 90;
                        animation: fadeIn 0.3s ease;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
                
                // Add click event to close menu when overlay is clicked
                overlay.addEventListener('click', function() {
                    mainNav.classList.remove('show');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    removeMenuOverlay();
                });
            }
        }
        
        // Remove menu overlay function
        function removeMenuOverlay() {
            const overlay = document.querySelector('.menu-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
        
        // Close mobile menu when menu items are clicked
        const menuItems = mainNav.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    removeMenuOverlay();
                }
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav && mainNav.classList.contains('show') && 
            !event.target.closest('nav') && 
            !event.target.closest('.mobile-menu-btn')) {
            mainNav.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            removeMenuOverlay();
        }
    });
    
    // Handle Image Slider with Fade Effect
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (slides.length > 1) {
        // Create slider navigation dots
        const slider = document.querySelector('.slider');
        const sliderDots = document.createElement('div');
        sliderDots.className = 'slider-dots';
        
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.addEventListener('click', () => goToSlide(index));
            sliderDots.appendChild(dot);
        });
        
        slider.appendChild(sliderDots);
        
        // Add slider navigation arrows
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-nav prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', prevSlide);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-nav next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', nextSlide);
        
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);
        
        // Initialize slider interval
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Functions for slider control
        function goToSlide(index) {
            // Reset interval when manually navigating
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
            
            // Hide current slide
            slides[currentSlide].classList.remove('active');
            document.querySelectorAll('.slider-dots .dot')[currentSlide].classList.remove('active');
            
            // Update current slide
            currentSlide = index;
            
            // Show new slide
            slides[currentSlide].classList.add('active');
            document.querySelectorAll('.slider-dots .dot')[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }
        
        function prevSlide() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }
        
        // Touch events for mobile swipe
        if (slider) {
            // Touch start event
            slider.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            // Touch end event
            slider.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            // Handle swipe direction
            function handleSwipe() {
                const swipeThreshold = 50; // Minimum distance for swipe
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - go to next slide
                    nextSlide();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - go to previous slide
                    prevSlide();
                }
            }
        }
        
        // Pause slider on hover for desktop devices
        if (!isMobile) {
            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Add slider styles
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            .slider {
                position: relative;
            }
            
            .slider-dots {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10;
                display: flex;
                gap: 10px;
            }
            
            .dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .dot.active {
                background-color: #fff;
                transform: scale(1.2);
            }
            
            .slider-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.3);
                color: white;
                border: none;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                opacity: 0;
            }
            
            .slider:hover .slider-nav {
                opacity: 1;
            }
            
            .slider-nav:hover {
                background-color: rgba(0, 0, 0, 0.6);
            }
            
            .prev {
                left: 20px;
            }
            
            .next {
                right: 20px;
            }
            
            @media (max-width: 768px) {
                .slider-nav {
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                    opacity: 1;
                }
                
                .prev {
                    left: 10px;
                }
                
                .next {
                    right: 10px;
                }
                
                .dot {
                    width: 10px;
                    height: 10px;
                }
            }
        `;
        document.head.appendChild(sliderStyle);
    }
    
    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only process internal links (not "#" alone)
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Different offset for mobile vs desktop
                    const headerOffset = isMobile ? 60 : 80;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('show')) {
                        mainNav.classList.remove('show');
                        if (mobileMenuBtn) {
                            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                        }
                        removeMenuOverlay();
                    }
                }
            }
        });
    });
    
    // Sticky Header with Progress Indicator
    const header = document.querySelector('header');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    
    if (header) {
        document.body.appendChild(progressBar);
        
        // Add progress bar styles
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(to right, #4caf50, #2c4a8c);
                width: 0%;
                z-index: 1000;
                transition: width 0.1s;
            }
        `;
        document.head.appendChild(progressStyle);
        
        // Update progress bar and handle sticky header
        window.addEventListener('scroll', () => {
            // Calculate scroll progress
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
            
            progressBar.style.width = scrollPercentage + '%';
            
            // Toggle sticky class
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }
    
    // Animate elements when they come into view with staggered effect
    const animateElements = document.querySelectorAll('.news-card, .stat-box, .link-card, .contact-item, .announcement-item, .activity-box, .gallery-item, .activity-card, .event-card');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window && animateElements.length > 0) {
        // Use different thresholds for mobile vs desktop
        const threshold = isMobile ? 0.05 : 0.15;
        // Use different rootMargin for mobile vs desktop - show animations earlier on mobile
        const rootMargin = isMobile ? "0px 0px -50px 0px" : "0px 0px -100px 0px";
        
        const appearOptions = {
            threshold: threshold,
            rootMargin: rootMargin
        };
        
        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) return;
                
                // Add staggered delay based on element index within its parent
                const siblings = Array.from(entry.target.parentElement.children);
                const siblingIndex = siblings.indexOf(entry.target);
                
                // Use shorter delays on mobile
                const delay = isMobile ? siblingIndex * 50 : siblingIndex * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('appear');
                }, delay);
                
                observer.unobserve(entry.target);
            });
        }, appearOptions);
        
        animateElements.forEach(element => {
            // Add initial hidden class
            element.classList.add('hidden');
            appearOnScroll.observe(element);
        });
        
        // Add CSS for animation classes
        const style = document.createElement('style');
        style.textContent = `
            .news-card.hidden, .stat-box.hidden, .link-card.hidden, .contact-item.hidden, .announcement-item.hidden,
            .activity-box.hidden, .gallery-item.hidden, .activity-card.hidden, .event-card.hidden {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
                will-change: opacity, transform;
            }
            
            .news-card.appear, .stat-box.appear, .link-card.appear, .contact-item.appear, .announcement-item.appear,
            .activity-box.appear, .gallery-item.appear, .activity-card.appear, .event-card.appear {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (max-width: 768px) {
                .news-card.hidden, .stat-box.hidden, .link-card.hidden, .contact-item.hidden, .announcement-item.hidden,
                .activity-box.hidden, .gallery-item.hidden, .activity-card.hidden, .event-card.hidden {
                    transform: translateY(20px);
                    transition: opacity 0.4s ease, transform 0.4s ease;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Sayaç animasyonu
    const statNumbers = document.querySelectorAll('.stat-box h3');
    
    // Sayfa yüklendiğinde stat-box görünür olduğunda
    function animateNumbers() {
        statNumbers.forEach(number => {
            const target = parseInt(number.innerText);
            const increment = target / 100;
            let current = 0;
            
            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    number.innerText = Math.ceil(current);
                    setTimeout(updateNumber, 10);
                } else {
                    number.innerText = target;
                }
            };
            
            updateNumber();
        });
    }
    
    // IntersectionObserver ile görünürlük kontrolü yaparak animasyonu başlat
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Sadece bir kez çalışsın
                if (!entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateNumbers();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    // Stats section'ı gözlemle
    const statsSection = document.querySelector('.stats-wrapper');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Back to top butonu
    const backToTop = document.createElement('a');
    backToTop.href = '#';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTop);
    
    // Add style for the back to top button on mobile devices
    if (isMobile) {
        const backToTopStyle = document.createElement('style');
        backToTopStyle.textContent = `
            .back-to-top {
                width: 40px;
                height: 40px;
                bottom: 20px;
                right: 20px;
                font-size: 1rem;
            }
            
            .back-to-top.show {
                opacity: 0.8;
                visibility: visible;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(backToTopStyle);
    }
    
    // Show back to top button when scrolled down
    window.addEventListener('scroll', function() {
        // Show back to top button sooner on mobile for better UX
        const showOffset = isMobile ? 200 : 300;
        
        if (window.pageYOffset > showOffset) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // Only track scroll position if there are sections and nav links
    if (sections.length && navLinks.length) {
        // Optimize scroll event with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    scrollTimeout = null;
                    
                    let current = '';
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.clientHeight;
                        
                        // Adjust the offset based on device type
                        const offset = isMobile ? 150 : 200;
                        
                        if (window.scrollY >= (sectionTop - offset)) {
                            current = section.getAttribute('id');
                        }
                    });
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${current}`) {
                            link.classList.add('active');
                        }
                    });
                }, 100); // Throttle to 100ms
            }
        });
    }
    
    // Optimize page load on mobile
    if (isMobile) {
        // Defer non-critical scripts and resources
        window.addEventListener('load', function() {
            // Add any deferred loading logic here
            console.log('Mobile optimizations loaded');
        });
    }
    
    // Dark Mode Toggle click handler
    if (darkModeToggle) {
        // Toggle theme when button is clicked
        darkModeToggle.addEventListener('click', function() {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            this.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            // Add transition class for smooth color changes
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 1000);
        });
    }
}); 