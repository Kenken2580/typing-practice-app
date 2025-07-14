// 【重要】DOMContentLoaded イベントリスナーで、全てのメインロジックをラップします。
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
  あ:["a"],い:["i"],う:["u"],え:["e"],お:["o"], // 'う'が'u'に、'え'が'e'に修正されていなかったので修正しました。
  か:["ka"],き:["ki"],く:["ku"],け:["ke"],こ:["ko"],
  さ:["sa"],し:["shi","si"],す:["su"],せ:["se"],そ:["so"],
  た:["ta"],ち:["chi","ti"],つ:["tsu","tu"],て:["te"],と:["to"],
  な:["na"],に:["ni"],ぬ:["nu"],ね:["ne"],の:["no"],
  は:["ha"],ひ:["hi"],ふ:["fu","hu"],へ:["he"],ほ:["ho"],
  ま:["ma"],み:["mi"],む:["mu"],め:["me"],も:["mo"],
  や:["ya"],ゆ:["yu"],よ:["yo"],
  ら:["ra"],り:["ri"],る:["ru"],れ:["re"],ろ:["ro"],
  わ:["wa"],を:["wo"],ん:["n","nn","xn"],
  // 拗音・促音・濁音・半濁音など、よく使われるローマ字表記を追加
  が:["ga"],ぎ:["gi"],ぐ:["gu"],げ:["ge"],ご:["go"],
  ざ:["za"],じ:["ji","zi"],ず:["zu"],ぜ:["ze"],ぞ:["zo"],
  だ:["da"],ぢ:["di"],づ:["du"],で:["de"],ど:["do"],
  ば:["ba"],び:["bi"],ぶ:["bu"],べ:["be"],ぼ:["bo"],
  ぱ:["pa"],ぴ:["pi"],ぷ:["pu"],ぺ:["pe"],ぽ:["po"],
  きゃ:["kya"],きゅ:["kyu"],きょ:["kyo"],
  しゃ:["sha","sya"],しゅ:["shu","syu"],しょ:["sho","syo"],
  ちゃ:["cha","tya"],ちゅ:["chu","tyu"],ちょ:["cho","tyo"],
  にゃ:["nya"],にゅ:["nyu"],にょ:["nyo"],
  ひゃ:["hya"],ひゅ:["hyu"],ひょ:["hyo"],
  みゃ:["mya"],みゅ:["myu"],みょ:["myo"],
  りゃ:["rya"],りゅ:["ryu"],りょ:["ryo"],
  ぎゃ:["gya"],ぎゅ:["gyu"],ぎょ:["gyo"],
  じゃ:["ja","zya"],じゅ:["ju","zyu"],じょ:["jo","zyo"],
  びゃ:["bya"],びゅ:["byu"],びょ:["byo"],
  ぴゃ:["pya"],ぴゅ:["pyu"],ぴょ:["pyo"],
  っ:["xtu","ltu"], // 小さい「っ」は促音として扱う（例: katta -> ka(っ)ta）
  // 特殊な入力 (ex: ファ -> fa, ティ -> ti)
  ふぁ:["fa"],ふぃ:["fi"],ふぇ:["fe"],ふぉ:["fo"],
  てぃ:["ti"],でぃ:["di"],とぅ:["tu"],どぅ:["du"],
  うぃ:["wi"],うぇ:["we"],うぉ:["wo"],
  ヴぁ:["va"],ヴぃ:["vi"],ヴぇ:["ve"],ヴぉ:["vo"],ヴゅ:["vyu"]
};

/* ---------- 2. DOM ---------- */
const $ = s => document.querySelector(s);
const textEl=$("#practice-text"), field=$("#input-field");
const nextC=$("#next-char"), nextR=$("#next-roma");
const wpm=$("#wpm"), acc=$("#accuracy"), errEl=$("#errors");
const kb=$("#keyboard"), start=$("#start-btn"), legend=$("#finger-legend");

// HTML構造変更に伴う新しいDOM要素
const feedbackOverlay = $("#feedback-overlay"); // 〇/×/もう一回 のラッパー
const correctMark = $("#correct-mark");
const wrongMark = $("#wrong-mark");
const retryMessage = $("#retry-message"); // もう一回！メッセージ

/* ---------- 3. 仮想キーボード (写真のキーボードに合わせた修正版) ---------- */
const jisLayout = [
  // 1行目
  [
    { text: '半/全', code: 'Backquote', span: 2, key: '`' }, { text: '1', code: 'Digit1', span: 2, key: '1' }, { text: '2', code: 'Digit2', span: 2, key: '2' }, { text: '3', code: 'Digit3', span: 2, key: '3' }, { text: '4', code: 'Digit4', span: 2, key: '4' }, { text: '5', code: 'Digit5', span: 2, key: '5' },
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

// 初期化時にキーボードを生成
jisLayout.forEach(row => {
  row.forEach((keyData, index) => {
    const d = document.createElement("div");
    d.className = "key";
    
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
  " ": 'thumb', "_/]":'right-pinky',
  "`": 'left-pinky',
  "-": 'right-pinky',
  "^": 'right-pinky',
  "¥": 'right-pinky',
  "@": 'right-pinky',
  "[": 'right-pinky',
  "]": 'right-pinky',
  ";": 'right-ring',
  ":": 'right-ring',
  "/": 'right-pinky',
  "_": 'right-pinky',
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
let currentKanaRomaVariants = [];
let currentCorrectRoma = '';
let correctKanaChars = new Set();
let errorKanaChars = new Set();

/* ---------- 7. 画面描画 ---------- */
function drawLine(){
  textEl.innerHTML = lines[lineIdx].split("")
    .map((c,i) => {
      let classes = [];
      if (correctKanaChars.has(i)) {
          classes.push("correct");
      } else if (errorKanaChars.has(i)) {
          classes.push("wrong-kana");
      } else if (i === charIdx) {
          classes.push("current-char");
      }
      
      if (i === charIdx && !errorKanaChars.has(i)) {
        return `<span class="${classes.join(' ')}" style="color:#2196f3;text-decoration:underline;">${c}</span>`;
      } else {
        return `<span class="${classes.join(' ')}">${c}</span>`;
      }
    }).join("");
}

function clearNextKey(){
  document.querySelectorAll('.next-key, .next-finger').forEach(el=>{
    el.classList.remove("next-key", "next-finger");
  });
  document.querySelectorAll('#next-roma span').forEach(el => {
      el.classList.remove('next-char-part');
  });
  // feedbackOverlayのクリアはprepareNextCharFeedback内のsetTimeoutに任せる
  correctMark.classList.remove('show');
  wrongMark.classList.remove('show');
  retryMessage.classList.remove('show');
}

// 現在のかな文字の状態を設定する内部関数
function _setupCurrentCharacterState() {
    const kana = lines[lineIdx][charIdx];
    if (kana) {
        currentKanaRomaVariants = kana2roma[kana];
        if (field.value === "") {
             currentCorrectRoma = currentKanaRomaVariants[0]; 
        }
        nextC.textContent = kana;
        nextR.hidden = false;
    } else { // 行の終わり、またはゲームの終わり
        start.disabled = false;
        nextC.textContent = "Finish!";
        nextR.hidden = true;
        clearNextKey();
        field.blur();
    }
}

function showNextKey(){
  clearNextKey();

  const kana = lines[lineIdx][charIdx];
  if (!kana) {
    nextC.textContent = "Finish!";
    nextR.hidden = true;
    return;
  }

  let nextExpectChar = '';
  const typedLength = field.value.length;

  for(const r of currentKanaRomaVariants) {
      if (r.startsWith(field.value)) {
          nextExpectChar = r[typedLength];
          currentCorrectRoma = r;
          break;
      }
  }

  if(!nextExpectChar) {
      nextR.textContent = '...';
      return;
  }

  /* 大きな文字 (かな) */
  nextC.textContent = kana;

  /* ローマ字表示 */
  let romaDisplayHtml = '';
  for (let i = 0; i < currentCorrectRoma.length; i++) {
      let charClass = '';
      let fingerClass = '';
      const char = currentCorrectRoma[i];
      
      const finger = getFingerForKey(char);
      if (finger) {
          fingerClass = `finger-${finger}`;
      }

      if (i < typedLength) {
          charClass = 'correct-char';
      } else if (i === typedLength) {
          charClass = 'next-char-part';
      }
      
      romaDisplayHtml += `<span class="${charClass} ${fingerClass}">${char}</span>`;
  }
  nextR.innerHTML = romaDisplayHtml;
  nextR.hidden = false;

  /* キーボードのキーハイライト */
  const btn = keyButtons.find(b => b.dataset.key === nextExpectChar);
  if(btn) btn.classList.add("next-key");

  /* 指側ハイライト */
  const finger = getFingerForKey(nextExpectChar);
  const span = document.querySelector(`.finger-${finger}`);
  if(span) span.classList.add("next-finger");

  /* 同期色を CSS 変数へ */
  const rootStyle = getComputedStyle(document.documentElement);
  const baseColor = rootStyle.getPropertyValue(`--${finger}`).trim() || rootStyle.getPropertyValue('--current-color');
  document.documentElement.style.setProperty("--current-color", baseColor);
}

// ヘルパー関数: 色を暗くする (RGB文字列に対応)
function darkenColor(color, percent) {
    if (!color || color === 'transparent') return 'transparent';
    if (!color.startsWith('rgb')) {
        return color;
    }

    const parts = color.match(/\d+/g).map(Number);
    let R = parts[0];
    let G = parts[1];
    B = parts[2];
    const factor = (100 - percent) / 100;

    R = Math.min(255, Math.max(0, Math.round(R * factor)));
    G = Math.min(255, Math.max(0, Math.round(G * factor)));
    B = Math.min(255, Math.max(0, Math.round(B * factor)));

    return `rgb(${R},${G},${B})`;
}


function updateStats(){
  if (!startTime) return;
  const mins = (performance.now() - startTime) / 60000;
  const typedKanaCount = correctKanaChars.size; 
  wpm.textContent = Math.round(typedKanaCount / 5 / mins || 0);
  
  const totalAttempts = typedKanaCount + errors;
  acc.textContent = Math.max(0, Math.round((typedKanaCount / Math.max(totalAttempts, 1)) * 100));
  errEl.textContent = errors;
}

// prepareNextCharFeedback: Only for visual feedback (overlay & shake) and error incrementing
function prepareNextCharFeedback(isCorrect) {
    // Clear previous feedback overlay states (ensures clean slate for new feedback)
    feedbackOverlay.classList.remove('show'); // Remove 'show' from main overlay wrapper
    
    // Clear shake animation from practice text
    const prevCharSpan = textEl.querySelector('.shake-on-error');
    if (prevCharSpan) {
        prevCharSpan.classList.remove('shake-on-error');
    }

    // Set mark text and hide unused marks
    correctMark.innerText = ''; 
    wrongMark.innerText = '';
    retryMessage.style.display = 'none'; // Ensure "もう一回！" is hidden by default

    // Show new feedback
    if (isCorrect) {
        correctMark.innerText = "〇"; // Set mark
        feedbackOverlay.classList.add('show'); // Show overlay
        // The timeout to remove 'show' class from feedbackOverlay is handled by handleKeyPress's beginning.
        
    } else { // Mistake
        errors++; // Increment error count
        wrongMark.innerText = "×"; // Set mark
        retryMessage.style.display = 'block'; // Show "もう一回！"
        feedbackOverlay.classList.add('show'); // Show overlay
        
        // Add shake animation to current char in practice text
        const currentCharSpan = textEl.querySelector('.current-char'); 
        if (currentCharSpan) {
            currentCharSpan.classList.add('shake-on-error');
            setTimeout(() => {
                currentCharSpan.classList.remove('shake-on-error');
            }, 500); // Animation duration
        }
        // The timeout to remove 'show' class from feedbackOverlay is handled by handleKeyPress's beginning.
    }
}


// _updateDisplayAfterInput: Update all display elements after any state change (input/error/advance)
function _updateDisplayAfterInput() {
    _setupCurrentCharacterState(); // Setup current kana (important to call before drawLine and showNextKey for correct roma)
    drawLine(); // Updates practice text (shows correct/wrong marks, underline current)
    updateStats(); // Updates WPM, Accuracy, Errors
    showNextKey(); // Updates key highlight, finger highlight, and current roma breakdown
}


/* ---------- 8. 入力処理 ---------- */
function handleKeyPress(e){
  // 1. 【重要】前回のフィードバックをクリア - o3の提案に基づき追加
  // ユーザーが何らかのキーを押したら、前回表示されていたフィードバック（〇／×）を消す
  feedbackOverlay.classList.remove('show');

  // 2. ゲームが開始されていない場合 (Startボタンが有効な場合)
  if (start.disabled === false) { 
    if (e.key === ' ') { // スペースキーが押されたら
        e.preventDefault(); // デフォルトのスクロール動作などを防ぐ
        start.click(); // Startボタンをクリックしてゲームを開始
    }
    return; // スペースキー以外も含めて、すべてのキー入力を無視
  }

  // 3. ゲームがアクティブな場合のみ、以下のキー入力処理を実行
  e.preventDefault(); // ブラウザのデフォルト動作（文字入力、スクロールなど）を防ぐ

  // 4. 【重要】IME (変換中) や特殊キーを適切に処理 - o3の提案に基づき修正
  // `e.key === 'Process'` のチェックは不要。IME変換中のみ除外する。
  if (e.isComposing && e.key.length === 0) {
    return;
  }

  // 5. ブラウザのデフォルトショートカットや機能キーを無視
  const ignoredKeys = new Set([
      'Shift', 'Control', 'Alt', 'CapsLock', 'Enter', 'Backspace', 'Tab', 'Meta', 'ContextMenu',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown',
      'Delete', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
      'Escape', 'PrintScreen', 'ScrollLock', 'Pause', 'NumLock', 'Backquote'
  ]);
  
  // 修飾キー (Ctrl, Alt, Meta) が押されている場合、またはignoredKeysに含まれるキーの場合
  if (e.ctrlKey || e.altKey || e.metaKey || ignoredKeys.has(e.key)) {
      const isTypingCharWithModifier = e.key.length === 1 && /^[a-z0-9]$/i.test(e.key) && (e.ctrlKey || e.altKey || e.metaKey);
      if (!isTypingCharWithModifier) {
        return; // 通常のタイピング文字ではない、または修飾キー単独の押下は無視
      }
  }

  // 6. 全角英数字を半角に変換し、小文字にする
  const k = toHalfWidthAlphaNum(e.key).toLowerCase();
  
  // 7. 入力されたキーがローマ字として有効か（a-z、数字、記号）の最終チェック
  if (!k || !/^[a-z0-9\-\[\]\\;,./`@^¥_:]$/.test(k)) {
      return; // 有効なローマ字文字でなければ無視
  }
  
  if (!startTime) startTime = performance.now(); // 初めてキーが押されたらタイマー開始

  // 8. コアのローマ字入力判定ロジック - o3の提案に基づき再構築
  const typedSoFar = field.value + k; // 現在まで打ったローマ字文字列
  let correctInputPart = false; // 部分正解か (typedSoFar is prefix of a valid Roman-ji)
  let completedRoma = false;    // 完全正解か (typedSoFar is exactly a valid Roman-ji)

  let actualMatchingRomaVariant = null; // どのローマ字候補が一致したか（表示更新用）

  for (const r of currentKanaRomaVariants) {
      if (r.startsWith(typedSoFar)) {
          correctInputPart = true;
          actualMatchingRomaVariant = r; // 一致した候補を保持
          if (typedSoFar === r) {
              completedRoma = true;
          }
          break;
      }
  }

  // 9. 押された物理キーの視覚的フィードバック
  const pressedKeyEl = keyButtons.find(b => b.dataset.code === e.code);
  if (pressedKeyEl) {
      const pressedKeyChar = e.key.toLowerCase();
      const pressedFinger = getFingerForKey(pressedKeyChar);
      
      const rootStyle = getComputedStyle(document.documentElement);
      let baseColor = rootStyle.getPropertyValue('--thumb').trim(); // デフォルトは親指の色

      if (pressedFinger) {
          baseColor = rootStyle.getPropertyValue(`--${pressedFinger}`).trim();
      }
      
      pressedKeyEl.style.backgroundColor = baseColor;
      pressedKeyEl.style.borderColor = baseColor;
      pressedKeyEl.style.color = '#fff';
      pressedKeyEl.style.borderBottomColor = darkenColor(baseColor, 15);

      pressedKeyEl.classList.add('pressed');
      if (correctInputPart) { // Input is correct part of a roman-ji
          pressedKeyEl.classList.add('correct-press');
      } else { // Input is completely wrong, not a part of any roman-ji
          pressedKeyEl.classList.add('wrong-press');
      }

      setTimeout(() => {
          pressedKeyEl.classList.remove('pressed', 'correct-press', 'wrong-press');
          pressedKeyEl.style.backgroundColor = '';
          pressedKeyEl.style.borderColor = '';
          pressedKeyEl.style.color = '';
          pressedKeyEl.style.borderBottomColor = '';
      }, 200);
  }

  // 10. ゲーム状態の更新と次の表示準備 - o3の提案に基づき再構築
  if (correctInputPart && !completedRoma) {
    // ── 部分正解 (例: 'H' のみ) ──
    // バッファに残し、フィードバックは出さない（×を出さない）。
    field.value = typedSoFar;
    currentCorrectRoma = actualMatchingRomaVariant; // 表示のために一致したローマ字をセット
    // charIdx は進めない
  } else if (correctInputPart && completedRoma) {
    // ── 完全正解 (例: 'HA') ──
    field.value = typedSoFar; // 完了したローマ字をバッファに反映
    prepareNextCharFeedback(true); // 正解フィードバック (〇) を表示
    correctKanaChars.add(charIdx); // 現在のかな文字を完了としてマーク
    charIdx++; // 次のかな文字へ進む
  } else {
    // ── 完全不正解 (例: 'HB', 'HX' など) ──
    // typedSoFar がどのローマ字候補のprefixでもない場合
    prepareNextCharFeedback(false); // 不正解フィードバック (×、もう一回！) を表示
    field.value = ""; // 入力バッファをリセットし、最初から打ち直し
    // charIdx は進めない (同じ文字を再挑戦)
    errorKanaChars.add(charIdx); // エラーとしてマーク
  }
  
  // 11. 行の終わり、またはゲームの終わりをチェックし、必要なら次の行へ
  // このブロックは、charIdx が `completedRoma` の場合のみインクリメントされた後に来る
  if (charIdx >= lines[lineIdx].length) { 
      charIdx = 0;
      lineIdx = (lineIdx + 1) % lines.length;
      correctKanaChars.clear(); // 新しい行なので完了文字をクリア
      errorKanaChars.clear(); // 新しい行なのでエラー文字もクリア
  }

  // 12. 最終的な表示更新 - どのケースでも必ず呼ぶ
  _updateDisplayAfterInput(); 
}

// ゲーム開始時の初期化処理
start.onclick = ()=>{
  start.disabled = true;
  field.focus(); // 隠れた入力フィールドにフォーカスを当てる
  
  // ゲーム状態を全てリセット
  lineIdx = 0; charIdx = 0; errors = 0; startTime = null;
  wpm.textContent = 0; acc.textContent = 100; errEl.textContent = 0;
  correctKanaChars.clear(); // 完了した文字もクリア
  errorKanaChars.clear();   // エラー文字もクリア
  
  clearNextKey(); // 以前のハイライトやフィードバックをクリア

  // 最初の文字をセットアップし、表示を更新
  _updateDisplayAfterInput(); 
};

// キーボードイベントリスナーを設定
document.addEventListener("keydown", handleKeyPress);

}); // ここで `DOMContentLoaded` イベントリスナーの `}` を閉じます。


// ヘルパー関数: 色を暗くする (RGB文字列に対応)
function darkenColor(color, percent) {
    if (!color || color === 'transparent') return 'transparent';
    if (!color.startsWith('rgb')) {
        return color;
    }

    const parts = color.match(/\d+/g).map(Number);
    let R = parts[0];
    let G = parts[1];
    B = parts[2];
    const factor = (100 - percent) / 100;

    R = Math.min(255, Math.max(0, Math.round(R * factor)));
    G = Math.min(255, Math.max(0, Math.round(G * factor)));
    B = Math.min(255, Math.max(0, Math.round(B * factor)));

    return `rgb(${R},${G},${B})`;
}

// 全角英数字を半角に変換するヘルパー関数
function toHalfWidthAlphaNum(char) {
    return char.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}
