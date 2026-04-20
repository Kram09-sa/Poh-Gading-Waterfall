/* ============================================================
   Poh Gading Waterfall — Main JavaScript
   Features: Navbar scroll, smooth scroll, form validation,
             scroll reveal, price calculator, modal
   ============================================================ */

'use strict';

// ============================================================
// 1. NAVBAR — change style on scroll
// ============================================================
const navbar   = document.getElementById('navbar');
const backTop  = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar becomes opaque after 80px scroll
  if (scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top button visibility
  if (scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
});


// ============================================================
// 2. HAMBURGER MENU — mobile toggle
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger into X
  const spans = hamburger.querySelectorAll('span');
  spans.forEach(s => s.classList.toggle('active'));
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Hamburger X animation via CSS class
const styleEl = document.createElement('style');
styleEl.textContent = `
  .hamburger span:nth-child(1).active { transform: translateY(7px) rotate(45deg); }
  .hamburger span:nth-child(2).active { opacity: 0; }
  .hamburger span:nth-child(3).active { transform: translateY(-7px) rotate(-45deg); }
`;
document.head.appendChild(styleEl);


// ============================================================
// 3. SCROLL TO RESERVATION FORM
// ============================================================
function scrollToReservation() {
  const section = document.getElementById('reservation');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


// ============================================================
// 4. SELECT PACKAGE FROM PRICING SECTION
//    Clicking "Pilih Paket Ini" selects the radio & scrolls
// ============================================================
function selectPackage(pkg) {
  const pkgIds = { Regular: 'pkgRegular', Domestik: 'pkgDomestik', VIP: 'pkgVIP' };
  const radio = document.getElementById(pkgIds[pkg]);
  if (radio) {
    radio.checked = true;
    // Trigger the change event so price updates
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  }
  scrollToReservation();
}


// ============================================================
// 5. PRICE CALCULATOR
//    Updates total when tickets or package changes
// ============================================================
const PRICES = { Regular: 20000, Domestik: 25000, VIP: 30000 };

const ticketsInput  = document.getElementById('tickets');
const summaryDiv    = document.getElementById('priceSummary');
const totalPriceEl  = document.getElementById('totalPrice');

function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function updatePrice() {
  const selectedPkg = document.querySelector('input[name="package"]:checked');
  const qty         = parseInt(ticketsInput.value, 10) || 0;

  if (selectedPkg && qty > 0) {
    const total = PRICES[selectedPkg.value] * qty;
    totalPriceEl.textContent = formatRupiah(total);
    summaryDiv.style.display = 'flex';
  } else {
    summaryDiv.style.display = 'none';
  }
}

// Listen on both ticket count and package selection changes
ticketsInput.addEventListener('input', updatePrice);
document.querySelectorAll('input[name="package"]').forEach(r => {
  r.addEventListener('change', updatePrice);
});

// Set today's minimum date for the date picker
(function setMinDate() {
  const dateInput  = document.getElementById('visitDate');
  const today      = new Date();
  const yyyy       = today.getFullYear();
  const mm         = String(today.getMonth() + 1).padStart(2, '0');
  const dd         = String(today.getDate()).padStart(2, '0');
  dateInput.min    = `${yyyy}-${mm}-${dd}`;
})();


// ============================================================
// 6. FORM VALIDATION & SUBMISSION
// ============================================================
const form = document.getElementById('reservationForm');

/**
 * Show an error message under a field.
 * @param {string} fieldId    - id of the <input>
 * @param {string} errId      - id of the error <span>
 * @param {string} message    - error text
 */
function showError(fieldId, errId, message) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.add('error-field');
  if (err)   err.textContent = message;
}

/**
 * Clear an error message.
 */
function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.remove('error-field');
  if (err)   err.textContent = '';
}

/**
 * Validate all fields.
 * @returns {boolean} true if all valid
 */
function validateForm() {
  let isValid = true;

  // --- Nama Lengkap ---
  const name = document.getElementById('fullName').value.trim();
  clearError('fullName', 'err-name');
  if (!name) {
    showError('fullName', 'err-name', 'Nama lengkap tidak boleh kosong.');
    isValid = false;
  } else if (name.length < 3) {
    showError('fullName', 'err-name', 'Nama minimal 3 karakter.');
    isValid = false;
  }

  // --- Email ---
  const email = document.getElementById('email').value.trim();
  clearError('email', 'err-email');
  if (!email) {
    showError('email', 'err-email', 'Email tidak boleh kosong.');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'err-email', 'Format email tidak valid.');
    isValid = false;
  }

  // --- Phone ---
  const phone = document.getElementById('phone').value.trim();
  clearError('phone', 'err-phone');
  if (!phone) {
    showError('phone', 'err-phone', 'Nomor HP tidak boleh kosong.');
    isValid = false;
  } else if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
    showError('phone', 'err-phone', 'Nomor HP tidak valid (8–15 digit).');
    isValid = false;
  }

  // --- Tanggal Kunjungan ---
  const visitDate = document.getElementById('visitDate').value;
  clearError('visitDate', 'err-date');
  if (!visitDate) {
    showError('visitDate', 'err-date', 'Pilih tanggal kunjungan.');
    isValid = false;
  }

  // --- Jumlah Tiket ---
  const tickets = parseInt(document.getElementById('tickets').value, 10);
  clearError('tickets', 'err-tickets');
  if (!tickets || tickets < 1) {
    showError('tickets', 'err-tickets', 'Jumlah tiket minimal 1.');
    isValid = false;
  } else if (tickets > 50) {
    showError('tickets', 'err-tickets', 'Maksimal 50 tiket per pemesanan.');
    isValid = false;
  }

  // --- Paket ---
  const selectedPkg = document.querySelector('input[name="package"]:checked');
  const pkgErr      = document.getElementById('err-package');
  pkgErr.textContent = '';
  if (!selectedPkg) {
    pkgErr.textContent = 'Pilih salah satu paket wisata.';
    isValid = false;
  }

  return isValid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Show payment modal instead of success modal
  openPaymentModal();
  
  // Don't reset form yet (so payment modal can still read values)
});

// Clear error on input change
['fullName','email','phone','visitDate','tickets'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      el.classList.remove('error-field');
      const errId = 'err-' + id.replace('fullName','name').replace('visitDate','date').replace('tickets','tickets').toLowerCase();
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  }
});


// ============================================================
// 7. MODAL — open / close
// ============================================================
const modal = document.getElementById('successModal');

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal when clicking overlay background
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});


// ============================================================
// 8. SCROLL REVEAL — fade-in elements when they enter viewport
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,       // Trigger when 12% visible
    rootMargin: '0px 0px -40px 0px'
  }
);

// Observe all elements with the .reveal class
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


// ============================================================
// 9. SMOOTH ANCHOR SCROLLING (for all in-page links)
//    Accounts for fixed navbar height
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});


// ============================================================
// 10. GALLERY — click to lightbox (simple overlay preview)
// ============================================================
(function initLightbox() {
  const cards = document.querySelectorAll('.gallery-card');

  // Create lightbox elements
  const lightbox  = document.createElement('div');
  lightbox.id     = 'lightbox';
  lightbox.style.cssText =
    'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.9);' +
    'display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;';

  const lbImg = document.createElement('img');
  lbImg.style.cssText =
    'max-width:90vw;max-height:88vh;border-radius:12px;' +
    'box-shadow:0 20px 60px rgba(0,0,0,0.5);object-fit:contain;' +
    'animation: lbIn 0.3s ease;';

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText =
    'position:absolute;top:24px;right:32px;background:none;border:none;' +
    'color:white;font-size:1.6rem;cursor:pointer;opacity:0.7;transition:opacity 0.2s;';
  closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
  closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.7';

  lightbox.appendChild(lbImg);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  // Inject keyframe
  const ks = document.createElement('style');
  ks.textContent = '@keyframes lbIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }';
  document.head.appendChild(ks);

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.style.cursor = 'zoom-in';
    card.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightbox.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();


// ============================================================
// 11. NEWSLETTER — basic feedback
// ============================================================
(function initNewsletter() {
  const btn = document.querySelector('.newsletter-input button');
  const inp = document.querySelector('.newsletter-input input');
  if (!btn || !inp) return;

  btn.addEventListener('click', () => {
    const email = inp.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      inp.style.borderColor = '#e53935';
      inp.placeholder = 'Masukkan email yang valid';
      return;
    }
    inp.style.borderColor = '#4caf50';
    inp.value = '';
    inp.placeholder = '✓ Berhasil berlangganan!';
    setTimeout(() => {
      inp.placeholder = 'Alamat email Anda';
      inp.style.borderColor = '';
    }, 3000);
  });
})();


// ============================================================
// 12. ACTIVE NAV LINK — highlight based on current section
// ============================================================
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links a');

  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-links a.active-link {
      color: var(--white) !important;
      background: rgba(255,255,255,0.15);
      border-radius: 6px;
    }
    #navbar.scrolled .nav-links a.active-link {
      color: var(--green-800) !important;
      background: var(--green-100);
    }
  `;
  document.head.appendChild(activeStyle);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active-link'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active-link');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => obs.observe(s));
})();


// ============================================================
// 13. PAYMENT MODAL — QR Code Generation & Payment Flow
// ============================================================

const paymentModal = document.getElementById('paymentModal');
let currentBookingData = {};

/**
 * Generate a unique booking code
 * @returns {string} Booking code (POH-XXXXXX)
 */
function generateBookingCode() {
  const randomNum = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  return `POH-${randomNum}`;
}

/**
 * Open payment modal and generate QR code
 */
function openPaymentModal() {
  // Get form data
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const visitDate = document.getElementById('visitDate').value;
  const tickets = parseInt(document.getElementById('tickets').value, 10);
  const pkg = document.querySelector('input[name="package"]:checked').value;
  const total = PRICES[pkg] * tickets;

  // Format date
  const dateFormatted = new Date(visitDate + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Store data for later use
  currentBookingData = {
    name, email, pkg, visitDate: dateFormatted, tickets, total
  };

  // Update modal content
  document.getElementById('paymentName').textContent = name;
  document.getElementById('paymentPackage').textContent = pkg;
  document.getElementById('paymentTickets').textContent = `${tickets} orang`;
  document.getElementById('paymentDate').textContent = dateFormatted;
  document.getElementById('paymentTotal').textContent = formatRupiah(total);

  // Generate booking code
  const bookingCode = generateBookingCode();
  document.getElementById('bookingCode').textContent = bookingCode;

  // Clear previous QR code
  const qrContainer = document.getElementById('qrCodeContainer');
  qrContainer.innerHTML = '';

  // Generate QR code with payment data
  // QR code contains: booking code + total amount + customer info
  const qrData = `POH_GADING|${bookingCode}|${total}|${email}|${phone}`;
  
  // Create QR code using QRcode.js library
  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: '#1b4d1e',
        colorLight: '#f1f8f1',
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      qrContainer.innerHTML = '<div style="padding: 40px; text-align: center; background: #f1f8f1; border-radius: 8px;"><p>📱 Scan untuk membayar</p></div>';
      console.warn('QRCode library not available');
    }
  } catch (err) {
    console.error('Error generating QR code:', err);
    qrContainer.innerHTML = '<div style="padding: 40px; text-align: center; background: #f1f8f1; border-radius: 8px;"><p>📱 Scan untuk membayar</p></div>';
  }

  // Show payment modal
  if (paymentModal) {
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    console.error('Payment modal element not found');
  }
}

/**
 * Close payment modal
 */
function closePaymentModal() {
  if (paymentModal) {
    paymentModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Confirm payment and close payment modal
 */
function confirmPayment() {
  const bookingCode = document.getElementById('bookingCode').textContent;
  const { name, email, total } = currentBookingData;

  // Simulate payment confirmation
  const confirmMsg = `✅ Pembayaran Dikonfirmasi!\n\n` +
    `Kode Booking: ${bookingCode}\n` +
    `Nama: ${name}\n` +
    `Email: ${email}\n` +
    `Total: ${formatRupiah(total)}\n\n` +
    `Tiket akan dikirim ke email Anda dalam 10 menit.`;

  // Show success message
  alert(confirmMsg);

  // Close payment modal
  closePaymentModal();

  // Show success modal
  const detailText = `<b style="color: var(--green-800);">✅ Pembayaran Confirmed!</b><br><br>` +
    `<b>Kode Booking:</b> ${bookingCode}<br>` +
    `<b>Nama Pemesan:</b> ${currentBookingData.name}<br>` +
    `<b>Total Pembayaran:</b> ${formatRupiah(currentBookingData.total)}<br>` +
    `<b>Tanggal Kunjungan:</b> ${currentBookingData.visitDate}<br><br>` +
    `📧 Konfirmasi akan dikirim ke email: ${currentBookingData.email}<br>` +
    `🎫 Tiket digital tersedia di email Anda`;

  document.getElementById('modalMessage').innerHTML =
    `Pembayaran Anda telah berhasil diproses! Terima kasih telah memesan tiket Poh Gading Waterfall.`;
  document.getElementById('modalDetail').innerHTML = detailText;

  openModal();
}

// Close payment modal when clicking on overlay
if (paymentModal) {
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) closePaymentModal();
  });
}

// Close payment modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && paymentModal && paymentModal.classList.contains('active')) {
    closePaymentModal();
  }
});
