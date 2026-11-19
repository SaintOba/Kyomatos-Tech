(function () {
  var A = window.anime || {};
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !reduce && typeof A.animate === 'function';

  /* hero: headline words rise in, wave line draws itself */
  if (canAnimate) {
    var words = document.querySelectorAll('.hero h1 .w');
    if (words.length) {
      A.animate(words, { opacity: [0, 1], translateY: [36, 0], duration: 800, delay: A.stagger(90), ease: 'outExpo' });
    }
    var wave = document.querySelector('.wave path.r');
    if (wave && wave.getTotalLength) {
      var len = wave.getTotalLength();
      wave.style.strokeDasharray = len;
      wave.style.strokeDashoffset = len;
      A.animate(wave, { strokeDashoffset: [len, 0], duration: 2600, delay: 300, ease: 'inOutSine' });
    }
    /* scroll reveal */
    var items = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && items.length) {
      items.forEach(function (el) { el.style.opacity = 0; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          A.animate(e.target, { opacity: [0, 1], translateY: [24, 0], duration: 650, ease: 'outCubic' });
        });
      }, { threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    }
  }
})();
