
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

  // Photo swap (FIX #2)
  // Swaps the inner HTML of a thumbnail with the main cell
  function swapWithMain(thumbCell) {
    const mainCell = document.getElementById('mainCell');

    // Clone content from both sides
    const mainPH  = mainCell.querySelector('.photo-placeholder').cloneNode(true);
    const mainOV  = mainCell.querySelector('.photo-overlay').cloneNode(true);
    const thumbPH = thumbCell.querySelector('.photo-placeholder').cloneNode(true);
    const thumbOV = thumbCell.querySelector('.photo-overlay').cloneNode(true);

    // Brief fade-out on main
    mainCell.style.opacity = '0';
    mainCell.style.transform = 'scale(0.97)';

    setTimeout(() => {
      // Replace content
      mainCell.querySelector('.photo-placeholder').replaceWith(thumbPH);
      mainCell.querySelector('.photo-overlay').replaceWith(thumbOV);
      thumbCell.querySelector('.photo-placeholder').replaceWith(mainPH);
      thumbCell.querySelector('.photo-overlay').replaceWith(mainOV);

      // Fade back in
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
