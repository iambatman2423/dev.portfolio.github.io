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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        if (themeToggle && currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="ph-fill ph-sun"></i>';
            themeToggle.setAttribute('aria-pressed', 'true');
        } else if (themeToggle) {
            themeToggle.innerHTML = '<i class="ph-fill ph-moon"></i>';
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="ph-fill ph-moon"></i>';
                themeToggle.setAttribute('aria-pressed', 'false');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="ph-fill ph-sun"></i>';
                themeToggle.setAttribute('aria-pressed', 'true');
            }
        });
    }

    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion.matches) {
        let cursorX = 0;
        let cursorY = 0;
        let cursorFrame = null;

        window.addEventListener('mousemove', function(e) {
            cursorX = e.clientX;
            cursorY = e.clientY;

            if (cursorFrame === null) {
                cursorFrame = window.requestAnimationFrame(() => {
                    cursorDot.style.left = `${cursorX}px`;
                    cursorDot.style.top = `${cursorY}px`;
                    cursorOutline.style.left = `${cursorX}px`;
                    cursorOutline.style.top = `${cursorY}px`;
                    cursorFrame = null;
                });
            }
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
    if (window.AOS) {
        window.AOS.init({
            duration: prefersReducedMotion.matches ? 0 : 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // Load public profile and recent event data without relying on third-party widgets.
    const githubActivity = document.getElementById('github-activity-data');
    if (githubActivity) {
        const reposElement = document.getElementById('github-repos');
        const eventsElement = document.getElementById('github-events');
        const latestElement = document.getElementById('github-latest');
        const statusElement = document.getElementById('github-status');

        const loadGitHubActivity = async () => {
            try {
                const headers = { 'Accept': 'application/vnd.github+json' };
                const [profileResponse, eventsResponse] = await Promise.all([
                    fetch('https://api.github.com/users/iambatman2423', { headers }),
                    fetch('https://api.github.com/users/iambatman2423/events/public?per_page=30', { headers })
                ]);

                if (!profileResponse.ok || !eventsResponse.ok) {
                    throw new Error(`GitHub API request failed (${profileResponse.status}/${eventsResponse.status})`);
                }

                const [profile, events] = await Promise.all([
                    profileResponse.json(),
                    eventsResponse.json()
                ]);

                if (!Number.isInteger(profile.public_repos) || !Array.isArray(events)) {
                    throw new Error('GitHub API returned an unexpected response');
                }

                reposElement.textContent = profile.public_repos.toLocaleString();
                eventsElement.textContent = events.length.toLocaleString();

                const latestEvent = events[0];
                if (latestEvent && latestEvent.type && latestEvent.created_at) {
                    const eventName = latestEvent.type.replace(/Event$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
                    const eventDate = new Date(latestEvent.created_at);
                    if (Number.isNaN(eventDate.getTime())) {
                        throw new Error('GitHub API returned an invalid activity date');
                    }
                    latestElement.textContent = `${eventName} · ${eventDate.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}`;
                } else {
                    latestElement.textContent = 'No recent public events';
                }

                statusElement.textContent = 'Live data from api.github.com. Event count reflects the latest response, not total contributions.';
            } catch (error) {
                console.error('Unable to load GitHub activity:', error);
                reposElement.textContent = 'Unavailable';
                eventsElement.textContent = 'Unavailable';
                latestElement.textContent = 'Unavailable';
                statusElement.textContent = 'Could not load live GitHub data. Use the profile link to view activity.';
            }
        };

        loadGitHubActivity();
    }

    // Active Navigation Link on Scroll
    const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
    const navTargets = navLinks
        .map(link => ({ link, target: document.getElementById(link.getAttribute('href').slice(1)) }))
        .filter(item => item.target);

    const updateActiveNavigation = () => {
        const activeItem = navTargets
            .filter(item => item.target.getBoundingClientRect().top <= 200)
            .at(-1) || navTargets[0];

        navTargets.forEach(({ link }) => {
            const isActive = link === activeItem?.link;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    window.addEventListener("scroll", updateActiveNavigation, { passive: true });
    updateActiveNavigation();

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.getElementById(href.slice(1));
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    // Contact Form Handle
    const contactForm = document.getElementById("contactForm");
    if(contactForm) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const btn = document.getElementById("submitBtn");
            const status = document.getElementById("form-status");
            if (!btn || !status) return;

            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.textContent = 'Sending...';
            status.textContent = 'Sending your message...';

            try {
                const response = await fetch("https://formsubmit.co/ajax/aayushparmar0007@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: document.getElementById("name").value.trim(),
                        email: document.getElementById("email").value.trim(),
                        message: document.getElementById("message").value.trim()
                    })
                });
                const data = await response.json();

                if (!response.ok || (data.success !== 'true' && data.success !== true)) {
                    throw new Error(data.message || `Form submission failed (${response.status})`);
                }

                status.textContent = 'Your message was sent successfully.';
                contactForm.reset();
            } catch (error) {
                console.error(error);
                status.textContent = 'We could not confirm delivery. Please try again or email directly.';
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }
});
