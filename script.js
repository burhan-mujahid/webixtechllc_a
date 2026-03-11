/* ═══════════════════════════════════════════════════
   WEBIX TECH LLC — Landing Page Scripts
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAV: scroll behaviour ───────────────────── */
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── NAV: mobile burger ──────────────────────── */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─── REVEAL ON SCROLL ────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── COUNTER ANIMATION ───────────────────────── */
  const counters = document.querySelectorAll('.metric__num[data-target]');

  const easeOutQuad = t => 1 - (1 - t) * (1 - t);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  /* ─── SERVICES ACCORDION ──────────────────────── */
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach(item => {
    const head = item.querySelector('.service-item__head');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      serviceItems.forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  // Open first item by default
  if (serviceItems.length) serviceItems[0].classList.add('open');

  /* ─── CONTACT FORM SUBMIT ─────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      btn.textContent = '✓ Request Sent!';
      btn.style.background = '#1E8C5A';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  /* ─── SMOOTH ACTIVE NAV LINK ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--ink)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => activeObserver.observe(s));

  /* ─── CURSOR HIGHLIGHT (desktop only) ────────────*/
  if (window.matchMedia('(hover: hover)').matches) {
    const highlight = document.createElement('div');
    highlight.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:300px; height:300px;
      background:radial-gradient(circle, rgba(123,79,191,0.04) 0%, transparent 70%);
      border-radius:50%;
      transform:translate(-50%,-50%);
      transition: opacity 0.3s ease;
      top:0; left:0;
    `;
    document.body.appendChild(highlight);

    let mx = 0, my = 0, cx = 0, cy = 0;
    let raf;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => { highlight.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { highlight.style.opacity = '1'; });

    const lerp = (a, b, t) => a + (b - a) * t;

    const animateCursor = () => {
      cx = lerp(cx, mx, 0.1);
      cy = lerp(cy, my, 0.1);
      highlight.style.left = cx + 'px';
      highlight.style.top  = cy + 'px';
      raf = requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  /* ─── PARALLAX: hero orbs ─────────────────────── */
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');

  if (orb1 && orb2) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orb1.style.transform = `translateY(${y * 0.15}px)`;
      orb2.style.transform = `translateY(${y * -0.1}px)`;
    }, { passive: true });
  }

  /* ─── HERO TITLE CHAR ANIMATION ──────────────── */
  // Stagger-in the hero title lines on load
  const heroLines = document.querySelectorAll('.hero__title-line');
  heroLines.forEach((line, i) => {
    line.style.transitionDelay = `${i * 100}ms`;
  });

  // Trigger hero reveals immediately
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay + 100);
    });
  }, 200);

})();