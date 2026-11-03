const $=s=>document.querySelector(s),
ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},
sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
sh=a=>a.map(v=>[Math.random(),v]).sort((p,q)=>p[0]-q[0]).map(v=>v[1]),
HG='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
RM='a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n'.split(' '),
kana=t=>[...HG].map((c,i)=>({c:t?String.fromCharCode(c.charCodeAt(0)+96):c,m:RM[i],a:RM[i]})),
items=s=>s=='k'?K.map(k=>({c:k.c,m:k.m,a:k.r.join('・')})):kana(s=='t'),
FB={a:['あめ','いし','かわ','やま','ひと','つき'],m:['вода','гора','человек','луна','река','солнце']};
let K=ld('k',[{c:'木',m:'дерево',r:['き','もく']},{c:'水',m:'вода',r:['みず','すい']},{c:'火',m:'огонь',r:['ひ','か']}]),
W=ld('w',[]),cfg=ld('cfg',{s:'k',t:1,n:10,q:10}),P,Q={};
function go(n){clearTimeout(Q.tm);document.querySelectorAll('section').forEach((s,i)=>s.classList.toggle('on',i==n));document.querySelectorAll('nav button').forEach((b,i)=>b.classList.toggle('on',i==n));scrollTo(0,0);if(n==5)qs()}
const cl=()=>{if(P&&P.stop)P.stop();$('#m').classList.remove('on')},tst=s=>{cfg.s=s;sv('cfg',cfg);go(5)},cf=(k,v)=>{cfg[k]=k=='t'?+v:v;sv('cfg',cfg);qs()};
const fit=(c,m,w)=>Math.min(m,Math.floor(w/[...c].length));
function rk(){$('#kl').innerHTML=K.map((k,i)=>`<div class=c onclick="op('k',${i})"><big style="font-size:${fit(k.c,30,46)}px">${esc(k.c)}</big><small>${esc(k.m)}</small></div>`).join('')||'<p class=mu>Пока пусто — добавьте первый иероглиф выше.</p>'}
function rg(s,id){$(id).innerHTML=items(s).map((k,i)=>`<div class=c onclick="op('${s}',${i})"><big>${k.c}</big><small>${k.m}</small></div>`).join('')}
function rw(){$('#wl').innerHTML=W.map((w,i)=>`<div class="p wd"><div><b>${esc(w.j)}</b> <span class=mu>${esc(w.r)}</span><br>${esc(w.t)}</div><button onclick=dw(${i})>✕</button></div>`).join('')||'<p class=mu>Слов пока нет — добавьте первое выше.</p>'}
function addK(){const c=[...$('#kc').value].filter(x=>x.trim()).slice(0,6).join(''),m=$('#km').value.trim();if(!c||!m)return;K.unshift({c,m,r:$('#kr').value.split(/[,、，]/).map(s=>s.trim()).filter(Boolean)});sv('k',K);['#kc','#km','#kr'].forEach(s=>$(s).value='');rk()}
function aw(){const j=$('#wj').value.trim();if(!j)return;W.unshift({j,r:$('#wr').value.trim(),t:$('#wt').value.trim()});sv('w',W);['#wj','#wr','#wt'].forEach(s=>$(s).value='');rw()}
function dw(i){W.splice(i,1);sv('w',W);rw()}
function del(i){K.splice(i,1);sv('k',K);rk();cl()}
function pad(b,ch){
 b.innerHTML='<div class=g>'+esc(ch)+'</div><canvas></canvas>';
 const g=b.firstChild,c=b.lastChild,d=devicePixelRatio||1,w=b.clientWidth,x=c.getContext('2d'),
 pl=SK.player(b),hm=$('#hm'),hh=$('#hh'),
 upd=()=>{if(!on)return;if(hm)hm.textContent=msg;if(hh)hh.hidden=!shown},say=t=>{msg=t;upd()};
 c.width=c.height=w*d;x.scale(d,d);
 let S=[],u=null,ink='#fff',msg='',shown=false,on=true;
 const gi=()=>{ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||ink},
 dr=()=>{x.clearRect(0,0,w,w);x.lineCap=x.lineJoin='round';x.lineWidth=9;x.strokeStyle=ink;
  S.forEach(s=>{x.beginPath();s.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));if(s.length==1)x.lineTo(s[0][0]+.1,s[0][1]);x.stroke()})},
 pt=e=>{const r=c.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 c.onpointerdown=e=>{gi();c.setPointerCapture(e.pointerId);u=[pt(e)];S.push(u);dr()};
 c.onpointermove=e=>{if(u){u.push(pt(e));dr()}};
 c.onpointerup=c.onpointercancel=()=>u=null;
 gi();
 return{
  clr(){gi();S=[];dr()},
  und(){gi();S.pop();dr()},
  // Подсказка: порядок черт рисуется по очереди
  async gh(){
   say('Загружаю порядок черт…');pl.clear();g.style.opacity=0;
   const v=await SK.load(ch);
   if(!b.isConnected)return;
   if(!v){say('Порядок черт не найден. Нужен интернет (один раз для каждого знака).');g.style.opacity=.22;return}
   shown=true;say('Порядок черт: '+v.s.length);
   pl.play(v)
  },
  hd(){pl.clear();g.style.opacity=0;shown=false;say('')},
  act(v){on=v;upd()},
  stop(){pl.stop()},
  sh(){g.style.opacity=.55}
 }
}
// Несколько знаков (日本): вкладка на каждый знак, у каждого своё поле и своя подсказка
function mpad(h,word){
 const cs=[...word].filter(x=>x.trim()),n=cs.length;
 h.innerHTML=(n>1?'<div class="row tabs">'+cs.map((c,i)=>`<button class="ch${i?'':' on'}">${esc(c)}</button>`).join('')+'</div>':'')+cs.map(()=>'<div class=pd></div>').join('');
 const bx=[...h.querySelectorAll('.pd')],tb=[...h.querySelectorAll('.tabs button')],ps=bx.map((b,i)=>pad(b,cs[i]));
 let cur=0;
 const show=i=>{cur=i;bx.forEach((b,j)=>b.style.display=j==i?'':'none');tb.forEach((t,j)=>t.classList.toggle('on',j==i));ps.forEach((q,j)=>q.act(j==i))};
 tb.forEach((t,j)=>t.onclick=()=>show(j));
 show(0);
 return{clr:()=>ps[cur].clr(),und:()=>ps[cur].und(),gh:()=>ps[cur].gh(),hd:()=>ps[cur].hd(),stop:()=>ps.forEach(q=>q.stop()),sh:()=>ps.forEach(q=>q.sh())}
}
function op(s,i){
 const k=items(s)[i];
 $('#mb').innerHTML=`<b class=bg style="font-size:${fit(k.c,64,290)}px">${esc(k.c)}</b><div>${esc(k.m)}${s=='k'&&k.a?' · '+esc(k.a):''}</div><div id=pp></div><div class="mu hm" id=hm></div><div class=row><button onclick=P.clr()>Очистить</button><button onclick=P.und()>Отмена</button><button onclick=P.gh()>Подсказка</button><button id=hh hidden onclick=P.hd()>Скрыть</button></div><div class=row>${s=='k'?`<button onclick=del(${i})>Удалить</button>`:''}<button class=b onclick=cl()>Закрыть</button></div>`;
 $('#m').classList.add('on');P=mpad($('#pp'),k.c)
}
function qs(){
 clearTimeout(Q.tm);$('#qz').style.display='none';
 const ch=(k,v,l)=>`<button class="ch${cfg[k]==v?' on':''}" onclick="cf('${k}','${v}')">${l}</button>`;
 $('#st').style.display='block';
 $('#st').innerHTML=`<div class=p><b>Что учим</b><div class=row>${ch('s','k','漢字')}${ch('s','h','ひらがな')}${ch('s','t','カタカナ')}</div></div>
<div class=p><b>Вид теста</b><div class=row style="flex-direction:column;align-items:stretch">${ch('t',1,'① Чтения: выбери верное')}${ch('t',2,'② Значение → нарисуй знак')}${ch('t',3,'③ Блиц: угадай на время')}</div></div>
<div class=p>Вопросов: <b id=nv>${cfg.n}</b><input type=range min=3 max=50 value=${cfg.n} oninput="cfg.n=+this.value;$('#nv').textContent=this.value;sv('cfg',cfg)">
Секунд на блиц: <b id=qv>${cfg.q}</b><input type=range min=3 max=30 value=${cfg.q} oninput="cfg.q=+this.value;$('#qv').textContent=this.value;sv('cfg',cfg)"></div>
<button class="b w" onclick=begin()>始め！ Начать</button>`}
function begin(){
 const t=cfg.t,pool=items(cfg.s).filter(i=>t==1?i.a:i.m);
 if(!pool.length){alert('Сначала добавьте иероглифы во вкладке «Кандзи».');return}
 const s=sh(pool);
 Q={L:Array.from({length:cfg.n},(_,i)=>s[i%s.length]),i:0,s:0,src:cfg.s,pool:items(cfg.s),t};
 $('#st').style.display='none';$('#qz').style.display='block';ask()
}
function opts(it,k){
 const v=[...new Set(Q.pool.map(i=>i[k]).filter(x=>x&&x!=it[k]))],f=v.length<3?FB[k].filter(x=>x!=it[k]&&!v.includes(x)):[];
 return sh([it[k],...sh(v).concat(f).slice(0,3)])
}
function ask(){
 clearTimeout(Q.tm);
 if(Q.i>=Q.L.length)return fin();
 const it=Q.L[Q.i],t=Q.t,q=$('#qz'),
 hd=`<div class="row sp"><span class=mu>${Q.i+1} / ${Q.L.length}</span><span>✓ ${Q.s}</span><button onclick=qs()>✕</button></div>`;
 if(t==2){
  q.innerHTML=hd+`<div class=p style="text-align:center"><div class=mu>Нарисуй знак:</div><b class=bg style="font-size:30px">${esc(it.m)}</b><div id=pp></div><div class=row id=ac><button onclick=P.clr()>Очистить</button><button onclick=P.und()>Отмена</button><button class=b onclick=chk()>Проверить</button></div></div>`;
  P=mpad($('#pp'),it.c);return}
 const k=t==1?'a':'m',cor=it[k],o=opts(it,k);
 q.innerHTML=hd+`<div class=p style="text-align:center">${t==3?'<div class=tb><i id=tb></i></div>':''}<b class=bg style="font-size:${fit(it.c,64,290)}px">${esc(it.c)}</b><div class=mu>${Q.src!='k'?'Какой это слог?':t==1?'Как читается?':'Что значит?'}</div>${o.map(x=>`<button class=o data-c=${x==cor?1:0} onclick=pk(this)>${esc(x)}</button>`).join('')}</div>`;
 if(t==3){const b=$('#tb');b.style.transition='none';b.offsetWidth;b.style.transition=`width ${cfg.q}s linear`;b.style.width='0';Q.tm=setTimeout(()=>pk(null),cfg.q*1000)}
}
function pk(b){
 clearTimeout(Q.tm);
 const ok=b&&b.dataset.c=='1';
 document.querySelectorAll('.o').forEach(e=>{e.disabled=true;if(e.dataset.c=='1')e.classList.add('ok')});
 if(ok)Q.s++;else if(b)b.classList.add('ng');
 Q.tm=setTimeout(()=>{Q.i++;ask()},ok?600:1300)
}
function chk(){P.sh();$('#ac').innerHTML='<button class=b onclick=rt(1)>✓ Верно</button><button onclick=rt(0)>✗ Неверно</button>'}
function rt(v){Q.s+=v;Q.i++;ask()}
function fin(){
 const n=Q.L.length,p=Math.round(Q.s/n*100);
 $('#qz').innerHTML=`<div class=p style="text-align:center"><b class=bg>${p>=80?'お見事！':p>=50?'いいね！':'頑張って！'}</b><div style="font-size:22px">${Q.s} / ${n} · ${p}%</div><div class=row><button class=b onclick=begin()>Ещё раз</button><button onclick=qs()>Настройки</button></div></div>`
}
rk();rg('h','#hl');rg('t','#tl');rw();
