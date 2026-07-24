document.addEventListener("DOMContentLoaded", () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    if(preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="ph-fill ph-sun"></i>';
        }
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="ph-fill ph-moon"></i>';
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="ph-fill ph-sun"></i>';
            }
        });
    }

    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', function(e) {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const clickables = document.querySelectorAll('a, button, .icon-link-btn, input, textarea');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll("section, main");
    const navLinks = document.querySelectorAll(".nav-links li a");

    window.addEventListener("scroll", () => {
        let current = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 100, // Offset for top padding
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mouse movement effect on glass cards (3D tilt effect)
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3; // max rotation degrees
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });

    // Contact Form Handle
    const contactForm = document.getElementById("contactForm");
    if(contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const btn = document.getElementById("submitBtn");
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            fetch("https://formsubmit.co/ajax/aayushparmar0007@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                // Visual feedback
                btn.innerHTML = 'Sent Successfully! <i class="ph-fill ph-check-circle ms-2"></i>';
                btn.classList.replace("btn-primary", "btn-success");
                btn.style.background = "#22c55e";
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.replace("btn-success", "btn-primary");
                    btn.style.background = "";
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            })
            .catch(error => {
                console.error(error);
                btn.innerHTML = 'Failed. Try Again';
                btn.disabled = false;
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 3000);
            });
        });
    }
});
