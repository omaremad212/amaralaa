/* ══════════════════════════════════════════════════════
   Ammar Alaa Portfolio — Main JavaScript
   ══════════════════════════════════════════════════════ */

'use strict';

/* ─── Cursor ──────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Grow cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, .mockup-card, input, textarea, select');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '20px';
      cursor.style.height  = '20px';
      follower.style.width  = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(0,194,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '10px';
      cursor.style.height  = '10px';
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(0,194,255,0.5)';
    });
  });

  // Hide custom cursor when over the nav
  const nav = document.querySelector('.navbar');
  if (nav) {
    nav.addEventListener('mouseenter', () => {
      cursor.style.opacity   = '0';
      follower.style.opacity = '0';
    });
    nav.addEventListener('mouseleave', () => {
      cursor.style.opacity   = '1';
      follower.style.opacity = '1';
    });
  }
})();

/* ─── Navbar scroll effect ────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── Mobile Menu ─────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ─── Scroll-reveal ───────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, parseFloat(delay) * 1000 || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });

  // Stagger siblings
  const groups = {};
  els.forEach(el => {
    const key = el.parentElement;
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });
  Object.values(groups).forEach(group => {
    group.forEach((el, i) => {
      if (!el.dataset.delay) el.dataset.delay = i * 0.04;
    });
  });

  els.forEach(el => observer.observe(el));
})();

/* ─── Active Nav Link on Scroll ───────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ─── Animated Stat Counters ──────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count], .pstat-num[data-count], .stat-card-num[data-count]');
  if (!nums.length) return;

  function countUp(el) {
    const target = +el.dataset.count;
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();

/* ─── Hero Title Word Animation ───────────────────────── */
(function initHeroAnim() {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = `opacity .7s ease ${i * 0.15 + 0.2}s, transform .7s ease ${i * 0.15 + 0.2}s`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 100);
  });

  // Hero tag and sub
  const heroTag = document.querySelector('.hero-tag');
  const heroSub = document.querySelector('.hero-sub');
  const heroCta = document.querySelector('.hero-cta');
  const heroStats = document.querySelector('.hero-stats');
  [heroTag, heroSub, heroCta, heroStats].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .6s ease ${i * 0.12 + 0.7}s, transform .6s ease ${i * 0.12 + 0.7}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });

  // Hero right mockup grid
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    heroRight.style.opacity = '0';
    heroRight.style.transform = 'translateX(40px)';
    heroRight.style.transition = 'opacity .9s ease .4s, transform .9s ease .4s';
    setTimeout(() => {
      heroRight.style.opacity = '1';
      heroRight.style.transform = 'translateX(0)';
    }, 100);
  }
})();

/* ─── Mockup Card Hover Glow Tilt ─────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.mockup-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── Contact Form ────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.querySelector('span').textContent;

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    // Simulate send (replace with actual backend/EmailJS integration)
    setTimeout(() => {
      btn.querySelector('span').textContent = 'Message Sent! ✓';
      btn.style.background = 'linear-gradient(135deg, #00b09b, #06a15e)';
      setTimeout(() => {
        btn.querySelector('span').textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  });
})();

/* ─── Circular Favicon via Canvas ────────────────────── */
(function initCircularFavicon() {
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
  };
  img.src = 'assets/ammar-profile.jpg';
})();

/* ─── Expertise Accordion ─────────────────────────────── */
(function initExpertiseAccordion() {
  const items = document.querySelectorAll('.ea-item');
  if (!items.length) return;
  items.forEach(item => {
    const trigger = item.querySelector('.ea-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first by default
  if (items[0]) items[0].classList.add('open');
})();

/* ─── Project Video Hover Play ────────────────────────── */
(function initVideoPlay() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
})();

/* Ethereal bg animation is now pure CSS keyframes — no JS needed */

/* ─── Smooth-scroll for nav links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
