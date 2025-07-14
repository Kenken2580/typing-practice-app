// Blind-Touch Builder – core script
(()=>{
'use strict';
// ---------- 1. Constants ----------
const PROMPT_COUNT=10;
const WEIGHTS={T_URL:1,T_AI_TERM:2,T_DATE:1,T_PASSPORT:1,T_STATION:1};
const SPECIAL_WIDE=['Backquote','NonConvert','Convert','F7','F8','F10'];
const KEY_LABEL={
  Backquote:'半/全', Minus:'-', Equal:'=', Backslash:'￥', IntlYen:'￥',
  NonConvert:'無変換', Convert:'変換', KanaMode:'かな',
  ShiftLeft:'Shift', ShiftRight:'Shift', ControlLeft:'Ctrl', ControlRight:'Ctrl',
  AltLeft:'Alt', AltRight:'Alt',
  // F1-F12
  F1:'F1',F2:'F2',F3:'F3',F4:'F4',F5:'F5',F6:'F6',F7:'F7',F8:'F8',F9:'F9',F10:'F10',F11:'F11',F12:'F12'
};

// 物理配列 (日本語109)
const ROWS=[
  ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Delete'],
  ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
  ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
  ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
  ['ShiftLeft','IntlYen','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
  ['ControlLeft','AltLeft','NonConvert','Space','Convert','KanaMode','AltRight','ControlRight']
];
const FINGER_COLORS=['red','orange','yellow','green','cyan','blue','purple','pink']; // placeholder
// ---------- 2. DOM refs ----------
const promptEl=document.getElementById('prompt-area');
const typedDisplay=document.getElementById('typed-display');
const nextBtn=document.getElementById('next-btn');
const statsEl=document.getElementById('stats');
const input=document.getElementById('key-capture');
input.style.opacity=0;input.focus();
// ---------- 3. Templates & Dictionary ----------
const dict={
  TOOL:['ChatGPT','Gemini','Claude','Llama','Mistral','Perplexity'],
  LANG:['Python','JavaScript','Rust','Go'],
  ACTION:['推論する','ベクトル検索する','要約する']
};
const templates=[
 {id:'T_URL',tmpl:'${p}://${d}/${path}',keys:['f10']},
 {id:'T_AI_TERM',tmpl:'${tool} は ${lang} で ${action}',keys:['f7','f10']},
 {id:'T_DATE',tmpl:'${y}年${m}月${d}日',keys:['f10']},
 {id:'T_PASSPORT',tmpl:'${sur}/${giv}',keys:['f10']},
 {id:'T_STATION',tmpl:'${kana} ${num}K',keys:['f8','f10']}
];
// ---------- 4. State ----------
let currentPrompt='',promptIdx=0,correct=0,miss=0,startTime=0;
// ---------- 5. Functions ----------
function pickTemplate(){
  const total=Object.values(WEIGHTS).reduce((a,b)=>a+b,0);
  let r=Math.random()*total,sum=0;
  for(const t of templates){sum+=WEIGHTS[t.id]||1;if(r<sum)return t;}
  return templates[0];
}
function genPrompt(){
  const t=pickTemplate();
  switch(t.id){
    case 'T_AI_TERM':return t.tmpl.replace('${tool}',rand(dict.TOOL)).replace('${lang}',rand(dict.LANG)).replace('${action}',rand(dict.ACTION));
    case 'T_URL':
      return t.tmpl
        .replace('${p}','https')
        .replace('${d}','example.com')
        .replace('${path}','ai');
    case 'T_DATE':const d=new Date();return t.tmpl.replace('${y}',d.getFullYear()).replace('${m}',d.getMonth()+1).replace('${d}',d.getDate());
    default:return 'TODO';
  }
}
function rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
function renderKeyboard(){
  const kb=document.getElementById('keyboard');
  if(!kb) return;
  kb.innerHTML='';
  ROWS.forEach(row=>{
    const line=document.createElement('div');
    line.className='row';
    row.forEach(code=>{
      const key=document.createElement('div');
      key.className='key';
      key.dataset.code=code;
      key.textContent=KEY_LABEL[code] ??
        (code.startsWith('Key')   ? code.slice(3) :
         code.startsWith('Digit') ? code.slice(5) : code);
      line.appendChild(key);
    });
    kb.appendChild(line);
  });
}
// ---- END renderKeyboard ----
function showPrompt(){currentPrompt=genPrompt();promptEl.textContent=currentPrompt;typedDisplay.textContent='';}
function updateStats(){
  const diff=performance.now()-startTime;
  const time = diff/60000;
  const wpm  = time ? Math.round((correct/5)/time) : 0;
  statsEl.textContent=`正: ${correct}  誤: ${miss}  WPM: ${wpm}`;
}
function handleKey(e){if(promptIdx>=PROMPT_COUNT)return;e.preventDefault();if(!startTime)startTime=performance.now();const ch=e.key;const expected=currentPrompt[typedDisplay.textContent.length];if(ch===expected){appendMark(true);correct++;if(typedDisplay.textContent.length+1===currentPrompt.length){promptIdx++;if(promptIdx<PROMPT_COUNT){showPrompt();}else{nextBtn.disabled=false;}}
}else{appendMark(false);miss++;}
updateStats();}
function appendMark(ok){const span=document.createElement('span');span.className=ok?'typed-correct':'typed-wrong';span.textContent=ok?'○':'×';typedDisplay.appendChild(span);} 
// ---------- 6. Init ----------
renderKeyboard();showPrompt();
window.addEventListener('keydown',handleKey);
window.addEventListener('compositionstart',e=>e.stopPropagation());
window.addEventListener('compositionupdate',e=>e.stopPropagation());
window.addEventListener('compositionend',e=>e.stopPropagation());
})();
