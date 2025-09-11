// basic interactive behaviors for mobile-first site

document.addEventListener('DOMContentLoaded', function () {
    // year in footer
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  
    // mobile menu
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        mobileMenu.style.display = expanded ? 'none' : 'block';
        mobileMenu.setAttribute('aria-hidden', String(expanded));
      });
    }
  
    // lightbox modal
    const lightbox = document.getElementById('lightbox');
    const lightboxInner = document.getElementById('lightbox-inner');
    const closeBtn = document.querySelector('.close');
  
    // gallery data must correspond to DOM ordering - keep small array for captions
    const gallery = [
      { type:'image', caption:'Rajasthan sunset' },
      { type:'image', caption:'Houseboat backwaters' },
      { type:'image', caption:'Mountain retreat' },
      { type:'image', caption:'Traveler moments' },
      { type:'image', caption:'Cultural performance' },
      { type:'image', caption:'Tea garden mornings' },
      { type:'video', caption:'Beach waves' },
      { type:'video', caption:'River flow' },
      { type:'image', caption:'Evening market' }
    ];
  
    // attach click handlers for insta items (graceful fallback if HTML onclick not present)
    const items = document.querySelectorAll('.insta-item');
    items.forEach((el, idx) => {
      el.addEventListener('click', () => openModal(idx));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(idx);
        }
      });
    });
  
    function openModal(i) {
      const it = gallery[i] || { type: 'image', caption: '' };
      const target = items[i];
      // Try to reuse media src from DOM element for better reliability
      let mediaHtml = '';
      if (it.type === 'image') {
        const img = target.querySelector('img');
        const src = img ? img.src : '';
        mediaHtml = `<img src="${src}" alt="${it.caption}" style="width:100%;border-radius:10px">`;
      } else {
        const vid = target.querySelector('video');
        const src = vid ? (vid.querySelector('source')?.src || '') : '';
        // autoplay only when modal opened
        mediaHtml = `<video controls autoplay style="width:100%;border-radius:10px"><source src="${src}" type="video/mp4"></video>`;
      }
      lightboxInner.innerHTML = `${mediaHtml}<p class="muted" style="margin-top:10px">${it.caption}</p>`;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      // pause page videos to avoid double audio
      pauseAllInlineVideos();
      // focus management
      closeBtn?.focus();
    }
  
    function closeModal() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxInner.innerHTML = '';
      // resume nothing; keep videos paused (user intentional)
    }
  
    function pauseAllInlineVideos() {
      document.querySelectorAll('.insta-item video').forEach(v => {
        try { v.pause(); } catch (e) {}
      });
    }
  
    // close actions
    closeBtn?.addEventListener('click', closeModal);
    lightbox?.addEventListener('click', (ev) => { if (ev.target === lightbox) closeModal(); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });
  
    // lazy play videos only when visible on viewport (mobile data savings)
    const videoElems = document.querySelectorAll('.insta-item video');
    if ('IntersectionObserver' in window && videoElems.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const v = entry.target;
          if (entry.isIntersecting) {
            // set preload to auto when visible
            if (v.getAttribute('preload') !== 'auto') v.setAttribute('preload', 'auto');
            // optionally play muted loop for thumbnail
            v.play().catch(()=>{/* ignore autoplay block */});
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.5 });
      videoElems.forEach(v => io.observe(v));
    }
  
    // enhance form usability: small validation hint
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        // keep default simulated submit (alert) in HTML, but ensure required fields validity reported
        const valid = form.checkValidity();
        if (!valid) {
          e.preventDefault();
          form.reportValidity();
        }
      });
    }
  });