// DOM Elements
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// Smooth Scroll for Navigation Links (with "physics" feel delay if needed, keeping native smooth for now)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Active Nav Link
const observerOptions = {
    threshold: 0.2,
    rootMargin: "-20% 0px -50% 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Highlight active nav link
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Staggered Reveal Animation
const revealElements = document.querySelectorAll('.card, .timeline-item, .section-title, .skill-tag, .contact-item, .about-text');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {

            // Add slight delay based on index if siblings are revealing together
            // This is a simple implementation of staggering
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters full view
});

revealElements.forEach(el => {
    el.classList.add('hidden-reveal'); // Ensure transparency initially handled by CSS if needed
    // We already handle opacity: 0 in CSS classes like .section-title, but generic elements might need it:
    if (!el.classList.contains('section-title')) {
        el.style.opacity = '0'; // Force hide initially for JS fade in
    }
    revealObserver.observe(el);
});

// Dynamic Staggering Logic (Optional Refinement)
// If we wanted strict sequential staggering, we'd group elements by container.
// For now, the natural scroll speed + CSS duration gives a good enough "flow".
