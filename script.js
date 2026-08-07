/**
 * KraFta Forge — Main JavaScript
 * Handles navigation, animations, forms, and interactive UI
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     DOM Ready
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    hideLoader();
    initNavigation();
    initMobileMenu();
    initScrollReveal();
    initBackToTop();
    initStatCounters();
    initContactForm();
    initProjectFilters();
    initTechBars();
    setActiveNavLink();
  }

  /* --------------------------------------------------------------------------
     Loading Screen
     -------------------------------------------------------------------------- */
  function hideLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 800);
    });

    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 800);
    }
  }

  /* --------------------------------------------------------------------------
     Sticky Navigation
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     Mobile Navigation
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.nav__toggle');
    const mobileNav = document.querySelector('.nav__mobile');
    const mobileLinks = document.querySelectorAll('.nav__mobile-link');

    if (!toggle || !mobileNav) return;

    const closeMenu = () => {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', String(isOpen));
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('no-scroll', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     Active Navigation Link
     -------------------------------------------------------------------------- */
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* --------------------------------------------------------------------------
     Scroll Reveal Animations
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     Back to Top Button
     -------------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        btn.classList.toggle('visible', window.scrollY > 400);
      },
      { passive: true }
    );

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     Animated Stat Counters
     -------------------------------------------------------------------------- */
  function initStatCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* --------------------------------------------------------------------------
     Contact Form Validation
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const successMsg = form.querySelector('.form-success');

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach((group) => {
        group.classList.remove('error');
      });

      if (successMsg) successMsg.classList.remove('show');

      // Validate required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach((field) => {
        const group = field.closest('.form-group');
        const value = field.tagName === 'SELECT' ? field.value : field.value.trim();
        if (!value) {
          group.classList.add('error');
          isValid = false;
        }
      });

      // Validate email format
      const emailField = form.querySelector('[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          emailField.closest('.form-group').classList.add('error');
          isValid = false;
        }
      }

      if (isValid) {
        if (successMsg) {
          successMsg.classList.add('show');
        }
        form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      }
    });

    // Clear error on input
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach((field) => {
      const eventType = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventType, () => {
        field.closest('.form-group').classList.remove('error');
      });
    });
  }

  /* --------------------------------------------------------------------------
     Project Filter Tabs
     -------------------------------------------------------------------------- */
  function initProjectFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const projects = document.querySelectorAll('[data-category]');

    if (!tabs.length || !projects.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.filter;

        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        projects.forEach((project) => {
          const show = category === 'all' || project.dataset.category === category;
          project.style.display = show ? '' : 'none';
          if (show) {
            project.classList.remove('visible');
            requestAnimationFrame(() => project.classList.add('visible'));
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     Technology Proficiency Bars
     -------------------------------------------------------------------------- */
  function initTechBars() {
    const bars = document.querySelectorAll('.tech-item__bar-fill');

    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const width = entry.target.dataset.width || '0';
            entry.target.style.width = width + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((bar) => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }
})();
