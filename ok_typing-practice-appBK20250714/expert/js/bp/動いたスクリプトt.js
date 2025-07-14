// script.js －－ここから最後まで全部コピーして下さい－－
document.addEventListener('DOMContentLoaded', () => {

/* ---------- 1. データ ---------- */
const lines = [
  "あかさたなはまやらわ",
  "いきしちにひみり",
  "うくすつぬふむゆる",
  "えけせてねへめれ",
  "おこそとのほもよろをん"
];
const kana2roma = {
  あ:["a"],い:["i"],う:["u"],え:["e"],お:["o"],
  か:["ka"],き:["ki"],く:["ku"],け:["ke"],こ:["ko"],
  さ:["sa"],し:["shi","si"],す:["su"],せ:["se"],そ:["so"],
  た:["ta"],ち:["chi","ti"],つ:["tsu","tu"],て:["te"],と:["to"],
  な:["na"],に:["ni"],ぬ:["nu"],ね:["ne"],の:["no"],
  は:["ha"],ひ:["hi"],ふ:["fu","hu"],へ:["he"],ほ:["ho"],
  ま:["ma"],み:["mi"],む:["mu"],め:["me"],も:["mo"],
  や:["ya"],ゆ:["yu"],よ:["yo"],
  ら:["ra"],り:["ri"],る:["ru"],れ:["re"],ろ:["ro"],
  わ:["wa"],を:["wo"],ん:["n","nn","xn"]
};

/* ---------- 2. DOM ---------- */
const $ = s => document.querySelector(s);
const textEl=$("#practice-text"), field=$("#input-field");
const nextC=$("#next-char"), nextR=$("#next-roma");
const wpm=$("#wpm"), acc=$("#accuracy"), errEl=$("#errors");
const kb=$("#keyboard"), start=$("#start-btn"), legend=$("#finger-legend");
const feedbackOverlay=$("#feedback-overlay"), correctMark=$("#correct-mark"),
      wrongMark=$("#wrong-mark"), retryMessage=$("#retry-message");

/* ---------- 3. 仮想キーボード (JIS-109) ---------- */
const jisLayout=[
  /* 行1 */[{t:'半/全',c:'Backquote',s:2,k:'`'},{t:'1',c:'Digit1',s:2,k:'1'},{t:'2',c:'Digit2',s:2,k:'2'},
           {t:'3',c:'Digit3',s:2,k:'3'},{t:'4',c:'Digit4',s:2,k:'4'},{t:'5',c:'Digit5',s:2,k:'5'},
           {t:'6',c:'Digit6',s:2,k:'6'},{t:'7',c:'Digit7',s:2,k:'7'},{t:'8',c:'Digit8',s:2,k:'8'},
           {t:'9',c:'Digit9',s:2,k:'9'},{t:'0',c:'Digit0',s:2,k:'0'},{t:'-',c:'Minus',s:2,k:'-'},
           {t:'^',c:'Equal',s:2,k:'^'},{t:'¥',c:'IntlYen',s:2,k:'¥'},{t:'Backspace',c:'Backspace',s:4,k:'backspace'}],
  /* 行2 */[{t:'Tab',c:'Tab',s:3,k:'tab'},{t:'Q',c:'KeyQ',s:2,k:'q'},{t:'W',c:'KeyW',s:2,k:'w'},
           {t:'E',c:'KeyE',s:2,k:'e'},{t:'R',c:'KeyR',s:2,k:'r'},{t:'T',c:'KeyT',s:2,k:'t'},
           {t:'Y',c:'KeyY',s:2,k:'y'},{t:'U',c:'KeyU',s:2,k:'u'},{t:'I',c:'KeyI',s:2,k:'i'},
           {t:'O',c:'KeyO',s:2,k:'o'},{t:'P',c:'KeyP',s:2,k:'p'},{t:'@',c:'BracketLeft',s:2,k:'@'},
           {t:'[',c:'BracketRight',s:2,k:'['}],
  /* 行3 */[{t:'Caps',c:'CapsLock',s:4,k:'capslock'},{t:'A',c:'KeyA',s:2,k:'a'},{t:'S',c:'KeyS',s:2,k:'s'},
           {t:'D',c:'KeyD',s:2,k:'d'},{t:'F',c:'KeyF',s:2,k:'f'},{t:'G',c:'KeyG',s:2,k:'g'},
           {t:'H',c:'KeyH',s:2,k:'h'},{t:'J',c:'KeyJ',s:2,k:'j'},{t:'K',c:'KeyK',s:2,k:'k'},
           {t:'L',c:'KeyL',s:2,k:'l'},{t:';',c:'Semicolon',s:2,k:';'},
           {t:':',c:'Quote',s:2,k:':'},{t:'Enter',c:'Enter',s:5,k:'enter'}],
  /* 行4 */[{t:'Shift',c:'ShiftLeft',s:5,k:'shift'},{t:'Z',c:'KeyZ',s:2,k:'z'},{t:'X',c:'KeyX',s:2,k:'x'},
           {t:'C',c:'KeyC',s:2,k:'c'},{t:'V',c:'KeyV',s:2,k:'v'},{t:'B',c:'KeyB',s:2,k:'b'},
           {t:'N',c:'KeyN',s:2,k:'n'},{t:'M',c:'KeyM',s:2,k:'m'},{t:',',c:'Comma',s:2,k:','},
           {t:'.',c:'Period',s:2,k:'.'},{t:'/',c:'Slash',s:2,k:'/'},{t:'_',c:'IntlRo',s:2,k:'_'},
           {t:'Shift',c:'ShiftRight',s:5,k:'shift'}],
  /* 行5 */[{t:'Ctrl',c:'ControlLeft',s:3,k:'control'},{t:'Win',c:'MetaLeft',s:2,k:'meta'},
           {t:'Alt',c:'AltLeft',s:2,k:'alt'},{t:'無変換',c:'NonConvert',s:3,k:'nonconvert'},
           {t:'Space',c:'Space',s:8,k:' '},{t:'変換',c:'Convert',s:3,k:'convert'},
           {t:'かな',c:'KanaMode',s:3,k:'kanamode'},{t:'Win',c:'MetaRight',s:2,k:'meta'},
           {t:'App',c:'ContextMenu',s:2,k:'contextmenu'},{t:'Ctrl',c:'ControlRight',s:3,k:'control'}]
];
jisLayout.forEach(row=>{
  row.forEach((k,i)=>{
    const d=document.createElement('div');d.className='key';
    if(i===0)d.classList.add('key-row-start');
    d.dataset.code=k.c;d.dataset.key=k.k;d.textContent=k.t;
    if(k.s)d.style.gridColumn=`span ${k.s}`;kb.appendChild(d);
  });
});
const keyButtons=[...kb.children];

/* ---------- 4. 指マッピング ---------- */
const fingerMap={
 "1qaz":'left-pinky',"2wsx":'left-ring',"3edc":'left-middle',"4rfv5tgb":'left-index',
 "6yhn7ujm":'right-index',"8ik,":'right-middle',"9ol.":'right-ring',"0p;:[@]-^¥":'right-pinky',
 " ":"thumb',"_/]":'right-pinky','`':'left-pinky','-':'right-pinky',
 "^":'right-pinky','¥':'right-pinky','@':'right-pinky',
 "[":'right-pinky',']':'right-pinky',';':'right-ring',':':'right-ring','/':'right-pinky','_':'right-pinky'};
const getFingerForKey=ch=>{
  ch=ch.toLowerCase();
  for(const [keys,f] of Object.entries(fingerMap)){if(keys.includes(ch))return f;}
  return null;
};

/* ---------- 5. Legend ---------- */
new Set(Object.values(fingerMap)).forEach(f=>{
  const span=document.createElement('span');
  const [side,part]=f.split('-');
  span.textContent=({left:'左',right:'右',thumb:''}[side]||'')+
    {pinky:'小指',ring:'薬指',middle:'中指',index:'人差指',thumb:'親指'}[part||'thumb'];
  span.className=`finger-${f}`;legend.appendChild(span);
});

/* ---------- 6. 状態 ---------- */
let lineIdx=0,charIdx=0,errors=0,startTime=null;
let currentKanaRomaVariants=[],currentCorrectRoma='';
let correctKanaChars=new Set(),errorKanaChars=new Set();

/* ---------- 7. 描画 ---------- */
function drawLine(){
  textEl.innerHTML=lines[lineIdx].split('').map((c,i)=>{
    const cls=[];
    if(correctKanaChars.has(i))cls.push('correct');
    else if(errorKanaChars.has(i))cls.push('wrong-kana');
    else if(i===charIdx)cls.push('current-char');
    const style=i===charIdx&&!errorKanaChars.has(i)?' style="color:#2196f3;text-decoration:underline;"':'';
    return `<span class="${cls.join(' ')}"${style}>${c}</span>`;
  }).join('');
}
function clearNextKey(){
  document.querySelectorAll('.next-key,.next-finger').forEach(el=>el.classList.remove('next-key','next-finger'));
  document.querySelectorAll('#next-roma span').forEach(el=>el.classList.remove('next-char-part'));
  correctMark.classList.remove('show');wrongMark.classList.remove('show');retryMessage.classList.remove('show');
}

function _setupCurrentCharacterState(){
  const kana=lines[lineIdx][charIdx];
  if(kana){
    currentKanaRomaVariants=kana2roma[kana];
    if(field.value==='')currentCorrectRoma=currentKanaRomaVariants[0];
    nextC.textContent=kana;nextR.hidden=false;
  }else{start.disabled=false;nextC.textContent='Finish!';nextR.hidden=true;clearNextKey();field.blur();}
}

function showNextKey(){
  clearNextKey();
  const kana=lines[lineIdx][charIdx];if(!kana){nextC.textContent='Finish!';nextR.hidden=true;return;}
  let nextExpectChar='',typedLen=field.value.length;
  for(const r of currentKanaRomaVariants){if(r.startsWith(field.value)){nextExpectChar=r[typedLen];currentCorrectRoma=r;break;}}
  if(!nextExpectChar){nextR.textContent='...';return;}
  nextC.textContent=kana;
  nextR.innerHTML=[...currentCorrectRoma].map((ch,i)=>{
    const f=getFingerForKey(ch);return `<span class="${i<typedLen?'correct-char':i===typedLen?'next-char-part':''} finger-${f||''}">${ch}</span>`;
  }).join('');
  const btn=keyButtons.find(b=>b.dataset.key===nextExpectChar);if(btn)btn.classList.add('next-key');
  const finger=getFingerForKey(nextExpectChar),fspan=$(`.finger-${finger}`);if(fspan)fspan.classList.add('next-finger');
  document.documentElement.style.setProperty('--current-color',getComputedStyle(document.documentElement).getPropertyValue(`--${finger}`));
}
const darkenColor=(c,p)=>!c||c==='transparent'?c:(()=>{
  if(!c.startsWith('rgb'))return c;
  let [r,g,b]=c.match(/\d+/g).map(Number),f=(100-p)/100;
  return `rgb(${[r,g,b].map(x=>Math.min(255,Math.round(x*f))).join(',')})`;
})();
function updateStats(){
  if(!startTime)return;
  const mins=(performance.now()-startTime)/60000,typedKana=correctKanaChars.size;
  wpm.textContent=Math.round(typedKana/5/mins||0);
  const total=typedKana+errors;acc.textContent=Math.max(0,Math.round(typedKana/Math.max(total,1)*100));
  errEl.textContent=errors;
}

function prepareNextCharFeedback(isCorrect){
  const killShake=()=>textEl.querySelector('.shake-on-error')?.classList.remove('shake-on-error');
  killShake();correctMark.innerText='';wrongMark.innerText='';retryMessage.style.display='none';
  if(isCorrect){correctMark.innerText='〇';feedbackOverlay.classList.add('show');}
  else{errors++;wrongMark.innerText='×';retryMessage.style.display='block';feedbackOverlay.classList.add('show');
       const cur=textEl.querySelector('.current-char');if(cur){cur.classList.add('shake-on-error');setTimeout(()=>cur.classList.remove('shake-on-error'),500);}}
}

function _updateDisplayAfterInput(){_setupCurrentCharacterState();drawLine();updateStats();showNextKey();}

/* ---------- 8. 入力処理 ---------- */
function handleKeyPress(e){
  feedbackOverlay.classList.remove('show');
  if(!start.disabled){if(e.key===' '){e.preventDefault();start.click();}return;}
  e.preventDefault();
  if(e.isComposing&&e.key.length===0)return;
  const ign=['Shift','Control','Alt','CapsLock','Enter','Backspace','Tab','Meta','ContextMenu',
    'ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown','Delete','Insert',
    ...Array.from({length:12},(_,i)=>`F${i+1}`),'Escape','PrintScreen','ScrollLock','Pause','NumLock'];
  if(e.ctrlKey||e.altKey||e.metaKey||ign.includes(e.key)){if(!(e.key.length===1&&/^[a-z0-9]$/i.test(e.key)&&(e.ctrlKey||e.altKey||e.metaKey)))return;}
  const k=toHalfWidthAlphaNum(e.key).toLowerCase();
  if(!k||!/^[a-z0-9\-\[\]\\;,./`@^¥_:]$/.test(k))return;
  if(!startTime)startTime=performance.now();
  const typed=field.value+k;
  let part=false,full=false,match=null;
  for(const r of currentKanaRomaVariants){if(r.startsWith(typed)){part=true;match=r;if(typed===r)full=true;break;}}
  const btn=keyButtons.find(b=>b.dataset.code===e.code);
  if(btn){
    const f=getFingerForKey(k),root=getComputedStyle(document.documentElement);
    const base=root.getPropertyValue(`--${f||'thumb'}`).trim();
    btn.style.backgroundColor=base;btn.style.borderColor=base;btn.style.color='#fff';
    btn.style.borderBottomColor=darkenColor(base,15);btn.classList.add('pressed',part?'correct-press':'wrong-press');
    setTimeout(()=>{btn.classList.remove('pressed','correct-press','wrong-press');
      Object.assign(btn.style,{backgroundColor:'',borderColor:'',color:'',borderBottomColor:''});},200);
  }
  if(part&&!full){field.value=typed;currentCorrectRoma=match;}
  else if(part&&full){field.value=typed;prepareNextCharFeedback(true);correctKanaChars.add(charIdx);charIdx++;}
  else{prepareNextCharFeedback(false);field.value='';errorKanaChars.add(charIdx);}
  if(charIdx>=lines[lineIdx].length){charIdx=0;lineIdx=(lineIdx+1)%lines.length;correctKanaChars.clear();errorKanaChars.clear();}
  _updateDisplayAfterInput();
}

/* ---------- 9. ゲーム開始 ---------- */
start.onclick=()=>{start.disabled=true;field.focus();
  lineIdx=0;charIdx=0;errors=0;startTime=null;wpm.textContent=0;acc.textContent=100;errEl.textContent=0;
  correctKanaChars.clear();errorKanaChars.clear();clearNextKey();_updateDisplayAfterInput();};

document.addEventListener('keydown',handleKeyPress);
}); // DOMContentLoaded end

/* ---------- 10. ユーティリティ ---------- */
function toHalfWidthAlphaNum(str){
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g,s=>String.fromCharCode(s.charCodeAt(0)-0xFEE0));
}
// script.js －－ここまで全部コピーして下さい－－
