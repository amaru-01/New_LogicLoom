/* ============================================
   LOGICLOOM — MAIN JS
   ============================================ */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // Close when a link inside the menu is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// ===== SCROLL REVEAL =====
const revealSelectors = [
  '.svc-card',
  '.location-card',
  '.t-card',
  '.value-card',
  '.team-card',
  '.why-item',
  '.contact-card',
  '.feature-list li',
  '.section-title',
  '.eyebrow',
  '.section-lead',
  '.form-sub',
  '.hero-tag',
  '.page-hero-content h1',
  '.page-hero-content p',
].join(', ');

const revealEls = document.querySelectorAll(revealSelectors);

revealEls.forEach((el, i) => {
  if (!el.classList.contains('reveal')) {
    el.classList.add('reveal');
  }
  // Stagger delay for grid items
  const parent = el.parentElement;
  if (parent) {
    const siblings = [...parent.children].filter(c => c.classList.contains(el.classList[0]));
    const idx = siblings.indexOf(el);
    if (idx > 0) {
      el.style.transitionDelay = `${Math.min(idx * 75, 300)}ms`;
    }
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

// Also observe explicitly marked .reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  if (!el.classList.contains('visible')) {
    revealObserver.observe(el);
  }
});

// ===== CONTACT FORM =====
// ===== CONTACT FORM =====
function handleFormSubmit(event) {
  console.log('handleFormSubmit called with event:', event); // Debug log

  // Handle case where event might be undefined
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault(); // Prevent default form submission
    console.log('preventDefault called'); // Debug log
  } else {
    console.warn('Event is undefined or preventDefault not available'); // Debug log
  }

  const fname   = document.getElementById('fname');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  if (!fname || !email || !message || !submitBtn) return;

  let isValid = true;
  [fname, email, message].forEach(el => {
    if (!el.value.trim()) {
      isValid = false;
      el.style.borderColor = 'var(--red)';
      el.classList.add('shake');
      setTimeout(() => {
        el.classList.remove('shake');
        el.style.borderColor = '';
      }, 500);
    }
  });

  if (!isValid) return;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.style.borderColor = 'var(--red)';
    email.classList.add('shake');
    setTimeout(() => {
      email.classList.remove('shake');
      email.style.borderColor = '';
    }, 500);
    return;
  }

  // Hide any previous messages
  if (formSuccess) formSuccess.classList.remove('show');
  if (formError) formError.classList.remove('show');

  // Show loading state
  if (submitBtn) {
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.classList.add('loading');
  }

  // Prepare form data
  const formData = new FormData(document.getElementById('contactForm'));

  // Send AJAX request
  fetch('form-handler.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Reset button
    if (submitBtn) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }

    if (data.success) {
      // Success animation
      if (submitBtn) {
        submitBtn.textContent = '✅ Sent!';
        submitBtn.style.background = '#25d366';
      }

      if (formSuccess) {
        formSuccess.textContent = data.message;
        formSuccess.classList.add('show');
        formSuccess.style.animation = 'slideInUp 0.5s ease-out';
      }

      // Reset form after success
      setTimeout(() => {
        document.getElementById('contactForm').reset();
        if (submitBtn) {
          submitBtn.textContent = 'Send Message →';
          submitBtn.style.background = '';
        }
        if (formSuccess) {
          formSuccess.classList.remove('show');
        }
      }, 4000);

    } else {
      // Error animation
      if (submitBtn) {
        submitBtn.textContent = '❌ Try Again';
        submitBtn.style.background = 'var(--red)';
      }

      if (formError) {
        formError.textContent = data.message;
        formError.classList.add('show');
        formError.style.animation = 'slideInUp 0.5s ease-out';
      }

      // Reset button after error
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Send Message →';
          submitBtn.style.background = '';
        }
        if (formError) {
          formError.classList.remove('show');
        }
      }, 3000);
    }
  })
  .catch(error => {
    console.error('Error:', error);

    // Reset button
    if (submitBtn) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.textContent = '❌ Error - Try Again';
      submitBtn.style.background = 'var(--red)';
    }

    if (formError) {
      formError.textContent = 'Network error. Please check your connection and try again.';
      formError.classList.add('show');
      formError.style.animation = 'slideInUp 0.5s ease-out';
    }

    // Reset button after error
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = 'Send Message →';
        submitBtn.style.background = '';
      }
      if (formError) {
        formError.classList.remove('show');
      }
    }, 3000);
  });

  return false; // Prevent default form submission
}

// Attach form submit handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

// Inject shake keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
  .shake { animation: shake 0.4s ease; }
`;
document.head.appendChild(style);

// ===== SMOOTH ANCHOR SCROLL (same page) =====
document.querySelectorAll('a[href*="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const hashIdx = href.indexOf('#');
    if (hashIdx === -1) return;

    const hash = href.slice(hashIdx);
    const isSamePage = href.startsWith('#') ||
      href.startsWith(window.location.pathname + '#');

    if (isSamePage) {
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 24;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ===== ACTIVE NAV LINK HIGHLIGHT ON SCROLL =====
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.includes(`#${id}`)) {
            link.classList.add('active');
          } else if (!link.classList.contains('active-page')) {
            // don't remove active set by HTML
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));
}
