/* Темы (светлая / тёмная) и падающие лепестки.
   Подключается в <head>, чтобы тема применялась до первой отрисовки. */
(function () {
 var R = document.documentElement;
 var COLORS = {dark: '#050506', light: '#ececee'};

 function saved() {
  try {
   var t = JSON.parse(localStorage.getItem('theme'));
   if (t === 'light' || t === 'dark') return t;
  } catch (e) {}
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
 }

 function paintButton() {
  var b = document.getElementById('tg');
  if (!b) return;
  var dark = R.dataset.theme === 'dark';
  b.textContent = dark ? '\u2600\uFE0E' : '\u263E\uFE0E';
  b.setAttribute('aria-label', dark ? 'Светлая тема' : 'Тёмная тема');
 }

 function setTheme(t, save) {
  R.dataset.theme = t;
  var m = document.querySelector('meta[name=theme-color]');
  if (m) m.content = COLORS[t];
  paintButton();
  if (save) { try { localStorage.setItem('theme', JSON.stringify(t)); } catch (e) {} }
  window.dispatchEvent(new Event('themechange'));
 }

 window.toggleTheme = function () {
  setTheme(R.dataset.theme === 'dark' ? 'light' : 'dark', true);
 };

 setTheme(saved(), false);

 /* ---------- Лепестки ---------- */
 var PALETTE = {
  light: ['#f7a8c0', '#f48fb1', '#fbc2d3', '#ef7aa0'],
  dark: ['#ffffff', '#f4eff4', '#e8e2ec', '#fde9f0']
 };

 function petals() {
  var c = document.getElementById('sk');
  if (!c) return;
  var x = c.getContext('2d'),
   rm = matchMedia('(prefers-reduced-motion: reduce)').matches,
   w = 0, h = 0, d = 1, list = [], last = 0;

  function size() {
   d = Math.min(window.devicePixelRatio || 1, 2);
   w = innerWidth; h = innerHeight;
   c.width = w * d; c.height = h * d;
   x.setTransform(d, 0, 0, d, 0, 0);
  }

  function make(init) {
   var s = .6 + Math.random() * .9;
   return {
    x: init ? Math.random() * w : (Math.random() * 1.3 - .2) * w,
    y: init ? Math.random() * h : -20 - Math.random() * h * .25,
    L: 8 * s + 3,
    vy: (20 + Math.random() * 34) * (.7 + .3 * s),
    wind: 12 + Math.random() * 22,
    amp: 10 + Math.random() * 22,
    f: .6 + Math.random() * .9,
    ph: Math.random() * 6.28,
    a: Math.random() * 6.28,
    rv: (Math.random() - .5) * 2.2,
    ff: .8 + Math.random() * 1.6,
    c: Math.random() * 4 | 0,
    al: .72 + Math.random() * .25
   };
  }

  function fill() {
   var n = rm ? 14 : Math.max(18, Math.min(60, Math.round(w * h / 9000)));
   list = [];
   for (var i = 0; i < n; i++) list.push(make(true));
  }

  function shape(L) {
   x.beginPath();
   x.moveTo(0, L * .5);
   x.bezierCurveTo(L * .55, L * .25, L * .6, -L * .45, L * .12, -L * .5);
   x.quadraticCurveTo(0, -L * .34, -L * .12, -L * .5);
   x.bezierCurveTo(-L * .6, -L * .45, -L * .55, L * .25, 0, L * .5);
   x.closePath();
  }

  function draw(t) {
   x.clearRect(0, 0, w, h);
   var pal = PALETTE[R.dataset.theme] || PALETTE.dark;
   for (var i = 0; i < list.length; i++) {
    var p = list[i];
    x.save();
    x.translate(p.x, p.y);
    x.rotate(p.a);
    x.scale(1, .4 + .6 * Math.abs(Math.cos(t / 1000 * p.ff + p.ph)));
    x.globalAlpha = p.al;
    x.fillStyle = pal[p.c];
    shape(p.L);
    x.fill();
    x.restore();
   }
  }

  function loop(t) {
   var dt = Math.min((t - last) / 1000, .05);
   last = t;
   for (var i = 0; i < list.length; i++) {
    var p = list[i];
    p.y += p.vy * dt;
    p.x += (p.wind + Math.sin(t / 1000 * p.f + p.ph) * p.amp) * dt;
    p.a += p.rv * dt;
    if (p.y > h + 20 || p.x > w + 40) list[i] = make(false);
   }
   draw(t);
   requestAnimationFrame(loop);
  }

  size(); fill();
  if (rm) {
   draw(0);
   addEventListener('themechange', function () { draw(0); });
  } else {
   requestAnimationFrame(function (t) { last = t; loop(t); });
  }

  addEventListener('resize', function () {
   var ow = w;
   size();
   if (w !== ow) fill();
   if (rm) draw(0);
  });
 }

 document.addEventListener('DOMContentLoaded', function () {
  paintButton();
  petals();
 });
})();
