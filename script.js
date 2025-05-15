// Main JavaScript for Katip Çelebi Anadolu İmam Hatip Lisesi Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('show');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav.classList.contains('show') && !event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            mainNav.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Handle Image Slider with Fade Effect
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    
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
        
        // Pause slider on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
        
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
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed header
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mainNav.classList.contains('show')) {
                        mainNav.classList.remove('show');
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
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
    const animateElements = document.querySelectorAll('.news-card, .stat-box, .link-card, .contact-item, .announcement-item');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window && animateElements.length > 0) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px"
        };
        
        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) return;
                
                // Add staggered delay based on element index within its parent
                const siblings = Array.from(entry.target.parentElement.children);
                const siblingIndex = siblings.indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('appear');
                }, siblingIndex * 100); // 100ms staggered delay
                
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
            .news-card.hidden, .stat-box.hidden, .link-card.hidden, .contact-item.hidden, .announcement-item.hidden {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .news-card.appear, .stat-box.appear, .link-card.appear, .contact-item.appear, .announcement-item.appear {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add back-to-top button functionality
    const addBackToTopButton = () => {
        // Create the button element
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        document.body.appendChild(backToTopBtn);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top on click with smooth animation
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    addBackToTopButton();
    
    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add hover effect to news cards for better UX
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        const image = card.querySelector('.news-img img');
        const initialTransform = 'scale(1)';
        const hoverTransform = 'scale(1.1)';
        
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = hoverTransform;
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = initialTransform;
            });
        }
    });
}); 