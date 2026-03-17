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
})();

/* ─── Particle + Streak Canvas Background ─────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let particles = [];
  let streaks   = [];

  // Scroll offset so canvas covers the whole page
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Particles ── */
  const PCOLS = ['rgba(26,111,255,', 'rgba(0,194,255,', 'rgba(26,64,200,'];
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.r  = Math.random() * 1.5 + .3;
      this.a  = Math.random() * .4 + .05;
      this.color = PCOLS[Math.floor(Math.random() * PCOLS.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.a + ')';
      ctx.fill();
    }
  }

  /* ── Light Streaks (the wave/speed-line effect from the logo) ── */
  const SCOLS = [
    [0,   194, 255],   // cyan neon
    [26,  111, 255],   // electric blue
    [100, 180, 255],   // light blue
    [0,   150, 255],   // mid blue
    [180, 220, 255],   // almost white-blue
  ];

  class Streak {
    constructor() { this.init(true); }

    init(randomY) {
      // Start off the right edge; random Y across full viewport
      this.x     = W + Math.random() * W * 0.6;
      this.y     = randomY ? Math.random() * H : Math.random() * H;
      this.len   = Math.random() * 380 + 60;          // 60 – 440 px
      this.speed = Math.random() * 9  + 2;            // 2 – 11 px/frame
      this.alpha = Math.random() * 0.28 + 0.04;       // 0.04 – 0.32
      this.thick = Math.random() * 1.8 + 0.3;         // line thickness
      this.glow  = this.alpha > 0.18;                 // brightest ones get bloom
      this.col   = SCOLS[Math.floor(Math.random() * SCOLS.length)];
      // Slight vertical drift
      this.vy    = (Math.random() - .5) * 0.08;
    }

    update() {
      this.x -= this.speed;
      this.y += this.vy;
      // Respawn from the right when fully off screen left
      if (this.x + this.len < 0) this.init(true);
    }

    draw() {
      const [r, g, b] = this.col;
      const x0 = this.x;
      const x1 = this.x - this.len;

      // Core streak — gradient from transparent → bright → fades
      const grad = ctx.createLinearGradient(x0, 0, x1, 0);
      grad.addColorStop(0,    `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.15, `rgba(${r},${g},${b},${this.alpha})`);
      grad.addColorStop(0.6,  `rgba(${r},${g},${b},${this.alpha * 0.75})`);
      grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0, this.y);
      ctx.lineTo(x1, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = this.thick;
      ctx.stroke();

      // Soft glow halo for the brighter streaks
      if (this.glow) {
        const glowGrad = ctx.createLinearGradient(x0, 0, x1 + this.len * 0.3, 0);
        glowGrad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        glowGrad.addColorStop(0.2, `rgba(${r},${g},${b},${this.alpha * 0.18})`);
        glowGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.moveTo(x0, this.y);
        ctx.lineTo(x1, this.y);
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth   = this.thick * 7;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* Spawn particles & streaks */
  const PCOUNT = Math.min(100, Math.floor(W * H / 12000));
  for (let i = 0; i < PCOUNT; i++) particles.push(new Particle());

  const SCOUNT = Math.min(55, Math.floor(W / 28));
  for (let i = 0; i < SCOUNT; i++) {
    const s = new Streak();
    // Scatter initial X randomly across screen so they don't all arrive at once
    s.x = Math.random() * (W * 1.5);
    streaks.push(s);
  }

  /* ── Ambient glow blobs ── */
  function drawGlow() {
    const g1 = ctx.createRadialGradient(W * .15, H * .3, 0, W * .15, H * .3, W * .38);
    g1.addColorStop(0, 'rgba(26,111,255,0.055)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(W * .82, H * .65, 0, W * .82, H * .65, W * .3);
    g2.addColorStop(0, 'rgba(0,194,255,0.04)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── Particle connection lines ── */
  function drawConnections() {
    const maxDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(26,111,255,${(1 - dist / maxDist) * 0.1})`;
          ctx.lineWidth   = .4;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  /* ── Main loop ── */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGlow();
    // Draw streaks behind particles
    streaks.forEach(s => { s.update(); s.draw(); });
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
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
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children inside same parent
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, parseFloat(delay) * 1000 || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Stagger siblings
  const groups = {};
  els.forEach(el => {
    const key = el.parentElement;
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });
  Object.values(groups).forEach(group => {
    group.forEach((el, i) => {
      if (!el.dataset.delay) el.dataset.delay = i * 0.12;
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
  const nums = document.querySelectorAll('.stat-num[data-count], .pstat-num[data-count]');
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

/* ─── Smooth-scroll for nav links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
