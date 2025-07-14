/* Problem Engine Kanji-hint final */
(()=>{
  /* inject CSS once */
  if(!document.getElementById('pe-style')){
    const css=`.typed-ok,.typed-ng{position:relative;font-weight:700;font-family:monospace}.typed-ok{color:#0c0}.typed-ng{color:#f33}.typed-ok::after,.typed-ng::after{position:absolute;top:-1.25em;left:0;font-size:.8em}.typed-ok::after{content:'◯'}.typed-ng::after{content:'×'}.key-hint{background:#ccc!important;border:2px solid #666!important;animation:blink .7s step-end infinite}.finger-hint{filter:brightness(1.4)}@keyframes blink{50%{opacity:.35}}`;
    const st=document.createElement('style');st.id='pe-style';st.textContent=css;document.head.appendChild(st);
  }

  const pick=a=>a[Math.random()*a.length|0];
  const r=n=>Math.floor(Math.random()*n);
  const half=s=>s.replace(/[０-９]/g,d=>'0123456789'[d.charCodeAt(0)-0xFF10]);

  const T=[
    ()=>`https://example.com/${pick(['ai','gemini','llama'])}`,
    ()=>`${pick(['ChatGPT','Gemini','Claude'])} uses ${pick(['Python','JS','Rust'])}`,
    ()=>`${pick(['Llama.cpp','LangChain'])} で 推論`,
    ()=>`${2020+r(10)}年${1+r(12)}月${1+r(28)}日`,
    ()=>`ｼﾌﾞﾔ ${100+r(900)}K`
  ];

  const bar=document.getElementById('typed-display');
  const prompt=document.getElementById('practice-text');
  const stats=document.getElementById('retry-message');
  const kb=document.getElementById('keyboard');

  const key2finger={Backquote:'left-pinky',NonConvert:'thumb',Convert:'thumb',Space:'thumb',F7:'left-index',F8:'left-index',F10:'right-index'};
  const char2key={'半':'Backquote','無':'NonConvert','変':'Convert','年':'Space','月':'Space','日':'Space'};

  let q='',i=0,ok=0,ng=0,start=0;

  const clearHint=()=>{
    if(kb) kb.querySelectorAll('.key-hint').forEach(el=>el.classList.remove('key-hint'));
    document.querySelectorAll('.finger-hint').forEach(el=>el.classList.remove('finger-hint'));
  };
  const hint=code=>{
    clearHint();
    if(!code||!kb) return;
    const keyEl=kb.querySelector(`[data-code="${code}"]`);
    keyEl&&keyEl.classList.add('key-hint');
    const fClass=key2finger[code];
    if(fClass){
      const fEl=document.querySelector(`.finger-${fClass}`);
      fEl&&fEl.classList.add('finger-hint');
    }
  };

  const upd=()=>{
    const m=(performance.now()-start)/60000;
    stats.textContent=`正:${ok} 誤:${ng} WPM:${m?Math.round((ok/5)/m):0}`;
  };

  const setQ=()=>{
    q=pick(T)(); i=0; ok=ng=0; bar.textContent='';
    prompt.textContent=q; start=performance.now(); upd();
    hint(char2key[q[0]]);
  };

  window.addEventListener('keydown',e=>{
    if(e.isComposing) return;
    clearHint();
    const key=half(e.key);
    const exp=half(q[i]||'');
    const good= key===exp || ('0123456789'.includes(exp)&&e.code===`Numpad${exp}`);
    const span=document.createElement('span');
    span.className= good? 'typed-ok':'typed-ng';
    span.textContent = exp;
    bar.appendChild(span);
    good? ok++ : ng++;
    i++; upd();
    if(i<q.length) hint(char2key[q[i]]);
    if(i===q.length) setTimeout(setQ,700);
  });

  /* ensure .key data-code attributes exist */
  if(kb) kb.querySelectorAll('.key').forEach(k=>{if(!k.dataset.code) k.dataset.code=k.id||'';});

  setQ();
})();
(()=>{window.problemEngineInit=true;const pick=a=>a[Math.random()*a.length|0],rnd=n=>Math.floor(Math.random()*n),T=[()=>`https://example.com/${pick(['ai','gemini','llama'])}`,()=>`${pick(['ChatGPT','Gemini','Claude'])} uses ${pick(['Python','JS','Rust'])}`,()=>`${pick(['Llama.cpp','LangChain'])} で 推論`,()=>`${2020+rnd(10)}年${1+rnd(12)}月${1+rnd(28)}日`,()=>`ｼﾌﾞﾔ ${100+rnd(900)}K`],half=s=>s.replace(/[０-９]/g,d=>'0123456789'[d.charCodeAt(0)-0xFF10]),bar=document.getElementById('typed-display'),prompt=document.getElementById('practice-text'),stats=document.getElementById('retry-message'),kb=document.getElementById('keyboard'),fingerMap={Backquote:'left-pinky',NonConvert:'thumb',Convert:'thumb',F7:'left-index',F8:'left-index',F10:'right-index'};let q='',i=0,ok=0,ng=0,start=0;const clearHint=()=>{kb&&kb.querySelectorAll('.key-hint').forEach(e=>e.classList.remove('key-hint'));document.querySelectorAll('.finger-hint').forEach(e=>e.classList.remove('finger-hint'))},hint=code=>{clearHint();if(!kb)return;const k=kb.querySelector(`[data-code="${code}"]`);k&&k.classList.add('key-hint');const f=document.querySelector(`.finger-${fingerMap[code]}`);f&&f.classList.add('finger-hint')},upd=()=>{const m=(performance.now()-start)/6e4;stats.textContent=`正:${ok} 誤:${ng} WPM:${m?Math.round((ok/5)/m):0}`},setQ=()=>{q=pick(T)();i=ok=ng=0;bar.textContent='';prompt.textContent=q;start=performance.now();upd();};window.addEventListener('keydown',e=>{if(e.isComposing)return;clearHint();const k=half(e.key),exp=half(q[i]||'');const g=k===exp||'0123456789'.includes(exp)&&e.code===`Numpad${exp}`;const s=document.createElement('span');s.className=g?'typed-ok':'typed-ng';s.textContent=g?'◯':'×';bar.appendChild(s);g?ok++:ng++;i++;upd();i===q.length&&setTimeout(setQ,600)});document.head.insertAdjacentHTML('beforeend','<style>.typed-ok{color:#0c0;font-weight:700}.typed-ng{color:#f33;font-weight:700}.key-hint{background:#ccc!important;border:2px solid #666!important;animation:blink 0.7s step-end infinite}.finger-hint{filter:brightness(1.3)}@keyframes blink{50%{opacity:.3}}</style>');setQ()})();
(()=>{
  if(window.__pe_final__) return; window.__pe_final__=true;
  /* inline CSS */
  (function(){if(document.getElementById('pe-style'))return;const s=document.createElement('style');s.id='pe-style';s.textContent='.typed-ok{color:#0c0;font-weight:700}.typed-ng{color:#f33;font-weight:700}';document.head.appendChild(s);}());
  const pick=a=>a[Math.random()*a.length|0];
  const rnd=n=>Math.floor(Math.random()*n);
  const T=[
    ()=>`https://example.com/${pick(['ai','gemini','llama'])}`,
    ()=>`${pick(['ChatGPT','Gemini','Claude'])} uses ${pick(['Python','JS','Rust'])}`,
    ()=>`${pick(['Llama.cpp','LangChain'])} で 推論`,
    ()=>`${2020+rnd(10)}年${1+rnd(12)}月${1+rnd(28)}日`,
    ()=>`ｼﾌﾞﾔ ${100+rnd(900)}K`
  ];
  const toHalf=s=>s.replace(/[０-９]/g,d=>'0123456789'[d.charCodeAt(0)-0xFF10]);
  const bar=document.getElementById('typed-display');
  const prompt=document.getElementById('practice-text');
  const stats=document.getElementById('retry-message');
  let q='',i=0,ok=0,ng=0,start=0;
  function setQ(){q=pick(T)();i=ok=ng=0;bar.textContent='';prompt.textContent=q;start=performance.now();upd();}
  function upd(){const m=(performance.now()-start)/60000;stats.textContent=`正:${ok} 誤:${ng} WPM:${m?Math.round((ok/5)/m):0}`;}
  window.addEventListener('keydown',e=>{if(e.isComposing)return;const key=toHalf(e.key);const exp=toHalf(q[i]||'');const good= key===exp || ('0123456789'.includes(exp)&&e.code===`Numpad${exp}`);const sp=document.createElement('span');sp.className=good?'typed-ok':'typed-ng';sp.textContent=good?'◯':'×';bar.appendChild(sp);good?ok++:ng++;i++;upd();if(i===q.length)setTimeout(setQ,600);} );
  setQ();
})();

(()=>{
  'use strict';
  // Guard multiple load
  if(window.problemEngineInit) return;
  window.problemEngineInit = true;

  /* ---------------- 1. Utilities ---------------- */
  const rand = arr => arr[Math.floor(Math.random()*arr.length)];
  const randInt = n => Math.floor(Math.random()*n);

  /* ---------------- 2. Templates ---------------- */
  const TEMPLATES = [
    {id:'url',gen:()=>`https://example.com/${rand(['ai','gemini','llama'])}`,keys:['F10']},
    {id:'date',gen:()=>`${2020+randInt(6)}年${1+randInt(12)}月${1+randInt(28)}日`,keys:['F10']},
    {id:'aiTerm',gen:()=>`${rand(['ChatGPT','Gemini','Claude'])} uses ${rand(['Python','JS','Rust'])}`,keys:['F7','F10']},
    {id:'inference',gen:()=>`${rand(['Llama.cpp','Mistral','Gemma'])} で推論`,keys:['F8','F10']},
    {id:'passport',gen:()=>`${rand(['TANAKA','SUZUKI','SATO'])}/${rand(['AI','ML','DL'])}`,keys:['F10']}
  ];

  /* ---------------- 3. State ---------------- */
  let problemTokens = []; // array of tokens (char or key label e.g. '[F7]')
  let cursor = 0;
  let correct = 0;
  let miss = 0;
  let startTime = 0;

  /* ---------------- 4. DOM ---------------- */
  const practiceText = document.getElementById('practice-text');
  const typedDisplay = document.getElementById('typed-display');
  const bar = document.getElementById('typed-display');
  // inject inline style once
  (function addInlineStyle(){
    if(document.getElementById('pe-inline-style')) return;
    const st=document.createElement('style');
    st.id='pe-inline-style';
    st.textContent=`.typed-ok{color:#0c0}.typed-ng{color:#f33}`;
    document.head.appendChild(st);
  })();
  const retryMsg = document.getElementById('retry-message');

  /* ---------------- 5. Problem Generation ---------------- */
  function setProblem(){
    const t = rand(TEMPLATES);
    const base = t.gen();
    // embed required keys as [F7] tokens (2ch width assumption)
    const keyTokens = t.keys.map(k=>`[${k}]`).join(' ');
    const full = `${base} ${keyTokens}`;
    practiceText.textContent = full;
    problemTokens = tokenize(full);
    cursor = 0;
    correct = 0;
    miss = 0;
    startTime = 0;
    if(typedDisplay) typedDisplay.innerHTML='';
    if(retryMsg) retryMsg.hidden = true;
  }

  function tokenize(str){
    // Split into array, treating [F7] etc as single token
    const regex = /(\[F(?:[0-9]{1,2})]|\[半\/全]|\[無変換]|\[変換]|\[かな])/g;
    const parts = str.split(regex).filter(Boolean);
    return parts.flatMap(p=>{
      if(p.match(/^\[.*]$/)) return [p];
      return [...p];
    });
  }

  /* ---------------- 6. Typed Display ---------------- */
  const SKIP_KEYS = ['Shift','Control','Alt','Meta'];
  function appendMark(ok){
    if(!typedDisplay) return;
    const span=document.createElement('span');
    span.className = ok ? 'typed-ok':'typed-ng';
    span.textContent = ok ? '◯':'×';
    bar.appendChild(span);
  }

  /* ---------------- 7. Key Handling ---------------- */
  function onKey(e){
    if(e.isComposing) return; // during IME composition
    if(cursor>=problemTokens.length) return; // done

    if(!startTime) startTime = performance.now();

    const expected = problemTokens[cursor];
    let ok = false;

    if(expected.startsWith('[')){
      // key token expected
      const label = expected.slice(1,-1); // remove brackets
      if(matchSpecialKey(e,label)) ok = true;
    }else{
      // normal char
      if(e.key === expected) ok = true;
    }

    appendMark(ok);
    if(ok){
      cursor++;
      correct++;
      if(cursor===problemTokens.length){
        showResult();
      }
    }else{
      miss++;
    }
  }

  function matchSpecialKey(e,label){
    switch(label){
      case 'F7': return e.code==='F7';
      case 'F8': return e.code==='F8';
      case 'F10':return e.code==='F10';
      case '半/全':return e.code==='Backquote' || e.code==='IntlYen';
      case '無変換':return e.code==='NonConvert';
      case '変換': return e.code==='Convert';
      case 'かな': return e.code==='KanaMode';
      default: return false;
    }
  }

  function showResult(){
    const diff = performance.now()-startTime;
    const timeMin = diff/60000;
    const wpm = timeMin ? Math.round((correct/5)/timeMin) : 0;
    if(retryMsg){
      retryMsg.textContent = `正: ${correct}  誤: ${miss}  WPM: ${wpm}`;
      retryMsg.hidden = false;
    }
  }

  /* ---------------- 8. Init ---------------- */
  window.addEventListener('keydown',onKey);
  setProblem();

  /* ---------------- 9. FAQ Modal ---------------- */
  function setupFAQ(){
    const modal = document.getElementById('faqModal');
    if(modal) return; // already added by HTML edit
  }
  setupFAQ();
})();
