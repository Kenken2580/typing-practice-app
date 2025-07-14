/* ---------- 1. データ ---------- */
const lines = [
  "あかさたなはまやらわ",
  "いきしちにひみり", // ゐは一般的でないため削除
  "うくすつぬふむゆる",
  "えけせてねへめれ",
  "おこそとのほもよろをん" // んを追加
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
const wpm=$("#wpm"), acc=$("#accuracy"), errEl=$("#errors"); // ★ここを修正しました！
const kb=$("#keyboard"), start=$("#start-btn"), legend=$("#finger-legend");

/* ---------- 3. 仮想キーボード (写真のキーボードに合わせた修正版) ---------- */
const jisLayout = [
  // 1行目
  [
    { text: '半/全', code: 'IntlYen', span: 2, key: '¥' }, { text: '1', code: 'Digit1', span: 2, key: '1' }, { text: '2', code: 'Digit2', span: 2, key: '2' }, { text: '3', code: 'Digit3', span: 2, key: '3' }, { text: '4', code: 'Digit4', span: 2, key: '4' }, { text: '5', code: 'Digit5', span: 2, key: '5' },
    { text: '6', code: 'Digit6', span: 2, key: '6' }, { text: '7', code: 'Digit7', span: 2, key: '7' }, { text: '8', code: 'Digit8', span: 2, key: '8' }, { text: '9', code: 'Digit9', span: 2, key: '9' }, { text: '0', code: 'Digit0', span: 2, key: '0' },
    { text: '-', code: 'Minus', span: 2, key: '-' }, { text: '^', code: 'Equal', span: 2, key: '^' }, { text: '¥', code: 'IntlYen', span: 2, key: '¥' }, { text: 'Backspace', code: 'Backspace', span: 4, key: 'backspace' }
  ],
  // 2行目
  [
    { text: 'Tab', code: 'Tab', span: 3, key: 'tab' }, { text: 'Q', code: 'KeyQ', span: 2, key: 'q' }, { text: 'W', code: 'KeyW', span: 2, key: 'w' }, { text: 'E', code: 'KeyE', span: 2, key: 'e' }, { text: 'R', code: 'KeyR', span: 2, key: 'r' }, { text: 'T', code: 'KeyT', span: 2, key: 't' },
    { text: 'Y', code: 'KeyY', span: 2, key: 'y' }, { text: 'U', code: 'KeyU', span: 2, key: 'u' }, { text: 'I', code: 'KeyI', span: 2, key: 'i' }, { text: 'O', code: 'KeyO', span: 2, key: 'o' }, { text: 'P', code: 'KeyP', span: 2, key: 'p' },
    { text: '@', code: 'BracketLeft', span: 2, key: '@' }, { text: '[', code: 'BracketRight', span: 2, key: '[' }, { text: ']', code: 'Backslash', span: 2, key: ']' }
  ],
  // 3行目
  [
    { text: 'Caps', code: 'CapsLock', span: 4, key: 'capslock' }, { text: 'A', code: 'KeyA', span: 2, key: 'a' }, { text: 'S', code: 'KeyS', span: 2, key: 's' }, { text: 'D', code: 'KeyD', span: 2, key: 'd' }, { text: 'F', code: 'KeyF', span: 2, key: 'f' }, { text: 'G', code: 'KeyG', span: 2, key: 'g' },
    { text: 'H', code: 'KeyH', span: 2, key: 'h' }, { text: 'J', code: 'KeyJ', span: 2, key: 'j' }, { text: 'K', code: 'KeyK', span: 2, key: 'k' }, { text: 'L', code: 'KeyL', span: 2, key: 'l' },
    { text: ';', code: 'Semicolon', span: 2, key: ';' }, { text: ':', code: 'Quote', span: 2, key: ':' }, { text: 'Enter', code: 'Enter', span: 5, key: 'enter' }
  ],
  // 4行目
  [
    { text: 'Shift', code: 'ShiftLeft', span: 5, key: 'shift' }, { text: 'Z', code: 'KeyZ', span: 2, key: 'z' }, { text: 'X', code: 'KeyX', span: 2, key: 'x' }, { text: 'C', code: 'KeyC', span: 2, key: 'c' }, { text: 'V', code: 'KeyV', span: 2, key: 'v' },
    { text: 'B', code: 'KeyB', span: 2, key: 'b' }, { text: 'N', code: 'KeyN', span: 2, key: 'n' }, { text: 'M', code: 'KeyM', span: 2, key: 'm' },
    { text: ',', code: 'Comma', span: 2, key: ',' }, { text: '.', code: 'Period', span: 2, key: '.' }, { text: '/', code: 'Slash', span: 2, key: '/' },
    { text: '_', code: 'IntlRo', span: 2, key: '_' }, { text: 'Shift', code: 'ShiftRight', span: 5, key: 'shift' }
  ],
  // 5行目 (最下段)
  [
    { text: 'Ctrl', code: 'ControlLeft', span: 3, key: 'control' }, { text: 'Win', code: 'MetaLeft', span: 2, key: 'meta' }, { text: 'Alt', code: 'AltLeft', span: 2, key: 'alt' },
    { text: '無変換', code: 'NonConvert', span: 3, key: 'nonconvert' }, { text: 'Space', code: 'Space', span: 8, key: ' ' },
    { text: '変換', code: 'Convert', span: 3, key: 'convert' }, { text: 'かな', code: 'KanaMode', span: 3, key: 'kanamode' },
    { text: 'Win', code: 'MetaRight', span: 2, key: 'meta' }, { text: 'App', code: 'ContextMenu', span: 2, key: 'contextmenu'}, { text: 'Ctrl', code: 'ControlRight', span: 3, key: 'control' }
  ]
];

jisLayout.forEach(row => {
  row.forEach((keyData, index) => {
    const d = document.createElement("div");
    d.className = "key";
    
    // 各行の最初のキー (indexが0) なら、特別なクラスを追加する
    if (index === 0) {
      d.classList.add("key-row-start");
    }

    d.dataset.code = keyData.code;
    d.dataset.key = keyData.key;
    d.textContent = keyData.text;
    
    if (keyData.span) d.style.gridColumn = `span ${keyData.span}`;

    kb.appendChild(d);
  });
});
const keyButtons = [...kb.children];

/* ---------- 4. 指マッピング (JIS配列対応) ---------- */
const fingerMap = {
  "1qaz": 'left-pinky', "2wsx": 'left-ring', "3edc": 'left-middle', "4rfv5tgb": 'left-index',
  "6yhn7ujm": 'right-index', "8ik,": 'right-middle', "9ol.": 'right-ring', "0p;:[@]-^¥": 'right-pinky',
  " ": 'thumb', "_/]":'right-pinky'
};
function getFingerForKey(ch){
  ch = ch.toLowerCase();
  for(const [keys, f] of Object.entries(fingerMap)){
    if(keys.includes(ch)) return f;
  }
  return null;
}

/* ---------- 5. Legend 自動生成 ---------- */
new Set(Object.values(fingerMap)).forEach(f=>{
  const span=document.createElement("span");
  const [side,part] = f.split('-');
  span.textContent = ({left:"左",right:"右",thumb:""}[side]||"") +
    {pinky:"小指",ring:"薬指",middle:"中指",index:"人差指",thumb:"親指"}[part||"thumb"];
  span.className=`finger-${f}`;
  legend.appendChild(span);
});

/* ---------- 6. 状態 ---------- */
let lineIdx = 0, charIdx = 0, errors = 0, startTime = null;
let romaVariants = [];
let currentRoma = '';

/* ---------- 7. 画面描画 ---------- */
function drawLine(){
  textEl.innerHTML = lines[lineIdx].split("")
    .map((c,i) => {
      if (i < charIdx) return `<span style="color:gray">${c}</span>`;
      if (i === charIdx) return `<span style="color:#2196f3;text-decoration:underline;">${c}</span>`;
      return c;
    }).join("");
}
function clearNextKey(){
  document.querySelectorAll('[class*="next-"]').forEach(el=>{
    el.className = el.className.replace(/next-[^ ]+/g,"").trim();
  });
}
function showNextKey(){
  clearNextKey();
  const kana = lines[lineIdx][charIdx];
  if (!kana) return;

  let expect = '';
  const typedLength = field.value.length;
  for(const r of romaVariants) {
      if (r.startsWith(field.value)) {
          expect = r[typedLength];
          break;
      }
  }

  if(!expect) {
      nextR.textContent = '...';
      return;
  }

  // 【修正】data-key を使用してハイライト
  const btn = keyButtons.find(b => b.dataset.key === expect);
  if(btn) btn.classList.add("next-key");

  const finger = getFingerForKey(expect);
  const span = document.querySelector(`.finger-${finger}`);
  if(span) span.classList.add("next-finger");

  const rootStyle = getComputedStyle(document.documentElement);
  const baseColor = rootStyle.getPropertyValue(`--${finger}`).trim() || rootStyle.getPropertyValue('--current-color');
  document.documentElement.style.setProperty("--current-color", baseColor);

  nextC.textContent = kana;
  nextR.textContent = expect;
  nextC.hidden = nextR.hidden = false;
}
function updateStats(){
  if (!startTime) return;
  const mins = (performance.now() - startTime) / 60000;
  const typed = lineIdx * lines[0].length + charIdx;
  wpm.textContent = Math.round(typed / 5 / mins || 0);
  const totalTyped = typed + errors;
  acc.textContent = Math.max(0, Math.round((typed / Math.max(totalTyped, 1)) * 100));
  errEl.textContent = errors;
}

function prepareNextChar() {
    field.value = "";
    if (charIdx >= lines[lineIdx].length) {
        charIdx = 0;
        lineIdx = (lineIdx + 1) % lines.length;
    }
    const nextKana = lines[lineIdx][charIdx];
    if (nextKana) {
        romaVariants = kana2roma[nextKana];
        currentRoma = romaVariants[0];
    } else {
        start.disabled = false;
        nextC.textContent = "Finish!";
        nextR.hidden = true;
        clearNextKey();
        field.blur();
    }
}

/* ---------- 8. 入力処理 ---------- */
function handleKeyPress(e){
  // ゲームが開始されていないか、IME変換中は処理しない（ただし半/全キーは例外として処理する）
  if (start.disabled === false || (e.isComposing && e.code !== 'IntlYen')) return;
  
  // 特殊キー（Shift, Ctrlなど）は処理せず無視する
  // Spaceキーは文字として扱うため除外
  // 半/全キーは特別な処理をスキップ
  const specialKeys = ['Shift', 'Control', 'Alt', 'CapsLock', 'Enter', 'Backspace', 'Tab', 'Meta', 'ContextMenu', 'NonConvert', 'Convert', 'KanaMode', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Delete', 'Insert', 'IntlYen'];
  if (e.key.length > 1 && !specialKeys.includes(e.key)) {
      return;
  }
  
  e.preventDefault(); // デフォルトのキーイベント（文字入力など）をキャンセル
  if (!startTime) startTime = performance.now();

  const k = e.key.toLowerCase(); // 入力されたキーの文字（小文字化）
  const typedSoFar = field.value + k;
  let correctInput = false; // ローマ字入力の正誤を判定するフラグ

  // ローマ字の候補の中から、現在入力されている部分と一致するかをチェック
  for (const r of romaVariants) {
      if (r.startsWith(typedSoFar)) {
          correctInput = true; // 正しい入力の途中である
          currentRoma = r; // その候補を現在の正解として設定
          break;
      }
  }

  // ★【ここから追加】押された物理キーをリアルタイムでハイライトする処理
  const pressedKeyEl = keyButtons.find(b => b.dataset.code === e.code);
  if (pressedKeyEl) {
      // ローマ字入力として正しければ緑、間違っていれば赤
      pressedKeyEl.classList.add(correctInput ? 'correct' : 'wrong');
      setTimeout(() => {
          pressedKeyEl.classList.remove('correct', 'wrong');
      }, 200); // 200ms後に色を戻す
  }
  // ★【ここまで追加】

  if (correctInput) {
      field.value = typedSoFar; // 入力された文字をバッファに追加
      if (field.value === currentRoma) { // ローマ字一文字の入力が完了した場合
          charIdx++; // 次のかな文字へ進む
          prepareNextChar(); // 次の文字の準備
      }
  } else { // 間違った文字を入力した場合
      errors++; // エラーカウントを増やす
  }
  drawLine(); // 練習テキストの表示を更新
  showNextKey(); // 次に打つべきキーと運指のハイライトを更新
  updateStats(); // 統計情報を更新
}

start.onclick = ()=>{
  start.disabled = true;
  field.focus();
  // ゲーム状態をリセット
  lineIdx = 0; charIdx = 0; errors = 0; startTime = null;
  wpm.textContent = 0; acc.textContent = 100; errEl.textContent = 0;
  
  prepareNextChar(); // 最初の文字の準備
  drawLine(); // 練習テキストを描画
  showNextKey(); // 最初のキーと運指をハイライト
};

document.addEventListener("keydown", handleKeyPress);