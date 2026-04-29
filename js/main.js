/* ══════════════════════════════════════════════
   SKYFIT GYM — Main JavaScript
   ══════════════════════════════════════════════ */

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.querySelectorAll('#hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 150);
});


// ── PHOTO SWAP (fasilitas grid) ──
document.querySelectorAll('.photo-cell.thumb-cell').forEach(cell => {
  cell.addEventListener('click', () => swapWithMain(cell));
});

function swapWithMain(thumbCell) {
  const mainCell = document.getElementById('mainCell');
  const mainPH   = mainCell.querySelector('.photo-placeholder').cloneNode(true);
  const mainOV   = mainCell.querySelector('.photo-overlay').cloneNode(true);
  const thumbPH  = thumbCell.querySelector('.photo-placeholder').cloneNode(true);
  const thumbOV  = thumbCell.querySelector('.photo-overlay').cloneNode(true);

  mainCell.style.opacity   = '0';
  mainCell.style.transform = 'scale(0.97)';
  setTimeout(() => {
    mainCell.querySelector('.photo-placeholder').replaceWith(thumbPH);
    mainCell.querySelector('.photo-overlay').replaceWith(thumbOV);
    thumbCell.querySelector('.photo-placeholder').replaceWith(mainPH);
    thumbCell.querySelector('.photo-overlay').replaceWith(mainOV);
    mainCell.style.opacity   = '1';
    mainCell.style.transform = 'scale(1)';
  }, 200);
}


// ── TAB SWITCHING (pricelist) ──
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  btn.focus();
  const panel = document.getElementById('tab-' + tabId);
  panel.classList.add('active');
  panel.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => observer.observe(el), 10);
  });
}


// ── KEYBOARD NAVIGATION ──
document.addEventListener('keydown', (e) => {
  // Escape closes any open modal / overlay
  if (e.key === 'Escape') {
    closeVideoModal();
    closeOverlay();
  }

  // Arrow keys navigate pricing tabs when focused on a tab button
  if (e.target.classList.contains('tab-btn')) {
    const tabs       = Array.from(document.querySelectorAll('.tab-btn'));
    const currentIdx = tabs.indexOf(e.target);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next  = tabs[(currentIdx + 1) % tabs.length];
      const tabId = next.getAttribute('onclick').match(/switchTab\('([^']+)'/)[1];
      switchTab(tabId, next);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev  = tabs[(currentIdx - 1 + tabs.length) % tabs.length];
      const tabId = prev.getAttribute('onclick').match(/switchTab\('([^']+)'/)[1];
      switchTab(tabId, prev);
    }
  }
});


// ── VIDEO INTRO MODAL (trainer) ──
// Add or update src paths here when video files are available.
const trainerVideos = {
  basuki: { name: 'Coach Basuki', src: 'video/Coach_Basuki_Intro.mp4' },
  mario:  { name: 'Coach Mario',  src: 'video/Coach_Mario_Intro.mp4'  },
  pepeng: { name: 'Coach Pepeng Panggih', src: 'video/Coach_Pepeng_Intro.mp4' } // Penambahan Coach Pepeng
};

function openVideoModal(coachId) {
  const config = trainerVideos[coachId];
  const modal  = document.getElementById('videoModal');
  const title  = document.getElementById('videoModalTitle');
  const body   = document.getElementById('videoModalBody');

  title.textContent = config.name;

  if (config.src) {
    body.innerHTML = `<video controls autoplay playsinline src="${config.src}"></video>`;
  } else {
    body.innerHTML = `
      <div class="video-modal-placeholder">
        <p style="font-size:16px;color:var(--white);margin-bottom:12px;">Video belum tersedia</p>
        <p>Untuk menampilkan video perkenalan <strong>${config.name}</strong>, masukkan path file video ke dalam kode:<br><br>
        <code>trainerVideos.${coachId}.src = 'nama-file-video.mp4'</code><br><br>
        Letakkan file video di folder yang sama dengan file HTML ini.</p>
      </div>`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  const video = modal.querySelector('video');
  if (video) { video.pause(); video.src = ''; }
}

function closeVideoModalOnBackdrop(e) {
  if (e.target === document.getElementById('videoModal')) closeVideoModal();
}


// ── SCHEDULE HOVER OVERLAY ──
// Add photo paths (3 per class) and optional video src when assets are ready.
const kelasData = {
  'Yoga':               { photos: ['', '', ''], video: '' },
  'Functional Training':{ photos: ['', '', ''], video: '' },
  'Fit Elderly':        { photos: ['', '', ''], video: '' },
  'Aerobik':            { photos: ['', '', ''], video: '' },
  'Fit Kid':            { photos: ['', '', ''], video: '' },
  'Body Combat':        { photos: ['', '', ''], video: '' },
  'Body Pump':          { photos: ['', '', ''], video: '' },
  'Full Body HIIT':     { photos: ['', '', ''], video: '' },
  'Boxing':             { photos: ['', '', ''], video: '' }, // Perbaikan penamaan dari Fit Boxing
  'Muay Thai':          { photos: ['', '', ''], video: '' }, // Penambahan Muay Thai
  'Agility':            { photos: ['', '', ''], video: '' },
};

const placeholderBg = [
  'linear-gradient(135deg, #0f1a00 0%, #1a2a00 50%, #080808 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #151a00 50%, #0f1500 100%)',
  'linear-gradient(135deg, #080808 0%, #0d1700 50%, #080808 100%)',
];

let sovSlideInterval = null;
let sovCurrentSlide  = 0;
let sovTotalSlides   = 3;
let sovActiveKey     = null;
let hoverTimeout     = null;

const overlay   = document.getElementById('scheduleOverlay');
const sovSlides = document.getElementById('sovSlides');
const sovDots   = document.getElementById('sovDots');
const sovName   = document.getElementById('sovClassName');
const sovBadge  = document.getElementById('sovTimeBadge');
const sovVidBtn = document.getElementById('sovVideoBtn');
const sovClose  = document.getElementById('sovClose');
const stage     = document.getElementById('scheduleStage');

function buildSlides(photos) {
  sovSlides.innerHTML = '';
  sovDots.innerHTML   = '';
  sovTotalSlides = photos.length;

  photos.forEach((src, i) => {
    const slide = document.createElement('div');
    if (src) {
      slide.className = 'sov-slide' + (i === 0 ? ' active' : '');
      slide.style.backgroundImage = `url('${src}')`;
    } else {
      slide.className = 'sov-slide-placeholder' + (i === 0 ? ' active' : '');
      slide.style.background = placeholderBg[i] || placeholderBg[0];
      slide.innerHTML = `<div class="ph-num">${String(i + 1).padStart(2, '0')}</div>
                         <div class="ph-txt">Foto Dokumentasi ${i + 1}</div>`;
    }
    sovSlides.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'sov-dot' + (i === 0 ? ' active' : '');
    sovDots.appendChild(dot);
  });
}

function goToSlide(idx) {
  const slides = sovSlides.querySelectorAll('.sov-slide, .sov-slide-placeholder');
  const dots   = sovDots.querySelectorAll('.sov-dot');
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  dots.forEach((d, i)   => d.classList.toggle('active', i === idx));
  sovCurrentSlide = idx;
}

function startSlideshow() {
  stopSlideshow();
  sovSlideInterval = setInterval(() => {
    goToSlide((sovCurrentSlide + 1) % sovTotalSlides);
  }, 1000);
}

function stopSlideshow() {
  if (sovSlideInterval) { clearInterval(sovSlideInterval); sovSlideInterval = null; }
}

function openOverlay(className, dayLabel, timeLabel, data) {
  sovActiveKey = className;
  sovCurrentSlide = 0;
  sovName.textContent  = className;
  sovBadge.textContent = dayLabel + ' · ' + timeLabel;
  buildSlides(data.photos);
  sovVidBtn.onclick = () => {
    closeOverlay();
    openKelasVideoModal(className, data.video);
  };
  overlay.classList.add('active');
  startSlideshow();
}

function closeOverlay() {
  if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
  overlay.classList.remove('active');
  stopSlideshow();
  sovActiveKey = null;
}

sovClose.addEventListener('click', (e) => { e.stopPropagation(); closeOverlay(); });
overlay.addEventListener('click', (e) => {
  if (!e.target.closest('.sov-inner')) closeOverlay();
});

// Attach hover + click listeners to schedule cells
const dayNames = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
const timeRows = { 0: '08:00', 1: '09:00', 2: '15:30', 3: '16:45', 4: '18:30' }; // Penyesuaian ke jam 18:30

document.querySelectorAll('.schedule-table tbody tr').forEach((row, rowIdx) => {
  const time = timeRows[rowIdx] || '';
  row.querySelectorAll('td:not(.time-col)').forEach((cell, colIdx) => {
    if (cell.classList.contains('empty')) return;
    const rawText = (cell.innerText || cell.textContent).trim().replace(/[\s\n]+/g, ' ');
    if (!rawText) return;
    const day      = dayNames[colIdx] || '';
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    cell.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      hoverTimeout = setTimeout(() => {
        const key  = Object.keys(kelasData).find(k => rawText.toLowerCase().includes(k.toLowerCase())) || rawText;
        const data = kelasData[key] || { photos: ['', '', ''], video: '' };
        openOverlay(key, day, time, data);
      }, 1000);
    });

    cell.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
    });

    cell.addEventListener('click', () => {
      if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
      const key  = Object.keys(kelasData).find(k => rawText.toLowerCase().includes(k.toLowerCase())) || rawText;
      const data = kelasData[key] || { photos: ['', '', ''], video: '' };
      openOverlay(key, day, time, data);
    });
  });
});

stage.addEventListener('mouseleave', (e) => {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
  if (!overlay.contains(e.relatedTarget)) closeOverlay();
});


// ── KELAS VIDEO MODAL ──
function openKelasVideoModal(className, videoSrc) {
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('videoModalTitle');
  const body  = document.getElementById('videoModalBody');

  title.textContent = 'Dokumentasi Kelas — ' + className;

  if (videoSrc) {
    body.innerHTML = `<video controls autoplay playsinline src="${videoSrc}" style="width:100%;display:block;background:#000;max-height:70vh;"></video>`;
  } else {
    body.innerHTML = `
      <div class="video-modal-placeholder">
        <p style="font-size:16px;color:var(--white);margin-bottom:12px;">Video belum tersedia</p>
        <p>Tambahkan path video dokumentasi kelas <strong>${className}</strong> ke dalam kode:<br><br>
        <code>kelasData['${className}'].video = 'video/nama-file.mp4'</code><br><br>
        Foto kelas bisa ditambahkan di: <code>kelasData['${className}'].photos</code></p>
      </div>`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}


// ── PRICING TABS SCROLL FADE ──
const pricingTabs = document.querySelector('.pricing-tabs');
if (pricingTabs) {
  const checkTabsScroll = () => {
    const atEnd = pricingTabs.scrollLeft + pricingTabs.clientWidth >= pricingTabs.scrollWidth - 4;
    pricingTabs.classList.toggle('at-end', atEnd);
  };
  pricingTabs.addEventListener('scroll', checkTabsScroll, { passive: true });
  checkTabsScroll();
}