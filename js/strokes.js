/* Порядок черт: анимация «рисования» знака по чертам.
   Данные — KanjiVG © Ulrich Apel, CC BY-SA 3.0 (https://kanjivg.tagaini.net).
   Есть кандзи, хирагана и катакана. Файл знака загружается один раз
   и сохраняется в localStorage, дальше работает без интернета.

   Для полностью офлайн-работы положите SVG-файлы KanjiVG в папку data/kanjivg/
   (имена вида 06728.svg) — они проверяются первыми. */
const SK = (() => {
 const SRC = [
  h => `data/kanjivg/${h}.svg`,
  h => `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${h}.svg`,
  h => `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${h}.svg`
 ];
 const mem = {};
 const hex = c => c.codePointAt(0).toString(16).padStart(5, '0');
 const NUM = /matrix\(\s*[-\d.]+[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]+([-\d.]+)[\s,]+([-\d.]+)/;

 function parse(t) {
  const d = new DOMParser().parseFromString(t, 'image/svg+xml');
  if (d.querySelector('parsererror')) return null;
  const ps = [...d.querySelectorAll('path')]
   .map(p => ({id: p.getAttribute('id') || '', d: p.getAttribute('d')}))
   .filter(p => p.d && /-s\d+$/.test(p.id))
   .sort((a, b) => a.id.match(/\d+$/)[0] - b.id.match(/\d+$/)[0]);
  if (!ps.length) return null;
  const n = [...d.querySelectorAll('text')].map(e => {
   const m = (e.getAttribute('transform') || '').match(NUM);
   return m ? [+m[1], +m[2]] : null;
  });
  return {s: ps.map(p => p.d), n};
 }

 async function get(u) {
  const a = new AbortController(), t = setTimeout(() => a.abort(), 8000);
  try {
   const r = await fetch(u, {signal: a.signal});
   if (!r.ok) throw 0;
   return await r.text();
  } finally { clearTimeout(t); }
 }

 async function load(c) {
  const h = hex(c);
  if (mem[h]) return mem[h];
  try {
   const v = JSON.parse(localStorage.getItem('kv:' + h));
   if (v && v.s) return mem[h] = v;
  } catch (e) {}
  for (const f of SRC) {
   try {
    const v = parse(await get(f(h)));
    if (v) {
     mem[h] = v;
     try { localStorage.setItem('kv:' + h, JSON.stringify(v)); } catch (e) {}
     return v;
    }
   } catch (e) {}
  }
  return null;
 }

 function player(box) {
  const NS = 'http://www.w3.org/2000/svg',
   svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 109 109');
  svg.setAttribute('class', 'sv');
  box.insertBefore(svg, box.querySelector('canvas'));
  let run = 0, anims = [];
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
   wait = ms => new Promise(r => setTimeout(r, ms)),
   mkEl = (tag, at) => {
    const e = document.createElementNS(NS, tag);
    for (const k in at) e.setAttribute(k, at[k]);
    return e;
   };

  function stop() {
   run++;
   anims.forEach(a => a.cancel());
   anims = [];
  }

  function clear() {
   stop();
   svg.innerHTML = '';
   svg.style.transition = 'none';
   svg.style.opacity = '';
  }

  async function play(data) {
   stop();
   const my = run, hint = css('--hint'), hot = css('--hot');
   svg.innerHTML = '';
   svg.style.transition = 'none';
   svg.style.opacity = 1;
   for (let i = 0; i < data.s.length; i++) {
    if (my !== run || !svg.isConnected) return;
    const p = mkEl('path', {
     d: data.s[i], fill: 'none', stroke: hot, 'stroke-width': 4.6,
     'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    });
    svg.appendChild(p);
    const L = p.getTotalLength() + 2;
    p.style.strokeDasharray = L + ' ' + L;
    p.style.strokeDashoffset = L;
    // номер черты рядом с её началом
    const pos = data.n && data.n[i] || (() => {
     const q = p.getPointAtLength(0);
     return [q.x - 7, q.y - 2];
    })();
    const t = mkEl('text', {x: pos[0], y: pos[1]});
    t.textContent = i + 1;
    svg.appendChild(t);
    anims.push(t.animate([{opacity: 0}, {opacity: 1}], {duration: 220, fill: 'both'}));
    const a = p.animate([{strokeDashoffset: L}, {strokeDashoffset: 0}], {
     duration: Math.max(420, L * 15), easing: 'ease-in-out', fill: 'forwards'
    });
    anims.push(a);
    try { await a.finished; } catch (e) { return; }
    if (my !== run) return;
    p.setAttribute('stroke', hint);
    await wait(200);
   }
   await wait(1000);
   if (my !== run) return;
   // после показа знак остаётся бледной подсказкой для обводки
   svg.style.transition = 'opacity 1s';
   svg.style.opacity = .3;
  }

  return {play, clear, stop};
 }

 return {load, player};
})();
