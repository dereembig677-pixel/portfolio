// رفتارهای سایت و انیمیشن‌های اسکرول. لازم نیست چیزی را اینجا تغییر دهید.
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

// کلمه‌به‌کلمه روشن شدن متن
var wordBlocks = Array.prototype.map.call(document.querySelectorAll('.reveal-words'), function (el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  return { el: el, words: el.querySelectorAll('.w') };
});

// دکمه‌ی پایانی «پاپ» می‌شود
var pops = document.querySelectorAll('.pop');
if ('IntersectionObserver' in window) {
  var popIo = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); popIo.unobserve(e.target); } });
  }, { threshold: 0.3 });
  pops.forEach(function (el) { popIo.observe(el); });
} else { pops.forEach(function (el) { el.classList.add('in'); }); }

var bar = $('progress'), heroInner = $('hero-inner'), orbs = $('orbs').children;
var reels = $('reels'), track = $('track'), reelCards = track.children;
var phone = $('phone');

function update() {
  var vh = window.innerHeight, sy = window.scrollY || window.pageYOffset;
  var max = document.documentElement.scrollHeight - vh;

  // ۱. نوار پیشرفت
  bar.style.transform = 'scaleX(' + (max > 0 ? clamp(sy / max) : 0) + ')';

  // ۲. روشن شدن کلمات
  var nearEnd = clamp(1 - (max - sy) / (vh * 0.2));
  wordBlocks.forEach(function (b) {
    var r = b.el.getBoundingClientRect();
    var p = calm ? 1 : Math.max(clamp((vh - r.top) / (vh * 0.45)), r.bottom < vh ? nearEnd : 0);
    var n = Math.ceil(p * b.words.length);
    for (var i = 0; i < b.words.length; i++) b.words[i].classList.toggle('on', i < n);
  });
  if (calm) return;

  // ۳. متن معرفی کوچک و محو می‌شود
  var hp = clamp(sy / (vh * 0.75));
  heroInner.style.transform = 'translate3d(0,' + (hp * -70).toFixed(1) + 'px,0) scale(' + (1 - hp * 0.1).toFixed(3) + ')';
  heroInner.style.opacity = (1 - hp).toFixed(3);

  // ۴. نورهای رنگی با سرعت‌های متفاوت حرکت می‌کنند
  var speeds = [0.3, -0.22, 0.12];
  for (var o = 0; o < orbs.length; o++) {
    orbs[o].style.transform = 'translate3d(' + (sy * speeds[o] * 0.35).toFixed(1) + 'px,' + (sy * speeds[o]).toFixed(1) + 'px,0)';
  }

  // ۵. ریلزها افقی حرکت می‌کنند و موج می‌زنند
  var rr = reels.getBoundingClientRect();
  var rp = clamp(-rr.top / Math.max(rr.height - vh, 1));
  var shift = Math.max(track.scrollWidth - document.documentElement.clientWidth, 0);
  track.style.transform = 'translate3d(' + (rp * shift).toFixed(1) + 'px,0,0)';
  var enter = clamp((vh - rr.top) / vh);
  for (var k = 0; k < reelCards.length; k++) {
    var appear = clamp(enter * 1.6 - k * 0.12);
    reelCards[k].style.setProperty('--y', ((1 - appear) * 110 + Math.sin(rp * 6 + k) * 12).toFixed(1) + 'px');
    reelCards[k].style.setProperty('--r', ((1 - appear) * (k % 2 ? 6 : -6)).toFixed(2) + 'deg');
    reelCards[k].style.opacity = appear.toFixed(2);
  }

  // ۶. گوشی هوش مصنوعی از حالت کج و سه‌بعدی صاف می‌شود
  var pr = phone.getBoundingClientRect();
  var pp = clamp((vh - pr.top) / (vh * 0.85));
  phone.style.setProperty('--rx', ((1 - pp) * 28).toFixed(2) + 'deg');
  phone.style.setProperty('--ry', ((1 - pp) * 18).toFixed(2) + 'deg');
  phone.style.setProperty('--s', (0.82 + pp * 0.18).toFixed(3));
}

var ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () { update(); ticking = false; });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
window.addEventListener('load', onScroll);
update();

// ===== پیش‌نمایش بی‌صدا =====
function safePlay(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
// روی کامپیوتر: با بردن موس روی ریلز، بی‌صدا پخش می‌شود
if (canHover) {
  Array.prototype.forEach.call(reelCards, function (card) {
    var v = card.querySelector('video');
    card.addEventListener('mouseenter', function () { card.classList.add('previewing'); safePlay(v); });
    card.addEventListener('mouseleave', function () { card.classList.remove('previewing'); v.pause(); });
  });
}
// ویدیوی هوش مصنوعی وقتی دیده می‌شود، بی‌صدا پخش می‌شود
var aiVideo = $('ai-video');
if ('IntersectionObserver' in window && !calm) {
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) safePlay(aiVideo); else aiVideo.pause(); });
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
function stopAll() { document.querySelectorAll('video').forEach(function (v) { if (!frame.contains(v)) v.pause(); }); }
function closePlayer() { if (player.open) player.close(); }
function cleanUp() { frame.innerHTML = ''; document.body.style.overflow = ''; if (aiVisible()) safePlay(aiVideo); }
function aiVisible() { var r = aiVideo.getBoundingClientRect(); return !calm && r.bottom > 0 && r.top < window.innerHeight; }
if (player.showModal) {
  player.querySelector('.close').addEventListener('click', closePlayer);
  player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });
  player.addEventListener('close', cleanUp);
}
document.querySelectorAll('[data-video]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (!href || href === '#') { e.preventDefault(); return; }
    var s = source(href);
    if (!s || !player.showModal) { a.target = '_blank'; a.rel = 'noopener'; return; }
    e.preventDefault();
    stopAll();
    player.classList.toggle('wide', !!s.wide);
    frame.innerHTML = s.video
      ? '<video src="' + s.video + '" controls autoplay playsinline></video>'
      : '<iframe src="' + s.src + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="ویدیو"></iframe>';
    document.body.style.overflow = 'hidden';
    player.showModal();
  });
});
