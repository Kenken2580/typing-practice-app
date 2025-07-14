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
// key には小文字のアルファベットや記号が入る
const fingerMap = {
  "1qaz": 'left-pinky', "2wsx": 'left-ring', "3edc": 'left-middle', "4rfv5tgb": 'left-index',
  "6yhn7ujm": 'right-index', "8ik,": 'right-middle', "9ol.": 'right-ring', "0p;:[@]-^¥": 'right-pinky',
  " ": 'thumb', "_/]":'right-pinky', // JIS配列のキーと運指の追加
  // その他キー
  "`": 'left-pinky', // 半/全
  "-": 'right-pinky', // 0の右
  "^": 'right-pinky', // -の右
  "¥": 'right-pinky', // ^の右
  "@": 'right-pinky', // Pの右
  "[": 'right-pinky', // @の右
  "]": 'right-pinky', // ]の右（US配列では\]、JISでは\]が違うキー）
  ";": 'right-ring', // Lの右
  ":": 'right-ring', // ;の右
  "/": 'right-pinky', // .の右
  "_": 'right-pinky', // /の右
};
function getFingerForKey(ch){
  ch = ch.toLowerCase(); // 確実に小文字で検索
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
let currentKanaRomaVariants = []; // 現在のかなに対応する全てのローマ字候補
let currentCorrectRoma = '';      // 現在のローマ字候補（例えば "shi" or "si" のどちらか確定したもの）
let correctKanaChars = new Set(); // 完了したかな文字のインデックスを保持
let errorKanaChars = new Set();   // ミスしたかな文字のインデックスを保持

/* ---------- 7. 画面描画 ---------- */
function drawLine(){
  textEl.innerHTML = lines[lineIdx].split("")
    .map((c,i) => {
      let classes = [];
      if (correctKanaChars.has(i)) {
          classes.push("correct"); // 完了した文字
      } else if (errorKanaChars.has(i)) {
          classes.push("wrong-kana"); // ミスした文字（再挑戦中）
      } else if (i === charIdx) {
          classes.push("current-char"); // 現在の文字
      }
      
      // 現在の文字には下線と特定の色を適用 (style="color:#2196f3;text-decoration:underline;" はCSSクラスに含めない)
      if (i === charIdx && !errorKanaChars.has(i)) {
        return `<span class="${classes.join(' ')}" style="color:#2196f3;text-decoration:underline;">${c}</span>`;
      } else {
        return `<span class="${classes.join(' ')}">${c}</span>`;
      }
    }).join("");
}

function clearNextKey(){
  // キーボードと指のハイライトをクリア
  document.querySelectorAll('.next-key, .next-finger').forEach(el=>{
    el.classList.remove("next-key", "next-finger");
  });
  // next-romaの点滅もクリア
  document.querySelectorAll('#next-roma span').forEach(el => {
      el.classList.remove('next-char-part');
  });
  // 〇×マークを非表示にする
  feedbackOverlay.classList.remove('show');
  correctMark.classList.remove('show');
  wrongMark.classList.remove('show');
  retryMessage.classList.remove('show');
}

function showNextKey(){
  clearNextKey(); // まず全てクリア

  const kana = lines[lineIdx][charIdx];
  if (!kana) { // 全ての文字を打ち終えた場合
    nextC.textContent = "Finish!";
    nextR.hidden = true;
    return;
  }

  let nextExpectChar = ''; // 次に打つべきローマ字1文字
  const typedLength = field.value.length;

  // 現在の入力 (field.value) に続く文字をローマ字候補から見つける
  for(const r of currentKanaRomaVariants) {
      if (r.startsWith(field.value)) {
          nextExpectChar = r[typedLength];
          currentCorrectRoma = r; // この候補が現在の正解ローマ字とする
          break;
      }
  }

  if(!nextExpectChar) { // 有効な入力候補がない場合 (ミスタイプ後など)
      nextR.textContent = '...';
      return;
  }

  /* 大きな文字 (かな) */
  nextC.textContent = kana;

  /* ローマ字表示 (例: <span class="correct-char">h</span><span class="next-char-part">a</span>) */
  let romaDisplayHtml = '';
  for (let i = 0; i < currentCorrectRoma.length; i++) {
      let charClass = '';
      let fingerClass = '';
      const char = currentCorrectRoma[i];
      
      // 指の色クラスを決定
      const finger = getFingerForKey(char);
      if (finger) {
          fingerClass = `finger-${finger}`; // 例: finger-right-index
      }

      if (i < typedLength) {
          charClass = 'correct-char'; // 入力済み部分
      } else if (i === typedLength) {
          charClass = 'next-char-part'; // 次に打つ部分（点滅）
      }
      
      // クラスを結合。fingerClassがCSSで背景色を設定します。
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

// ヘルパー関数: 色を暗くする (現在未使用だが、将来の拡張のために残す)
/*
function darkenColor(color, percent) {
    if (!color || color === 'transparent') return 'transparent';
    if (color.startsWith('rgb')) {
        const parts = color.match(/\d+/g).map(Number);
        const R = parts[0];
        const G = parts[1];
        const B = parts[2];
        const p = percent / 100;

        const newR = Math.round(R * (1 - p));
        const newG = Math.round(G * (1 - p));
        const newB = Math.round(B * (1 - p));

        return `rgb(${newR},${newG},${newB})`;
    }
    return color;
}
*/


function updateStats(){
  if (!startTime) return;
  const mins = (performance.now() - startTime) / 60000;
  const typedKanaCount = correctKanaChars.size; 
  wpm.textContent = Math.round(typedKanaCount / 5 / mins || 0);
  
  const totalAttempts = typedKanaCount + errors;
  acc.textContent = Math.max(0, Math.round((typedKanaCount / Math.max(totalAttempts, 1)) * 100));
  errEl.textContent = errors;
}

function prepareNextChar(correctlyTyped = true) { // 正しく入力されたかどうかのフラグを追加
    // 現在の文字が完了したら、エラー状態を解除
    errorKanaChars.delete(charIdx); 

    if (correctlyTyped) { // 正しく入力された場合のみ次の文字に進む
        // 〇×マークとメッセージを非表示に
        feedbackOverlay.classList.remove('show');
        correctMark.classList.remove('show');
        wrongMark.classList.remove('show');
        retryMessage.classList.remove('show');
        
        // ローマ字入力バッファをリセット
        field.value = ""; 

        // 〇マークを表示
        // (「〇」の表示内容をinnerTextに設定)
        correctMark.innerText = "〇";
        correctMark.classList.add('show');
        feedbackOverlay.classList.add('show');
        setTimeout(() => feedbackOverlay.classList.remove('show'), 500); // 0.5秒後に消す

        correctKanaChars.add(charIdx); // 正しく完了した文字として記録
        charIdx++; // 次のかな文字へ進む
        
    } else { // ミスした場合、×マーク表示
        // field.value はそのままにし、再入力を促す
        field.value = ""; // ミス時はバッファをリセット
        
        // ×マークとメッセージを表示
        // (「×」の表示内容をinnerTextに設定)
        wrongMark.innerText = "×";
        wrongMark.classList.add('show');
        retryMessage.classList.add('show'); // もう一回！メッセージを表示
        feedbackOverlay.classList.add('show');
        setTimeout(() => feedbackOverlay.classList.remove('show'), 1000); // 1秒後に消す

        errors++; // エラーカウントを増やす
        errorKanaChars.add(charIdx); // ミスした文字として記録
    }

    if (charIdx >= lines[lineIdx].length) { // 現在の行を全て打ち終えた
        charIdx = 0;
        lineIdx = (lineIdx + 1) % lines.length;
        correctKanaChars.clear(); // 新しい行なのでクリア
    }
    const nextKana = lines[lineIdx][charIdx];
    if (nextKana) {
        currentKanaRomaVariants = kana2roma[nextKana];
        currentCorrectRoma = currentKanaRomaVariants[0]; // デフォルトは最初の候補
    } else {
        start.disabled = false;
        nextC.textContent = "Finish!";
        nextR.hidden = true;
        clearNextKey();
        field.blur();
    }
    drawLine(); // 練習テキストの表示を更新
    updateStats(); // 統計情報を更新
}

/* ---------- 8. 入力処理 ---------- */
function handleKeyPress(e){
  // ゲームが開始されていない場合のみ、Startボタンのスペースキー押下を許可
  if (start.disabled === false) { 
    if (e.key === ' ') { // スペースキーが押されたら
        e.preventDefault(); // デフォルトのスクロール動作などを防ぐ
        start.click(); // Startボタンをクリックする
    }
    return; // ゲーム開始前は他のキーは無視
  }
  
  // IME変換中、かつ入力が確定していない状態のキー入力を無視
  // アルファベットキーの場合はIME変換中でもそのまま処理したいのでisComposingを考慮しない
  // 「Process」などのキーは無視
  if (e.key === 'Process' || (e.isComposing && e.key.length === 0)) {
    return;
  }

  // 特殊キー（Shift, Ctrl, Enter, Backspaceなど）は処理せず無視する
  const ignoredKeys = new Set([
      'Shift', 'Control', 'Alt', 'CapsLock', 'Enter', 'Backspace', 'Tab', 'Meta', 'ContextMenu',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown',
      'Delete', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ]);
  if (ignoredKeys.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) { // Ctrl/Alt/Metaキー単独押しも無視
      e.preventDefault(); // デフォルト動作も防止
      return;
  }
  
  e.preventDefault(); // デフォルトのキーイベント（文字入力など）をキャンセル
  if (!startTime) startTime = performance.now(); // 初めてキーが押されたらタイマー開始

  const k = e.key.toLowerCase(); // 入力されたキーの文字（小文字化）
  const typedSoFar = field.value + k; // 現在まで打ったローマ字文字列

  let correctInputPart = false; // ローマ字入力の部分的な正誤を判定するフラグ
  let completedRoma = false;    // ローマ字一文字の入力が完了したか

  // ローマ字の候補の中から、現在入力されている部分と一致するかをチェック
  for (const r of currentKanaRomaVariants) {
      if (r.startsWith(typedSoFar)) {
          correctInputPart = true; // 正しい入力の途中である
          currentCorrectRoma = r;  // この候補が現在の正解ローマ字とする
          if (typedSoFar === r) { // ローマ字一文字の入力が完了した場合
              completedRoma = true;
          }
          break; // 一致する候補が見つかったらループを抜ける
      }
  }

  // 押された物理キーをリアルタイムでハイライトする処理
  const pressedKeyEl = keyButtons.find(b => b.dataset.code === e.code);
  if (pressedKeyEl) {
      // 押されたキーの運指の色を取得し適用
      const pressedKeyChar = e.key.toLowerCase();
      const pressedFinger = getFingerForKey(pressedKeyChar);
      if (pressedFinger) {
          const rootStyle = getComputedStyle(document.documentElement);
          const baseColor = rootStyle.getPropertyValue(`--${pressedFinger}`).trim();
          pressedKeyEl.style.backgroundColor = baseColor; // キーの背景を運指の色に
          pressedKeyEl.style.borderColor = baseColor; // ボーダーも運指の色に
          pressedKeyEl.style.color = '#fff'; // 文字色を白に
          // 少し暗い色のボーダーボトムを計算 (JSで計算)
          pressedKeyEl.style.borderBottomColor = darkenColor(baseColor, 15);
      } else {
          // 運指がマッピングされていないキーのフォールバック
          pressedKeyEl.style.backgroundColor = ''; // CSSのデフォルトに戻す
          pressedKeyEl.style.borderColor = '';
          pressedKeyEl.style.color = '';
          pressedKeyEl.style.borderBottomColor = '';
      }

      // 正誤に応じたクラスを追加 (光る効果のため)
      pressedKeyEl.classList.add('pressed'); // 押された状態
      if (correctInputPart) {
          pressedKeyEl.classList.add('correct-press');
      } else {
          pressedKeyEl.classList.add('wrong-press');
      }

      // 一定時間後にスタイルをリセット
      setTimeout(() => {
          pressedKeyEl.classList.remove('pressed', 'correct-press', 'wrong-press');
          pressedKeyEl.style.backgroundColor = ''; // CSSのデフォルトに戻す
          pressedKeyEl.style.borderColor = '';
          pressedKeyEl.style.color = '';
          pressedKeyEl.style.borderBottomColor = '';
      }, 200);
  }

  if (correctInputPart) {
      field.value = typedSoFar; // 入力された文字をバッファに追加
      if (completedRoma) {
          prepareNextChar(true); // ローマ字が完成したので、trueを渡し、次のかな文字へ
      }
  } else { // 間違った文字を入力した場合
      field.value = ""; // 入力バッファをリセットし、最初から打ち直し
      prepareNextChar(false); // ミスしたのでfalseを渡し、同じかな文字を再挑戦
  }
  showNextKey(); // 次に打つべきキーと運指のハイライトを更新
}

start.onclick = ()=>{
  start.disabled = true;
  field.focus();
  // ゲーム状態をリセット
  lineIdx = 0; charIdx = 0; errors = 0; startTime = null;
  wpm.textContent = 0; acc.textContent = 100; errEl.textContent = 0;
  correctKanaChars.clear();
  errorKanaChars.clear();
  
  // 初回は常に正しく次の文字を準備する
  prepareNextChar(true); 
  showNextKey(); // 最初のキーと運指をハイライト
};

document.addEventListener("keydown", handleKeyPress);

// ヘルパー関数: 色を暗くする (RGB文字列に対応)
function darkenColor(color, percent) {
    if (!color || color === 'transparent') return 'transparent';
    if (!color.startsWith('rgb')) {
        // console.warn('darkenColor received non-rgb color:', color); // デバッグ用
        return color; // rgb()形式でない場合はそのまま返す
    }

    const parts = color.match(/\d+/g).map(Number); // R, G, B を抽出
    let R = parts[0];
    let G = parts[1];
    let B = parts[2];
    const factor = (100 - percent) / 100; // 暗くする割合 (例: 15%暗くならfactorは0.85)

    R = Math.min(255, Math.max(0, Math.round(R * factor)));
    G = Math.min(255, Math.max(0, Math.round(G * factor)));
    B = Math.min(255, Math.max(0, Math.round(B * factor)));

    return `rgb(${R},${G},${B})`;
}