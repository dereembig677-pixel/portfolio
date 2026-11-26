// رفتارهای سایت و انیمیشن‌های اسکرول. لازم نیست چیزی را اینجا تغییر دهید.
// نکته: هیچ انیمیشنی اسکرول را نگه نمی‌دارد؛ صفحه همیشه آزادانه بالا و پایین می‌رود.
document.documentElement.classList.add('js');
var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
var $ = function (id) { return document.getElementById(id); };
var clamp = function (v) { return Math.min(Math.max(v, 0), 1); };

// سال شمسی
try {
  $('year').textContent = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' })
    .format(new Date()).replace(/[^۰-۹]/g, '');
} catch (e) {}

// تایم‌کد ویزور (مثل دوربین در حال ضبط)
var tc = $('timecode'), t0 = Date.now();
function pad(n) { return (n < 10 ? '0' : '') + n; }
if (tc && !calm) setInterval(function () {
  var ms = Date.now() - t0, s = Math.floor(ms / 1000);
  tc.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60) + ':' + pad(Math.floor(ms / 33.33) % 30);
}, 50);

// کلمه‌به‌کلمه روشن شدن متن
var wordBlocks = Array.prototype.map.call(document.querySelectorAll('.reveal-words'), function (el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  return { el: el, words: el.querySelectorAll('.w') };
});

// ظاهر شدن یک‌باره (ریلزها پشت سر هم، دکمه‌ی پایانی «پاپ»)
var once = document.querySelectorAll('.reel-row, .pop');
if ('IntersectionObserver' in window && !calm) {
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  once.forEach(function (el) { io.observe(el); });
} else { once.forEach(function (el) { el.classList.add('in'); }); }

var bar = $('progress'), heroInner = $('hero-inner'), glow = $('glow'), phone = $('phone'), toTop = $('to-top');

function update() {
  var vh = window.innerHeight, sy = window.scrollY || window.pageYOffset;
  var max = document.documentElement.scrollHeight - vh;

  bar.style.transform = 'scaleX(' + (max > 0 ? clamp(sy / max) : 0) + ')';   // نوار پیشرفت
  toTop.classList.toggle('show', sy > vh * 0.8);                             // دکمه‌ی بازگشت به بالا

  var nearEnd = clamp(1 - (max - sy) / (vh * 0.2));                          // روشن شدن کلمات
  wordBlocks.forEach(function (b) {
    var r = b.el.getBoundingClientRect();
    var p = calm ? 1 : Math.max(clamp((vh - r.top) / (vh * 0.45)), r.bottom < vh ? nearEnd : 0);
    var n = Math.ceil(p * b.words.length);
    for (var i = 0; i < b.words.length; i++) b.words[i].classList.toggle('on', i < n);
  });
  if (calm) return;

  if (sy < vh * 1.2) {                                                       // متن معرفی محو و نور جابه‌جا می‌شود
    var hp = clamp(sy / (vh * 0.75));
    heroInner.style.transform = 'translate3d(0,' + (hp * -60).toFixed(1) + 'px,0) scale(' + (1 - hp * 0.08).toFixed(3) + ')';
    heroInner.style.opacity = (1 - hp).toFixed(3);
    glow.style.transform = 'translate3d(0,' + (sy * 0.35).toFixed(1) + 'px,0)';
  }

  var pr = phone.getBoundingClientRect();                                    // گوشی از حالت کج صاف می‌شود
  if (pr.top < vh && pr.bottom > 0) {
    var pp = clamp((vh - pr.top) / (vh * 0.85));
    phone.style.setProperty('--rx', ((1 - pp) * 26).toFixed(2) + 'deg');
    phone.style.setProperty('--ry', ((1 - pp) * 16).toFixed(2) + 'deg');
    phone.style.setProperty('--s', (0.84 + pp * 0.16).toFixed(3));
  }
}
var ticking = false;
function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
window.addEventListener('load', onScroll);
update();

// ===== پیش‌نمایش بی‌صدا =====
function safePlay(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
if (canHover) {
  document.querySelectorAll('.reel').forEach(function (card) {
    var v = card.querySelector('video');
    card.addEventListener('mouseenter', function () { card.classList.add('previewing'); safePlay(v); });
    card.addEventListener('mouseleave', function () { card.classList.remove('previewing'); v.pause(); });
  });
}
var aiVideo = $('ai-video');
function aiVisible() { var r = aiVideo.getBoundingClientRect(); return !calm && r.bottom > 0 && r.top < window.innerHeight; }
if ('IntersectionObserver' in window && !calm) {
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && !player.open) safePlay(aiVideo); else aiVideo.pause(); });
  }, { threshold: 0.35 }).observe(aiVideo);
}

// ===== پخش ویدیو با صدا =====
function source(url) {
  var m;
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { video: url };
  if ((m = url.match(/instagram\.com\/(?:reel|reels|p)\/([\w-]+)/))) return { src: 'https://www.instagram.com/reel/' + m[1] + '/embed' };
  if ((m = url.match(/youtube\.com\/shorts\/([\w-]{11})/))) return { src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0' };
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/))) return { src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', wide: true };
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return { src: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1', wide: true };
  if ((m = url.match(/aparat\.com\/v\/(\w+)/))) return { src: 'https://www.aparat.com/video/video/embed/videohash/' + m[1] + '/vt/frame', wide: true };
  return null;
}
var player = $('player'), frame = player.querySelector('.frame');
function closePlayer() { if (player.open) player.close(); }
if (player.showModal) {
  player.querySelector('.close').addEventListener('click', closePlayer);
  player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });
  player.addEventListener('close', function () { frame.innerHTML = ''; if (aiVisible()) safePlay(aiVideo); });
}
document.querySelectorAll('[data-video]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (!href || href === '#') { e.preventDefault(); return; }
    var s = source(href);
    if (!s || !player.showModal) { a.target = '_blank'; a.rel = 'noopener'; return; }
    e.preventDefault();
    document.querySelectorAll('video').forEach(function (v) { v.pause(); });
    player.classList.toggle('wide', !!s.wide);
    frame.innerHTML = s.video
      ? '<video src="' + s.video + '" controls autoplay playsinline></video>'
      : '<iframe src="' + s.src + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="ویدیو"></iframe>';
    player.showModal();
  });
});
