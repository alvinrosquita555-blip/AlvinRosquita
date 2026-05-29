/* ═══════════════════════════════════════════════
   PORTFOLIO JS — Interactions & Animations
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect & active link ──────────────
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile hamburger ────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ── Dark mode toggle ────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme  = localStorage.getItem('theme');

  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      heroPhoto.classList.add('switching');
      setTimeout(() => {
        heroPhoto.src = dark ? 'Me2.jpg' : 'Me1.jpg';
        heroPhoto.onload = () => heroPhoto.classList.remove('switching');
        // Fallback: if already cached, onload won't fire
        if (heroPhoto.complete) heroPhoto.classList.remove('switching');
      }, 300);
    }
  }

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) setTheme(true);

  themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
  });

  // ── Typing role effect ───────────────────────────────
  const roles = [
    'IT Student',
    'Software Developer',
    'Problem Solver',
    'Open Source Enthusiast'
  ];
  const heroRole = document.getElementById('heroRole');
  let rIdx = 0, cIdx = 0, deleting = false;

  function typeRole() {
    const role = roles[rIdx];
    if (!deleting) {
      heroRole.textContent = role.substring(0, cIdx + 1);
      cIdx++;
      if (cIdx === role.length) {
        deleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
    } else {
      heroRole.textContent = role.substring(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
      }
    }
    setTimeout(typeRole, deleting ? 60 : 90);
  }
  typeRole();

  // ── CSS AOS (Animate on Scroll) ─────────────────────
  const aosEls = document.querySelectorAll('[data-aos]');

  function checkAOS() {
    aosEls.forEach(el => {
      const rect    = el.getBoundingClientRect();
      const delay   = parseInt(el.getAttribute('data-aos-delay') || 0);
      const visible = rect.top < window.innerHeight - 60;
      if (visible && !el._aosTriggered) {
        el._aosTriggered = true;
        setTimeout(() => el.classList.add('aos-animate'), delay);
      }
    });
  }
  window.addEventListener('scroll', checkAOS, { passive: true });
  window.addEventListener('resize', checkAOS, { passive: true });
  // Small delay so browser has one paint cycle to measure positions correctly
  // before the initial AOS check — fixes above-the-fold elements needing scroll
  setTimeout(checkAOS, 100);

  // ── Contact form ────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactForm);

      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending…';

      try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          formSuccess.style.display = 'block';
          setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
        }
      } catch (error) {
        alert('Oops! There was a problem sending your message.');
      } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Message';
      }
    });
  }

  // ── Smooth scroll offset (accounting for fixed nav) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Project card tilt effect ─────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ── Counter animation for hero stats ─────────────────
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const duration = 1200;
    const step     = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(el => {
          const text = el.textContent;
          const num  = parseInt(text);
          const suf  = text.replace(num, '');
          el.textContent = '0' + suf;
          animateCounter(el, num, suf);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) observer.observe(statsEl);

});
