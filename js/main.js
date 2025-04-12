// Main JavaScript for Injector Care Website

document.addEventListener('DOMContentLoaded', function() {
    // Safe element access function to prevent null errors
    function safeGetElement(id) {
        const element = document.getElementById(id);
        return element;
    }
    
    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a nav link (on mobile)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data - using safe access to prevent null errors
            const name = safeGetElement('name') ? safeGetElement('name').value : '';
            const email = safeGetElement('email') ? safeGetElement('email').value : '';
            const phone = safeGetElement('phone') ? safeGetElement('phone').value : '';
            const message = safeGetElement('message') ? safeGetElement('message').value : '';
            
            // For demonstration purposes, just log the data
            console.log('Form submission:', { name, email, phone, message });
            
            // Here you would typically send the data to a server
            // For now, just show a success message
            alert('Thank you for your message! We will contact you shortly.');
            contactForm.reset();
        });
    }
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
