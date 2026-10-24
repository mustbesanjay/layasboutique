(function () {
  /* ---------- Toast ---------- */
  var toast = document.getElementById('toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  /* ---------- Hero carousel ---------- */
  var slides = document.getElementById('slides');
  var dots = document.querySelectorAll('#heroDots .dot');
  var total = dots.length, idx = 0, timer;

  function goHero(i) {
    idx = (i + total) % total;
    slides.style.transform = 'translateX(' + (-idx * 100) + '%)';
    dots.forEach(function (d, n) { d.classList.toggle('active', n === idx); });
  }
  function startAuto() { stopAuto(); timer = setInterval(function () { goHero(idx + 1); }, 5000); }
  function stopAuto() { clearInterval(timer); }

  document.getElementById('heroPrev').addEventListener('click', function () { goHero(idx - 1); startAuto(); });
  document.getElementById('heroNext').addEventListener('click', function () { goHero(idx + 1); startAuto(); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { goHero(n); startAuto(); }); });

  var heroTrack = document.getElementById('heroTrack');
  heroTrack.addEventListener('mouseenter', stopAuto);
  heroTrack.addEventListener('mouseleave', startAuto);
  var sx = null;
  heroTrack.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stopAuto(); }, { passive: true });
  heroTrack.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) goHero(idx + (dx < 0 ? 1 : -1));
    sx = null; startAuto();
  });
  goHero(0); startAuto();

  /* ---------- Category carousel (2 per view) ---------- */
  var catTrack = document.getElementById('catTrack');
  var catDots = document.querySelectorAll('#catDots .d');
  var catPage = 0, catPages = catDots.length;
  var STEP = 2 * 171 + 2 * 14; // two cards + two gaps = 370px

  function goCat(p) {
    catPage = Math.max(0, Math.min(catPages - 1, p));
    catTrack.style.transform = 'translateX(' + (-catPage * STEP) + 'px)';
    catDots.forEach(function (d, n) { d.classList.toggle('active', n === catPage); });
  }
  document.getElementById('catPrev').addEventListener('click', function () { goCat(catPage - 1); });
  document.getElementById('catNext').addEventListener('click', function () { goCat(catPage + 1); });
  catDots.forEach(function (d, n) { d.addEventListener('click', function () { goCat(n); }); });

  
  /* ---------- Nav active state ---------- */
  var navLinks = document.querySelectorAll('#mainNav a');

  navLinks.forEach(function (a) {
      var currentPage = window.location.pathname.split('/').pop();

      if (a.getAttribute('href') === currentPage) {
          a.classList.add('active');
      } else {
          a.classList.remove('active');
      }
  });


  /* ---------- Cart + wishlist ---------- */
  var count = 0;
  var bagCount = document.getElementById('bagCount');
  var bagBtn = document.getElementById('bagBtn');
  document.getElementById('grid').addEventListener('click', function (e) {
    var card = e.target.closest('.card'); if (!card) return;
    var name = card.getAttribute('data-name');
    if (e.target.closest('.add')) {
      count++;
      bagCount.textContent = count;
      bagBtn.setAttribute('aria-label', 'Shopping Bag, ' + count + ' item' + (count === 1 ? '' : 's'));
      showToast(name + ' added to bag');
    }
    var w = e.target.closest('.wish');
    if (w) {
      var on = w.classList.toggle('on');
      showToast(on ? 'Added to wishlist' : 'Removed from wishlist');
    }
  });

  /* ---------- Newsletter ---------- */
  var form = document.getElementById('newsForm');
  var email = document.getElementById('newsEmail');
  var msg = document.getElementById('newsMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    email.classList.toggle('err', !ok);
    msg.className = 'msg' + (ok ? '' : ' bad');
    msg.textContent = ok ? 'Thank you for subscribing!' : 'Please enter a valid email address.';
    if (ok) form.reset();
  });
  email.addEventListener('input', function () { email.classList.remove('err'); });

  /* ---------- Footer accordions: keep one open at a time ---------- */
  var details = document.querySelectorAll('footer details');
  details.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();