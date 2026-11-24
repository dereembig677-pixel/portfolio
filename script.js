// رفتارهای سایت و انیمیشن‌های اسکرول. لازم نیست چیزی را اینجا تغییر دهید.
document.documentElement.classList.add('js');
var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (id) { return document.getElementById(id); };
var clamp = function (v) { return Math.min(Math.max(v, 0), 1); };

// سال شمسی در پایین صفحه
try {
  $('year').textContent = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' })
    .format(new Date()).replace(/[^۰-۹]/g, '');
} catch (e) {}

// جدا کردن کلمات برای افکت «روشن شدن کلمه به کلمه»
var wordBlocks = Array.prototype.map.call(document.querySelectorAll('.reveal-words'), function (el) {
  var words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  return { el: el, words: el.querySelectorAll('.w') };
});

// دکمه‌ی پایانی با حالت «پاپ» ظاهر می‌شود
var pops = document.querySelectorAll('.pop');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  pops.forEach(function (el) { io.observe(el); });
} else { pops.forEach(function (el) { el.classList.add('in'); }); }

var bar = $('progress'), heroInner = $('hero-inner'), orbs = $('orbs').children;
var reels = $('reels'), track = $('track'), reelCards = track.children;
var aiCard = $('ai-card');

function update() {
  var vh = window.innerHeight, sy = window.scrollY;

  // ۱. نوار پیشرفت بالای صفحه
  var max = document.documentElement.scrollHeight - vh;
  bar.style.transform = 'scaleX(' + (max > 0 ? sy / max : 0) + ')';

  // روشن شدن کلمات (برای همه، حتی بدون انیمیشن)
  var nearEnd = clamp(1 - (max - sy) / (vh * 0.2)); // at the very bottom, finish every sentence
  wordBlocks.forEach(function (b) {
    var r = b.el.getBoundingClientRect();
    var p = calm ? 1 : Math.max(clamp((vh - r.top) / (vh * 0.45)), r.bottom < vh ? nearEnd : 0);
    var n = Math.ceil(p * b.words.length);
    for (var i = 0; i < b.words.length; i++) b.words[i].classList.toggle('on', i < n);
  });
  if (calm) return;

  // ۲. متن معرفی کوچک، محو و تار می‌شود
  var hp = clamp(sy / (vh * 0.8));
  heroInner.style.transform = 'translateY(' + hp * -60 + 'px) scale(' + (1 - hp * 0.12) + ')';
  heroInner.style.opacity = 1 - hp;
  heroInner.style.filter = 'blur(' + hp * 8 + 'px)';

  // ۳. گوی‌های رنگی با سرعت‌های مختلف حرکت می‌کنند
  for (var o = 0; o < orbs.length; o++) {
    var sp = [0.35, -0.25, 0.15][o];
    orbs[o].style.transform = 'translate3d(' + sy * sp * 0.4 + 'px,' + sy * sp + 'px,0)';
  }

  // ۴. ریلزها با اسکرول عمودی، افقی جابه‌جا می‌شوند و موج می‌زنند
  var rr = reels.getBoundingClientRect();
  var rp = clamp(-rr.top / (rr.height - vh));
  var shift = Math.max(track.scrollWidth - window.innerWidth, 0);
  track.style.transform = 'translateX(' + rp * shift + 'px)';
  var enter = clamp((vh - rr.top) / vh);
  for (var k = 0; k < reelCards.length; k++) {
    var c = reelCards[k];
    var appear = clamp(enter * 1.6 - k * 0.12);
    c.style.setProperty('--y', ((1 - appear) * 120 + Math.sin(rp * 6 + k) * 14).toFixed(1) + 'px');
    c.style.setProperty('--r', ((1 - appear) * (k % 2 ? 6 : -6)).toFixed(2) + 'deg');
    c.style.opacity = appear.toFixed(2);
  }

  // ۵. کارت هوش مصنوعی بزرگ می‌شود، گوشه‌هایش صاف‌تر و رنگ‌هایش می‌چرخند
  var ar = aiCard.getBoundingClientRect();
  var ap = clamp((vh - ar.top) / (vh * 0.9));
  aiCard.style.setProperty('--s', (0.8 + ap * 0.2).toFixed(3));
  aiCard.style.setProperty('--rad', (48 - ap * 20).toFixed(1) + 'px');
  aiCard.style.setProperty('--spin', (sy * 0.15 % 360).toFixed(1) + 'deg');
  aiCard.style.setProperty('--glow', ap.toFixed(2));
}

var ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () { update(); ticking = false; });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
update();

// ===== پخش ویدیو داخل سایت =====
// اینستاگرام، یوتیوب (و شورتس)، آپارات، ویمئو، یا فایل mp4. لینک‌های دیگر در تب جدید باز می‌شوند.
function source(url) {
  var m;
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { video: url };
  if ((m = url.match(/instagram\.com\/(?:reel|reels|p)\/([\w-]+)/))) return { src: 'https://www.instagram.com/reel/' + m[1] + '/embed', vertical: true };
  if ((m = url.match(/youtube\.com\/shorts\/([\w-]{11})/))) return { src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', vertical: true };
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/))) return { src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0' };
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return { src: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1' };
  if ((m = url.match(/aparat\.com\/v\/(\w+)/))) return { src: 'https://www.aparat.com/video/video/embed/videohash/' + m[1] + '/vt/frame' };
  return null;
}
var player = $('player'), frame = player.querySelector('.frame');
function closePlayer() { frame.innerHTML = ''; if (player.open) player.close(); }
if (player.showModal) {
  player.querySelector('.close').addEventListener('click', closePlayer);
  player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });
  player.addEventListener('close', function () { frame.innerHTML = ''; });
}
document.querySelectorAll('[data-video]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (!href || href === '#') { e.preventDefault(); return; } // هنوز لینکی گذاشته نشده
    var s = source(href);
    if (!s || !player.showModal) { a.target = '_blank'; a.rel = 'noopener'; return; }
    e.preventDefault();
    var vertical = s.vertical || a.classList.contains('reel');
    player.classList.toggle('vertical', vertical);
    frame.innerHTML = s.video
      ? '<video src="' + s.video + '" controls autoplay playsinline></video>'
      : '<iframe src="' + s.src + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="ویدیو"></iframe>';
    player.showModal();
  });
});
