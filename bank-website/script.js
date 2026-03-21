// ===== MOBILE NAVIGATION =====
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== FORM HANDLING =====
function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      let valid = true;

      inputs.forEach(input => {
        input.style.borderColor = '';
        if (!input.value.trim()) {
          input.style.borderColor = '#E53935';
          valid = false;
        }
        // Email validation
        if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            input.style.borderColor = '#E53935';
            valid = false;
          }
        }
        // Phone validation
        if (input.type === 'tel' && input.value) {
          const phoneRegex = /^[6-9]\d{9}$/;
          if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
            input.style.borderColor = '#E53935';
            valid = false;
          }
        }
      });

      if (valid) {
        const formData = new FormData(form);
        formData.append('form-name', form.getAttribute('name'));
        
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        }).then(() => {
          showModal(form.dataset.form);
          form.reset();
        }).catch((error) => {
          console.error(error);
          alert("There was an error submitting your form. Please try again.");
        });
      }
    });
  });
}

// ===== SUCCESS MODAL =====
function showModal(formType) {
  const overlay = document.getElementById('successModal');
  if (!overlay) return;

  const messages = {
    contact: {
      title: 'Thank You!',
      text: 'Your enquiry has been submitted. Our team will reach out to you within 24 hours.'
    },
    'home-loan': {
      title: 'Request Received!',
      text: 'Our Home Loan specialist will contact you shortly with the best offers.'
    },
    'car-loan': {
      title: 'Request Received!',
      text: 'Our Auto Loan advisor will get in touch with you within 24 hours.'
    },
    'credit-card': {
      title: 'Request Received!',
      text: 'Our Credit Card team will reach out to you with exclusive offers soon.'
    },
    insurance: {
      title: 'Request Received!',
      text: 'Our Life Insurance expert will contact you to discuss the best plans.'
    },
    career: {
      title: 'Application Submitted!',
      text: 'Thank you for your interest in joining Bharat National Bank. Our HR team will review your profile and contact you.'
    }
  };

  const msg = messages[formType] || messages.contact;
  overlay.querySelector('.modal h3').textContent = msg.title;
  overlay.querySelector('.modal p').textContent = msg.text;
  overlay.classList.add('active');
}

function closeModal() {
  const overlay = document.getElementById('successModal');
  if (overlay) overlay.classList.remove('active');
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = Math.floor(current) + suffix;
        }, 30);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollAnimations();
  initForms();
  animateCounters();

  // Close modal on overlay click
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});
