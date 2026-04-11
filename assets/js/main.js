
  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 150);
  });

  // Photo swap
  function swapWithMain(thumbCell) {
    const mainCell = document.getElementById('mainCell');
    const mainPH  = mainCell.querySelector('.photo-placeholder').cloneNode(true);
    const mainOV  = mainCell.querySelector('.photo-overlay').cloneNode(true);
    const thumbPH = thumbCell.querySelector('.photo-placeholder').cloneNode(true);
    const thumbOV = thumbCell.querySelector('.photo-overlay').cloneNode(true);
    mainCell.style.opacity = '0';
    mainCell.style.transform = 'scale(0.97)';
    setTimeout(() => {
      mainCell.querySelector('.photo-placeholder').replaceWith(thumbPH);
      mainCell.querySelector('.photo-overlay').replaceWith(thumbOV);
      thumbCell.querySelector('.photo-placeholder').replaceWith(mainPH);
      thumbCell.querySelector('.photo-overlay').replaceWith(mainOV);
      mainCell.style.opacity = '1';
      mainCell.style.transform = 'scale(1)';
    }, 200);
  }

  // Tab switching
  function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + tabId);
    panel.classList.add('active');
    panel.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => observer.observe(el), 10);
    });
  }

  // ── VIDEO INTRO MODAL ──
  // Trainer video config — ganti nilai `src` dengan path video lokal setelah aset tersedia.
  // Contoh: src: 'video/basuki-intro.mp4'
  const trainerVideos = {
    basuki: {
      name: 'Coach Basuki',
      src: 'assets/video/Coach_Basuki_Intro.mp4'
    },
    mario: {
      name: 'Coach Mario',
      src: 'assets/video/Coach_Mario_Intro.mp4'
    }
  };

  function openVideoModal(coachId) {
    const config = trainerVideos[coachId];
    const modal  = document.getElementById('videoModal');
    const title  = document.getElementById('videoModalTitle');
    const body   = document.getElementById('videoModalBody');

    title.textContent = 'Video Perkenalan — ' + config.name;

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
    // Stop video playback
    const video = modal.querySelector('video');
    if (video) { video.pause(); video.src = ''; }
  }

  function closeVideoModalOnBackdrop(e) {
    if (e.target === document.getElementById('videoModal')) closeVideoModal();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
