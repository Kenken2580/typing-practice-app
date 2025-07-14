/* starter/blindtouch3/problem-engine.js */
(()=>{

  /* === util === */
  const pick=a=>a[Math.random()*a.length|0];
  const rnd=n=>Math.floor(Math.random()*n);
  const half=s=>s.replace(/[０-９]/g,d=>'0123456789'[d.charCodeAt(0)-0xFF10]);

  /* === templates === */
  const T=[
    ()=>`https://example.com/${pick(['ai','gemini','llama'])}`,
    ()=>`${pick(['ChatGPT','Gemini','Claude'])} uses ${pick(['Python','JS','Rust'])}`,
    ()=>`${pick(['Llama.cpp','LangChain'])} で 推論`,
    ()=>`${2020+rnd(10)}年${1+rnd(12)}月${1+rnd(28)}日`,
    ()=>`ｼﾌﾞﾔ ${100+rnd(900)}K`
  ];

  /* === DOM === */
  const bar    = document.getElementById('typed-display');
  const prompt = document.getElementById('practice-text');
  const stats  = document.getElementById('retry-message');
  const kb     = document.getElementById('keyboard');

  /* === maps === */
  const key2finger={Backquote:'left-pinky',NonConvert:'thumb',Convert:'thumb',Space:'thumb',F7:'left-index',F8:'left-index',F10:'right-index'};
  const word2key  ={ '半/全':'Backquote','無変換':'NonConvert','変換':'Convert'};
  const char2key  ={ '半':'Backquote','無':'NonConvert','変':'Convert','年':'Space','月':'Space','日':'Space'};
  const seqMap    ={ '年':['KeyN','KeyE','KeyN','Space'], '月':['KeyG','KeyA','KeyT','KeyU','Space'], '日':['KeyN','KeyI','KeyC','KeyH','Space']};

  let seqIdx=0,q='',idx=0,ok=0,ng=0,start=0;

  /* === hint helpers === */
  const clearHints=()=>{kb.querySelectorAll('.key-hint').forEach(k=>k.classList.remove('key-hint'));document.querySelectorAll('.finger-hint').forEach(f=>f.classList.remove('finger-hint'))};
  const hintKey=code=>{
    const k=kb.querySelector(`[data-code=\"${code}\"]`);k&&k.classList.add('key-hint');
    const f=document.querySelector(`.finger-${key2finger[code]}`);f&&f.classList.add('finger-hint');
  };
  const showHint=()=>{
    clearHints();
    for(const w in word2key){if(q.slice(idx).startsWith(w)) return hintKey(word2key[w]);}
    const ch=q[idx]||''; if(seqMap[ch]) return hintKey(seqMap[ch][seqIdx]);
    char2key[ch]&&hintKey(char2key[ch]);
  };

  /* === stats === */
  const upd=()=>{const m=(performance.now()-start)/6e4;stats.textContent=`正:${ok}  誤:${ng}  WPM:${m?Math.round((ok/5)/m):0}`};

  /* === new question === */
  const newQ=()=>{q=pick(T)();idx=ok=ng=seqIdx=0;bar.textContent='';prompt.textContent=q;start=performance.now();upd();showHint();};

 /* === key handler === */
window.addEventListener('keydown', e => {
  if (e.isComposing) return;

  const key = half(e.key);
  const exp = half(q[idx] || '');

  /* 判定（テンキー許容） */
  const good = key === exp ||
               ('0123456789'.includes(exp) && e.code === `Numpad${exp}`);

  /* ◯× を 1 文字描画 */
  const span = document.createElement('span');
  span.className = good ? 'typed-ok' : 'typed-ng';
  span.textContent = exp;
  bar.appendChild(span);

  /* ローマ字シーケンス進捗 */
  if (seqMap[exp]) {
    seqIdx = (seqIdx + 1) % seqMap[exp].length;
  } else {
    seqIdx = 0;
  }

  if (good) ok++; else ng++;
  idx++;                              // 文字位置を進める
  upd();                              // 統計更新

  if (idx === q.length) {             // 行が終わったら次のお題
    return setTimeout(newQ, 600);
  }
  showHint();                         // 次のキーを点滅
});
