(() => {
  const $ = (s, c = document) => [...c.querySelectorAll(s)];

  /* mobile side navigation */
  const menu = $('.menu')[0], btn = $('.nav-toggle')[0], ov = $('.menu-ov')[0];
  const toggle = (open) => {
    open = open === undefined ? !menu.classList.contains('open') : open;
    menu.classList.toggle('open', open);
    ov.classList.toggle('show', open);
    document.body.classList.toggle('lock', open);
    btn.setAttribute('aria-expanded', open);
  };
  btn.addEventListener('click', () => toggle());
  ov.addEventListener('click', () => toggle(false));
  $('.menu-close')[0].addEventListener('click', () => toggle(false));
  $('.menu a').forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => e.key === 'Escape' && toggle(false));

  /* if an Unsplash photo fails, show a colourful placeholder */
  $('.ph img').forEach(img => {
    const fail = () => img.parentElement.classList.add('noimg');
    img.addEventListener('error', fail);
    if (img.complete && !img.naturalWidth) fail();
  });

  /* scroll-to-top */
  const top = $('.totop')[0];
  addEventListener('scroll', () => top.classList.toggle('show', scrollY > 500), { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* forms (front-end only: connect to your backend / email service) */
  $('form[data-form]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    f.classList.add('was-validated');
    if (!f.checkValidity()) return;
    f.querySelector('.ok-msg').style.display = 'block';
    f.reset(); f.classList.remove('was-validated');
  }));

  /* GSAP */
  if (!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // one orchestrated entrance for the hero
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero .hl > *', { y: 36, opacity: 0, duration: .7, stagger: .12 })
    .from('.hero .pic', { scale: .85, opacity: 0, rotate: -4, duration: .9 }, 0.2)
    .from('.hero .fx', { scale: 0, opacity: 0, duration: .6, stagger: .1 }, .5);

  // reveal sections on scroll
  gsap.set('.rv', { opacity: 0, y: 40 });
  ScrollTrigger.batch('.rv', {
    start: 'top 90%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power2.out', overwrite: true })
  });

  // objects & blobs drift while scrolling (data-speed = distance, data-rot = rotation)
  $('[data-speed]').forEach(el => {
    gsap.to(el, {
      y: parseFloat(el.dataset.speed) * -220,
      rotate: parseFloat(el.dataset.rot || 0),
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section,footer,.hero') || el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });

  // photos slide the opposite way for depth
  $('.pic').forEach(p => gsap.to(p.querySelector('.art-sq'), {
    rotate: '+=14', yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true }
  }));

  // number counters
  $('.count').forEach(c => {
    const o = { v: 0 };
    gsap.to(o, { v: +c.dataset.to, duration: 1.6, ease: 'power1.out', onUpdate: () => c.textContent = Math.round(o.v),
      scrollTrigger: { trigger: c, start: 'top 92%', once: true } });
  });
})();
