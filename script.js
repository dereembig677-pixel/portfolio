// رفتارهای کوچک سایت. لازم نیست چیزی را اینجا تغییر دهید.
document.documentElement.classList.add('js');
var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// سال شمسی در پایین صفحه
try {
  document.getElementById('year').textContent =
    new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date()).replace(/[^۰-۹]/g, '');
} catch (e) {}

// ظاهر شدن آرام بخش‌ها هنگام اسکرول
var fades = document.querySelectorAll('.fade');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  fades.forEach(function (el) { io.observe(el); });
} else {
  fades.forEach(function (el) { el.classList.add('in'); });
}

// بزرگ شدن شوریل هنگام اسکرول (مثل سایت اپل)
var reel = document.getElementById('reel');
if (reel && !calm) {
  var grow = function () {
    var r = reel.getBoundingClientRect();
    var p = Math.min(Math.max((window.innerHeight - r.top) / (window.innerHeight * 0.9), 0), 1);
    reel.style.setProperty('--s', (0.86 + p * 0.14).toFixed(3));
  };
  window.addEventListener('scroll', grow, { passive: true });
  window.addEventListener('resize', grow);
  grow();
}

// پخش ویدیو داخل سایت (یوتیوب، ویمئو، آپارات). لینک‌های دیگر در تب جدید باز می‌شوند.
function embedUrl(url) {
  var m;
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/))) return 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0';
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1';
  if ((m = url.match(/aparat\.com\/v\/(\w+)/))) return 'https://www.aparat.com/video/video/embed/videohash/' + m[1] + '/vt/frame';
  return null;
}
var player = document.getElementById('player');
var frame = player && player.querySelector('.frame');
function closePlayer() { frame.innerHTML = ''; if (player.open) player.close(); }
if (player && player.showModal) {
  player.querySelector('.close').addEventListener('click', closePlayer);
  player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });
  player.addEventListener('close', function () { frame.innerHTML = ''; });
}
document.querySelectorAll('[data-video]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (!href || href === '#') { e.preventDefault(); return; } // هنوز لینکی گذاشته نشده
    var src = embedUrl(href);
    if (!src || !player || !player.showModal) { a.target = '_blank'; a.rel = 'noopener'; return; }
    e.preventDefault();
    frame.innerHTML = '<iframe src="' + src + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="ویدیو"></iframe>';
    player.showModal();
  });
});
