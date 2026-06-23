// Enable animations only after page load
window.addEventListener('load', () => {
  document.body.classList.add('js-ready');
  // Immediately show hero elements
  document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 180 + 100);
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu?.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    hamburger?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== FADE UP ANIMATION =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== BOOKING FORM =====
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  const originalText = btn.textContent;
  btn.textContent = 'ENVIANDO...';
  btn.disabled = true;

  const name = document.getElementById('b-name')?.value;
  const phone = document.getElementById('b-phone')?.value;
  const service = document.getElementById('b-service')?.value;
  const barber = document.getElementById('b-barber')?.value;
  const date = document.getElementById('b-date')?.value;
  const time = document.getElementById('b-time')?.value;

  const msg = `¡Hola! Quiero reservar una cita en La Barbería 506 🔱\n\n👤 Nombre: ${name}\n✂️ Servicio: ${service}\n💈 Barbero: ${barber || 'Sin preferencia'}\n📅 Fecha: ${date}\n⏰ Hora: ${time}\n📱 Teléfono: ${phone}\n\n¡Gracias!`;

  setTimeout(() => {
    const waUrl = `https://wa.me/50685068000?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    btn.textContent = '✓ REDIRIGIENDO A WHATSAPP';
    btn.style.background = '#25D366';
    const successMsg = document.getElementById('bookingSuccess');
    if (successMsg) { successMsg.style.display = 'block'; }
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      if (successMsg) successMsg.style.display = 'none';
      bookingForm.reset();
    }, 5000);
  }, 800);
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'ENVIANDO...';
  btn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xpwzgdkn', {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      document.getElementById('contactSuccess').style.display = 'block';
      document.getElementById('contactError').style.display = 'none';
      contactForm.reset();
    } else {
      throw new Error('Error');
    }
  } catch {
    document.getElementById('contactError').style.display = 'block';
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// ===== SERVICE BOOK BUTTONS =====
document.querySelectorAll('.service-book-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const service = btn.dataset.service;
    const bookingPage = 'reservar.html';
    if (window.location.pathname.includes('reservar')) {
      const select = document.getElementById('b-service');
      if (select) {
        select.value = service;
        select.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      window.location.href = `${bookingPage}?service=${encodeURIComponent(service)}`;
    }
  });
});

// ===== AUTO-SELECT SERVICE FROM URL =====
const urlParams = new URLSearchParams(window.location.search);
const preService = urlParams.get('service');
if (preService) {
  const select = document.getElementById('b-service');
  if (select) select.value = preService;
}

// ===== SET MIN DATE TO TODAY =====
const dateInput = document.getElementById('b-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}
