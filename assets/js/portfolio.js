// ============================================================================
// Portfolio — interactions
// Theme toggle (shared 'theme' key with the blog), mobile nav, typewriter,
// scroll reveal, scroll-spy, back-to-top.
// ============================================================================

(function () {
    'use strict';

    // ------------------------------------------------------------------
    // Theme
    // ------------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    // ------------------------------------------------------------------
    // Mobile navigation
    // ------------------------------------------------------------------
    const burger = document.getElementById('navBurger');
    const navMenu = document.getElementById('navMenu');

    burger.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // ------------------------------------------------------------------
    // Navbar shadow + back-to-top visibility
    // ------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ------------------------------------------------------------------
    // Typewriter
    // ------------------------------------------------------------------
    const roles = [
        'AI Engineer',
        'LLM & RAG Developer',
        'NLP Researcher',
        'Machine Learning Enthusiast'
    ];
    const typewriter = document.getElementById('typewriter');
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const current = roles[roleIndex];

        if (deleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typewriter.textContent = current.slice(0, charIndex);

        let delay = deleting ? 40 : 85;

        if (!deleting && charIndex === current.length) {
            delay = 2200;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();

    // ------------------------------------------------------------------
    // Scroll reveal
    // ------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i % 6, 4) * 0.07}s`;
            observer.observe(el);
        });
    } else {
        revealElements.forEach((el) => el.classList.add('visible'));
    }

    // ------------------------------------------------------------------
    // Scroll-spy — highlight the nav link of the section in view
    // ------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${entry.target.id}`
                        );
                    });
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );

        sections.forEach((section) => spy.observe(section));
    }
})();
