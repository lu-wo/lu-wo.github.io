/* ============================================
   LUKAS WOLF — MAIN JS
   Vanilla JS, no dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------
  // 1. MOBILE NAV TOGGLE
  // ----------------------------------------
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    const closeNav = () => {
      nav.classList.remove('nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('nav--open') && !nav.contains(e.target)) {
        closeNav();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  // ----------------------------------------
  // 2. SCROLL-TRIGGERED FADE-INS
  // ----------------------------------------
  const fadeEls = document.querySelectorAll('.fade-in-up');

  if (fadeEls.length && !prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    fadeEls.forEach(el => el.classList.add('is-visible'));
  }

  // ----------------------------------------
  // 3. ACTIVE NAV LINK TRACKING
  // ----------------------------------------
  const sections = document.querySelectorAll('main > section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  if (sections.length && navAnchors.length) {
    // Delay observer activation so hash-navigation scrolls settle first
    let observerActive = !window.location.hash;
    if (!observerActive) {
      // If we arrived via hash, set the correct active link immediately
      const targetId = window.location.hash.slice(1);
      navAnchors.forEach(a => {
        a.classList.toggle('nav__link--active', a.getAttribute('href') === '#' + targetId);
      });
      // Enable observer after scroll settles
      setTimeout(() => { observerActive = true; }, 1000);
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      if (!observerActive) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('nav__link--active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-56px 0px -50% 0px'
    });

    sections.forEach(s => sectionObserver.observe(s));
  }

  // ----------------------------------------
  // 4. TYPING EFFECT
  // ----------------------------------------
  const tagline = document.getElementById('tagline');

  if (tagline && !prefersReducedMotion) {
    const text = tagline.getAttribute('data-text');
    if (text) {
      // Decode HTML entities
      const decoder = document.createElement('textarea');
      decoder.innerHTML = text;
      const decoded = decoder.value;

      tagline.textContent = '';
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      tagline.appendChild(cursor);

      let i = 0;
      const type = () => {
        if (i < decoded.length) {
          tagline.insertBefore(document.createTextNode(decoded[i]), cursor);
          i++;
          setTimeout(type, 40 + Math.random() * 30);
        } else {
          // Remove cursor after a pause
          setTimeout(() => {
            cursor.style.display = 'none';
          }, 2000);
        }
      };

      // Start typing after a short delay
      setTimeout(type, 600);
    }
  } else if (tagline) {
    // No animation: show text directly
    const text = tagline.getAttribute('data-text');
    if (text) {
      const decoder = document.createElement('textarea');
      decoder.innerHTML = text;
      tagline.textContent = decoder.value;
    }
  }

  // ----------------------------------------
  // 5. SUBTLE PARALLAX
  // ----------------------------------------
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length && !prefersReducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const factor = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = `translateY(${scrollY * factor}px)`;
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ----------------------------------------
  // 6. MAGNETIC SOCIAL ICONS
  // ----------------------------------------
  const socialLinks = document.querySelectorAll('.social-link');

  if (socialLinks.length && !prefersReducedMotion) {
    socialLinks.forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.25;
        const dy = (e.clientY - centerY) * 0.25;
        link.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
      });
    });
  }
});
