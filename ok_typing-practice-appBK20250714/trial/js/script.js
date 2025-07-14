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
const kb=$("#keyboard"), start=$("#start-btn"), legend=$("#finger-legend"), resetBtn=$("#reset-btn");
// 拡大キー表示用コンテナ
const enlargedKeyContainer = document.getElementById('enlarged-key-container');
const retryMessage = document.getElementById('retry-message');
const nextRomaContainer = $('#next-roma-container');

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

/* ---------- 5. Legend 自動生成 (指形アイコン＋ホームポジション間隔) ---------- */
// HTMLで直接指を配置するように変更したため、この部分は不要になりました

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

// ローマ字全体を受け取り拡大キーを表示
function showEnlargedKeys(romaStr){
  if(!enlargedKeyContainer) return;
  enlargedKeyContainer.innerHTML = '';
  const chars=[...romaStr];
  chars.forEach((ch,idx)=>{
    const div = document.createElement('div');
    div.className = 'enlarged-key';
    div.textContent = ch.toUpperCase();
    const finger = getFingerForKey(ch);
    if(finger) div.setAttribute('data-finger', finger);
    if(idx === 0) {
      div.classList.add('current');
    } else {
      div.classList.add('pending');
    }
    enlargedKeyContainer.appendChild(div);
  });
}

function showNextKey(){
  clearNextKey();
  const kana = lines[lineIdx][charIdx];
  if (!kana) {
    if(nextRomaContainer) nextRomaContainer.hidden = true;
    return;
  }

  // romaVariantsが設定されていない場合は、直接kana2romaから取得
  if (!romaVariants || romaVariants.length === 0) {
    romaVariants = kana2roma[kana] || [];
  }

  let expect = '';
  const typedLength = field.value.length;
  
  // romaVariantsが空でないことを確認
  if (romaVariants && romaVariants.length > 0) {
    for(const r of romaVariants) {
        if (r.startsWith(field.value)) {
            expect = r[typedLength];
            break;
        }
    }
  }

  if(!expect) {
      nextR.textContent = '...';
      return;
  }

  // ローマ字を個別の文字として表示
  const romaChars = expect.split('');
  const romaContainer = document.getElementById('roma-container');
  const nextRoma = document.getElementById('next-roma');
  const romaMarks = document.getElementById('roma-marks');
  
  // ローマ字の表示を更新
  if (nextRoma) nextRoma.textContent = expect;
  
  // マークの表示をクリア
  if (romaMarks) {
    romaMarks.innerHTML = '';
    
    // 各文字のマークを追加
    romaChars.forEach(char => {
      const mark = document.createElement('div');
      mark.className = 'mark';
      mark.textContent = '×'; // デフォルトは×
      romaMarks.appendChild(mark);
    });
  }

  // 【修正】data-key を使用してハイライト
  const btn = keyButtons.find(b => b.dataset.key === expect);
  const finger = getFingerForKey(expect);
  const rootStyle = getComputedStyle(document.documentElement);
  const fingerColor = rootStyle.getPropertyValue(`--${finger}`).trim();
  
  if(btn) {
    // キーに運指の色を設定して点滅クラスを追加
    btn.style.setProperty('--current-color', fingerColor);
    btn.classList.add("next-key");
  }

  const fingerElements = document.querySelectorAll(`.finger-${finger}`);
  fingerElements.forEach(span => {
    if (span) {
      // 運指レジェンドにも運指の色を設定して点滅クラスを追加
      // 既存のtransformを保持する
      const currentTransform = window.getComputedStyle(span).transform;
      span.style.setProperty('--current-color', fingerColor);
      span.classList.add("next-finger");
      // transformを元に戻す
      if (currentTransform && currentTransform !== 'none') {
        span.style.transform = currentTransform;
      }
    }
  });

  nextC.textContent = kana;
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

function prepareCharUI() {
    drawLine();
    field.value = "";
    
    const nextKana = lines[lineIdx][charIdx];
    if (nextKana) {
        // ひらがなを表示
        nextC.textContent = nextKana;
        
        // ローマ字の処理
        romaVariants = kana2roma[nextKana];
        currentRoma = romaVariants[0];
        showEnlargedKeys(currentRoma);
        
        // ローマ字の表示を非表示に
        if (nextRomaContainer) {
            nextRomaContainer.hidden = true;
        }
        
        // 次に打つべきキーのみを点滅させる（ナビゲーション）
        showNextKey();
        drawLine();
    }
}

function advanceToNextChar() {
    // 現在の文字が、最後の行の最後の文字かチェック
    if (lineIdx >= lines.length - 1 && charIdx >= lines[lineIdx].length - 1) {
        showResults();
        return; // 終了
    }

    // 次の文字へインデックスを進める
    charIdx++;
    if (charIdx >= lines[lineIdx].length) {
        charIdx = 0;
        lineIdx++;
    }

    // 次の文字のUIを準備
    prepareCharUI();
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
  
  // ローマ字の各文字のマークを更新
  const romaChars = field.value.split('');
  const marks = document.querySelectorAll('#roma-marks .mark');
  marks.forEach((mark, index) => {
    if (index < romaChars.length) {
      mark.style.display = 'inline-block';
      mark.className = `mark ${correctInput ? 'correct' : 'wrong'}`;
      mark.textContent = correctInput ? '○' : '×';
    } else {
      mark.style.display = 'none';
    }
  });
  
  // ミスタイプ時の処理
  if (!correctInput) {
    errors++;
    if (retryMessage) retryMessage.hidden = false;
    
    // 間違えたキーにミスタイプクラスを追加
    const currentKeyEl = enlargedKeyContainer?.children?.[field.value.length];
    if (currentKeyEl) {
      currentKeyEl.classList.add('mistyped');
    }
    
    // フィールドをクリア
    field.value = '';
    
    // エラーカウントを更新
    updateStats();
    
    // エラー音を鳴らす（必要に応じて）
    // new Audio('path/to/error-sound.mp3').play().catch(() => {});
    
    return;
  }

    if (correctInput) {
      if (retryMessage) retryMessage.hidden = true;

      const mistypedKey = enlargedKeyContainer.querySelector('.mistyped');
      if (mistypedKey) {
        mistypedKey.classList.remove('mistyped');
      }

      const doneIndex = typedSoFar.length - 1;
      const currentKeyEl = enlargedKeyContainer?.children?.[doneIndex];

      if (currentKeyEl) {
        currentKeyEl.classList.remove('current');
        currentKeyEl.classList.add('done', 'show-success-ring');

        // アニメーションが終わったらクラスを削除
        setTimeout(() => {
          currentKeyEl.classList.remove('show-success-ring');
        }, 300); // アニメーションの長さに合わせる
      }

      field.value = typedSoFar;

      // アニメーションが終わるのを待ってから次に進む
      setTimeout(() => {
        if (field.value === currentRoma) {
          advanceToNextChar();
        } else {
          const nextKeyEl = enlargedKeyContainer?.children?.[doneIndex + 1];
          if (nextKeyEl) {
            nextKeyEl.classList.remove('pending');
            nextKeyEl.classList.add('current');
          }
        }
      }, 300); // アニメーションの長さに合わせる
    } else { // 間違った文字を入力した場合
            errors++; // エラーカウントを増やす
      if (retryMessage) retryMessage.hidden = false;
      
      // 現在の拡大キーに×印をつける
      const currentKeyEl = enlargedKeyContainer?.querySelector('.current');
      if (currentKeyEl) {
          currentKeyEl.classList.add('mistyped');
      }
  }

  drawLine(); // 練習テキストの表示を更新
  showNextKey(); // 次に打つべきキーと運指ハイライトを更新

}

function showResults() {
  // 結果を計算
  const totalTime = (performance.now() - startTime) / 1000; // 秒単位
  const minutes = Math.floor(totalTime / 60);
  const seconds = Math.floor(totalTime % 60);
  
  // 入力文字数の合計を計算
  let totalChars = 0;
  for (let i = 0; i < lines.length; i++) {
    totalChars += lines[i].length;
  }
  
  // 正解数（ミスを引いた数）
  const correctCount = totalChars - errors;
  
  // WPMの計算（1単語 = 5文字として計算）
  const wpm = Math.round((totalChars / 5) / (totalTime / 60));
  
  // 正確率の計算
  const accuracy = Math.round((correctCount / totalChars) * 100) || 0;
  
  // スコアの計算（WPM × 正確率 / 100）
  const score = Math.round(wpm * accuracy / 100);
  
  // 結果ページにリダイレクト
  window.location.href = `result.html?score=${score}&correct=${correctCount}&total=${totalChars}&errors=${errors}&time=${minutes}:${seconds.toString().padStart(2, '0')}&wpm=${wpm}&accuracy=${accuracy}`;
}

function startGame() {
  // 状態を初期化
  lineIdx = 0; 
  charIdx = 0; 
  errors = 0; 
  startTime = null;
  romaVariants = []; 
  currentRoma = '';
  field.value = '';
  
  // UIと状態をアクティブに
  start.disabled = true;
  field.disabled = false;
  if (retryMessage) retryMessage.hidden = true;

  // ハイライトを全てクリア
  clearNextKey();
  const highlightedKeys = document.querySelectorAll('#keyboard .key.next, #keyboard .key.current, #keyboard .key.mistyped');
  highlightedKeys.forEach(k => k.classList.remove('next', 'current', 'mistyped'));
  if (enlargedKeyContainer) {
    enlargedKeyContainer.innerHTML = '';
  }
  
  // 最初の文字のUIを準備
  prepareCharUI();
  
  // 入力フィールドにフォーカス
  field.focus();
}

start.onclick = startGame;

document.addEventListener("keydown", handleKeyPress);

// ------------------- リセット処理 -------------------
function resetGame() {
  // スタートボタンを有効化
  start.disabled = false;
  // 入力フィールドを無効化（Start を押すまで入力不可）
  field.disabled = true;
  // キーボードや拡大キーのハイライトをクリア
  clearNextKey();
  if (enlargedKeyContainer) enlargedKeyContainer.innerHTML = '';
  // その他のUI要素は index.html 側のリセット処理で管理
}

// リセットボタン
resetBtn.addEventListener('click', resetGame);