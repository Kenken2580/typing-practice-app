/* ---------- 1. データ ---------- */
const lines = [
  "あかさたなはまやらわ",
  "いきしちにひみり", // ゐは一般的でないため削除
  "うくすつぬふむゆる",
  "えけせてねへめれ",
  "おこそとのほもよろをん" // んを追加
];

// グローバル公開してモード切替時に書き換えられるようにする
window.lines = [...lines];
window.defaultLines = [...lines];

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
const repCounter = $("#repetition-counter");
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
// メトロノーム設定
let BPM = 90;                     // 1 分あたりの拍数 (初期)
let BEAT_MS = 60000 / BPM;         // 1 拍のミリ秒 (計算値)
let beatTimer = null;              // setInterval ID
let waitingFirstKey = false;       // カウントダウン後、最初のキー待ちか
let currentMode = 2;               // 1:slow 2:normal 3:custom
let awaitingInput = false;         // ビート待ちフラグ
let pausedByMistype = false;      // ミスタイプで停止したか
let lineIdx = 0, charIdx = 0;
let errors = 0;                 // ビート遅延などのテンポエラー用
let mistypeTouches = 0;         // 違うキーを押した回数
let correctTouches = 0;         // 正しくキーを押せた回数
let startTime = null;

// --- Mode1 repetition control ---
const REPETITIONS = 5;           // 同じ文字を打つ回数
let repetitionIdx = 0;           // 現在の繰り返し回数(0〜4)

let romaVariants = [];
let currentRoma = '';

/* ---------- 7. 画面描画 ---------- */
function drawLine(){
  const isMode1 = window.currentMode === 1;
  textEl.innerHTML = lines[lineIdx].split("")
    .map((c,i) => {
      if (i < charIdx) return `<span style="color:gray">${c}</span>`;
      if (i === charIdx){
        // Mode1 は文字自体を赤色にして強調
        const style = isMode1 ? 'color:red;' : 'color:#2196f3;';
        return `<span style="${style}text-decoration:underline;">${c}</span>`;
      }
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
  const rawKana = lines[lineIdx][charIdx];
  // Mode2では placeholderDisplay を実際のひらがなへ変換
  const resolvedKana = (window.currentMode === 2 && window.placeholderDisplay && window.placeholderDisplay[rawKana]) ? window.placeholderDisplay[rawKana] : rawKana;
  if (!rawKana) {
    if(nextRomaContainer) nextRomaContainer.hidden = true;
    return;
  }

  // romaVariantsが設定されていない場合は、placeholderRoma または kana2roma から取得
  if (!romaVariants || romaVariants.length === 0) {
    if (window.placeholderRoma && window.currentMode === 2) {
      romaVariants = window.placeholderRoma[rawKana] || [];
    }
    if ((!romaVariants || romaVariants.length === 0) && kana2roma) {
      romaVariants = kana2roma[resolvedKana] || [];
    }
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
  // Mode2の場合、プレースホルダを実際のひらがなに変換
  const kana = (window.currentMode === 2 && window.placeholderDisplay && window.placeholderDisplay[rawKana]) ? window.placeholderDisplay[rawKana] : rawKana;
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

function updateRepCounter(){
    if(!repCounter) return;
    if(window.currentMode===1){
        repCounter.hidden = false;
        repCounter.textContent = REPETITIONS - repetitionIdx;
    }else{
        repCounter.hidden = true;
    }
}

function prepareCharUI() {
    // Mode1 では同じ文字を5回打つ間、毎回キー点滅を行う
    updateRepCounter();
    // （文字は変わらないため drawLine は charIdx 基準で OK）
    awaitingInput = true;  // 新しい文字が表示されたので次のキー入力を待つ
    drawLine();
    field.value = "";
    
    const nextKana = lines[lineIdx][charIdx];
    if (nextKana) {
        // ひらがなを表示
        nextC.textContent = nextKana;
        
        // ローマ字の処理
        romaVariants = kana2roma[nextKana] || (window.placeholderRoma ? window.placeholderRoma[nextKana] : []);
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
    const wasMode1 = window.currentMode === 1;
    // repCounter update will occur below as needed
    // 現在の文字が、最後の行の最後の文字かチェック
    if (lineIdx >= lines.length - 1 && charIdx >= lines[lineIdx].length - 1) {
        showResults();
        return; // 終了
    }

    // 1 文字完了につき正解カウンタ加算
    correctTouches++;
    
    // 次の文字へインデックスを進める
    if (window.currentMode === 2) {
        // 前回の入力内容をクリア（繰り返し時に累積しないよう）
        if (field) field.value = '';
        // ローマ字マークもリセット
        const marks = document.querySelectorAll('#roma-marks .mark');
        marks.forEach(m=>m.style.display='none');
        // Mode2では繰り返し文字の処理が必要
        const REP = 5; // mode2.jsと同じ値
        const groupIdx = Math.floor(charIdx / REP);
        const inGroupIdx = charIdx % REP;
        console.log('Mode2 advanceToNextChar - groupIdx:', groupIdx, 'inGroupIdx:', inGroupIdx);
        
        // 同一グループ内での移動かどうかを確認
        if (inGroupIdx < REP - 1) {
            // グループ内での次の文字へ（同じひらがなの繰り返し）
            charIdx++;
        } else {
            // 次のグループへ移動
            charIdx = (groupIdx + 1) * REP;
            if (charIdx >= lines[lineIdx].length) {
                charIdx = 0;
                lineIdx++;
            }
        }
    } else {
        // 通常の処理（Mode1や3）
        charIdx++;
        if (charIdx >= lines[lineIdx].length) {
            charIdx = 0;
            lineIdx++;
        }
    }

    // 次の文字のUIを準備
    prepareCharUI();
    // Mode2: 新しいグループの先頭でインフォメーションを表示（無音カウントダウン）
    if (window.currentMode === 2 && charIdx % 5 === 0) {
        showPracticeCountdown();
    }

    // Mode1: 5 回練習が終わったら次文字の練習前に無音カウントダウン
    if (wasMode1) {
        clearInterval(beatTimer);
        beatTimer = null;
        showPracticeCountdown();
        return; // カウントダウン後のキー入力を待つ
    }
}

/* ---------- 8. 入力処理 ---------- */
// グローバルにして mode2.js からも参照できるようにする
window.handleKeyPress = function(e){
  // Mode2の区切りインフォメーション（カウントダウン）表示中はキー入力を無効化
  if (window.currentMode === 2 && countdownEl && !countdownEl.hidden && !waitingFirstKey) return;


  // 最初のキー入力でメトロノーム開始（Mode1 のみ）
    if (waitingFirstKey) {
        waitingFirstKey = false;
        if (countdownEl) countdownEl.hidden = true;
        playClick();
        if (!beatTimer) { // 既にタイマーが走っていない場合のみ開始
            beatTimer = setInterval(handleBeat, BEAT_MS);
        }
    }
  // ユーザーが何かキーを押した → ビート待ち解除
  awaitingInput = false;
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

  // Mode2でのキー入力を確実に認識するための最終修正
  // グローバル変数から必ず最新の値を取得する
  const globalRomaVariants = window.romaVariants || [];
  const localRomaVariants = romaVariants || [];
  
  // より詳細なデバッグ情報
  console.log('DEBUG: charIdx:', charIdx, 'lineIdx:', lineIdx, 'lines[lineIdx]:', window.lines[lineIdx]);
  console.log('DEBUG: typedSoFar:', typedSoFar, 'field.value:', field.value);
  
  // 有効な値を持つほうを使用
  const effectiveVariants = globalRomaVariants.length > 0 ? globalRomaVariants : localRomaVariants;
  
  console.log('DEBUG typed', typedSoFar, 'key:', k, 
              'effectiveVariants:', effectiveVariants,
              'currentMode:', window.currentMode);
  // 実際の処理でも有効な変数を使用する
  for (const r of effectiveVariants) {
      if (r.toLowerCase().startsWith(typedSoFar.toLowerCase())) {
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
    mistypeTouches++; // ミスタイプ数を加算
    // ---- Mode1 専用: ミスタイプしたら練習をリセット ----
    if(currentMode === 1){
      if(beatTimer){ clearInterval(beatTimer); beatTimer=null; }
      pausedByMistype=true;
      // 同じ文字を最初からやり直す
      field.value = '';
      showPracticeCountdown(); // 現在の文字でカウントダウン (無音)
      return; // 以降の処理は行わない
    }
    // ---- 既存処理 (Mode2/3) ----
    if(beatTimer){ clearInterval(beatTimer); beatTimer=null; pausedByMistype=true; }

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

        // アニメーションが終わるのを待ってから次に進む
        setTimeout(() => {
          currentKeyEl.classList.remove('show-success-ring');
        }, 300); // アニメーションの長さに合わせる
      }

      field.value = typedSoFar;

      // アニメーションが終わるのを待ってから次に進む
      setTimeout(() => {
        if (field.value === currentRoma) {
          advanceToNextChar();
          // もしメトロノームがミスタイプで停止していれば再開
          if(pausedByMistype && !beatTimer){ beatTimer = setInterval(handleBeat, BEAT_MS); pausedByMistype=false; }
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
  if (beatTimer) {
    clearInterval(beatTimer);
    beatTimer = null;
  }
  // 結果を計算
  const totalTime = (performance.now() - startTime) / 1000; // 秒単位
  const minutes = Math.floor(totalTime / 60);
  const seconds = Math.floor(totalTime % 60);
  
      // 入力統計
  const kanaTotal = lines.reduce((s,l)=>s+l.length,0);
  const correctCount = Math.min(correctTouches, kanaTotal);
  const mistypeCount = mistypeTouches;
  const totalChars = correctCount + mistypeCount;

  // WPM（1 単語=5文字）
  const wpm = totalChars ? Math.round((totalChars / 5) / (totalTime / 60)) : 0;
  // 正確率
  const accuracy = totalChars ? Math.round((correctCount / totalChars) * 100) : 0;
  
  // スコアの計算（WPM × 正確率 / 100）
  const score = Math.round(wpm * accuracy / 100);
  
  // 結果ページにリダイレクト
  window.location.href = `result.html?score=${score}&correct=${correctCount}&total=${totalChars}&errors=${mistypeCount}&time=${minutes}:${seconds.toString().padStart(2, '0')}&wpm=${wpm}&accuracy=${accuracy}`;
}

function startGame() {
  // Mode1 は常に最初のキー入力待ちで開始
  if(currentMode === 1 && lineIdx === 0 && charIdx === 0){
    waitingFirstKey = true;
  }
  const shouldWait = waitingFirstKey;
  // 既存のタイマーが動いていれば停止
  if (beatTimer) {
    clearInterval(beatTimer);
    beatTimer = null;
  }
  // Mode2のプレビュー音を停止
  if (window.mode2PreviewTimer) {
    clearInterval(window.mode2PreviewTimer);
    window.mode2PreviewTimer = null;
  }
  // 状態を初期化
  lineIdx = 0; 
  charIdx = 0; 
  errors = 0;
  mistypeTouches = 0;
  correctTouches = 0; 
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

  // メトロノームタイマー開始 (Mode1 で waitingFirstKey の場合は保留)
  if(!shouldWait){
    beatTimer = setInterval(handleBeat, BEAT_MS);
  }
  
  // 入力フィールドにフォーカス
  field.focus();
}

start.onclick = startGame;

document.addEventListener("keydown", handleKeyPress);

/* ---------- モード切替 ---------- */
const modeBtns = document.querySelectorAll('#mode-buttons button');
const tempoSlider = document.getElementById('tempo-slider');
const tempoValue = document.getElementById('tempo-value');
const tempoControl = document.getElementById('tempo-control');

function applyBPM(newBpm){
  BPM = newBpm;
  BEAT_MS = 60000 / BPM;
  if(tempoValue) tempoValue.textContent = `${BPM} BPM`;
  // すでにタイマーが動いていれば再設定
  if(beatTimer){ clearInterval(beatTimer); beatTimer = setInterval(handleBeat, BEAT_MS); }
}

function setMode(m){
  currentMode = m;
  modeBtns.forEach(b=>{
    const btnModeAttr = b.dataset.mode;
    const isModeButton = btnModeAttr !== undefined && btnModeAttr !== '';
    const btnMode = isModeButton ? parseInt(btnModeAttr) : NaN;
    if(isModeButton){
      b.classList.toggle('active', btnMode===m);
      if(m===2){
        const isOther = btnMode!==2;
        b.style.opacity = isOther ? '0.5' : '1';
      }else{
        b.style.opacity = '1';
      }
    }
  });
  if(m===1){ // slow
    applyBPM(40);
    // --- ensure Mode1 curriculum is active ---
    if(window.defaultLines){
      window.lines = window.defaultLines.slice();
      if(typeof lines !== 'undefined'){
        lines.length = 0;
        lines.push(...window.lines);
      }
    }
    if(tempoControl) tempoControl.style.display='none';
  }else if(m===2){ // normal
    applyBPM(90);
    // --- ensure Mode2 curriculum is active ---
    if(window.defaultLines){
      window.lines = window.defaultLines.slice();
      if(typeof lines !== 'undefined'){
        lines.length = 0;
        lines.push(...window.lines);
      }
    }

    if(tempoControl) tempoControl.style.display='flex';
  }else{ // custom
    if(tempoSlider) applyBPM(parseInt(tempoSlider.value));
    if(tempoControl) tempoControl.style.display='flex';
  }
}
modeBtns.forEach(btn=>{
  const modeAttr = btn.dataset.mode;
  if(modeAttr !== undefined && modeAttr !== ''){
    btn.addEventListener('click',()=>{
      setMode(parseInt(modeAttr));
    });
  }
});
if(tempoSlider){
  tempoSlider.addEventListener('input', e=>{
    if(currentMode===2 || currentMode===3) applyBPM(parseInt(e.target.value));
  });
}
// 初期モードは mode1.js 側で selectMode(1) を呼び出して設定するため
// setMode(2); // ← デフォルト非表示レイアウトを防ぐため無効化

/* ---------- カウントダウン ---------- */
const countdownEl = document.getElementById('countdown-overlay');
function startCountdown(){
  // 既存タイマーを完全停止し重複クリック音を防止
  if (beatTimer) { clearInterval(beatTimer); beatTimer = null; }
  if (window.metronomeTimer) { clearInterval(window.metronomeTimer); window.metronomeTimer = null; }
  // カウントダウン中はクリック音と表示を 1 つのタイマーで制御し、完全同期させる
  if (!countdownEl) { startGame(); return; }
  let count = 5; // 5 → 1 → Start!
  const beatMs = BEAT_MS; // 現在のテンポに合わせる

  countdownEl.hidden = false;
  //countdownEl.style.top = '8%';

  function step(){
    // 表示更新（0 になったら "Start!"）
    // Mode2: プレースホルダ文字をひらがなへ変換
   const rawKana = lines[lineIdx][charIdx] || '';
   const kana = (window.currentMode === 2 && window.placeholderDisplay && window.placeholderDisplay[rawKana]) ? window.placeholderDisplay[rawKana] : rawKana;
    const vowelGuide = {
      'あ': {roma:'A', finger:'左手小指'},
      'い': {roma:'I', finger:'右手人差し指'},
      'う': {roma:'U', finger:'右手中指'},
      'え': {roma:'E', finger:'左手中指'},
      'お': {roma:'O', finger:'右手薬指'}
    };
    let notice;
    if(vowelGuide[kana]){
      const g = vowelGuide[kana];
      notice = `<div style="text-align:center;line-height:1.6;font-size:1.4rem;color:white;">
        <div>同じ文字を繰り返すレッスンです。</div>
        <div>${g.finger}に${g.roma}のキーの位置を</div>
        <div>覚えさせます。</div>
        <br>
        <div>「${kana}」を5回練習しましょう</div>
      </div>`;
    }else{
      const roma = (currentRoma || '').toUpperCase().split('').join(' ');
      notice = `<div style="text-align:center;line-height:1.6;font-size:1.4rem;color:white;">
        <div>「${kana}」を5回練習しましょう</div>
        <div style="letter-spacing:0.15rem;font-weight:bold;">${roma} ${roma}</div>
        <div>とリズムに乗って</div>
        <div>正確に打てるように</div>
        <div>練習します！</div>
      </div>`;
    }
    const num = `<div class="practice-count">${count > 0 ? count : 'Start!'}</div>`;
    // 親指カウント用に更新
    const thumbCountEl = document.getElementById('thumb-count');
    if (thumbCountEl) thumbCountEl.textContent = count > 0 ? count : '';
    countdownEl.innerHTML = notice + num;

    // クリック音再生
    // playClick();

    if (count === 0) {
      // 次のビートでゲーム開始
      setTimeout(() => {
        waitingFirstKey = true; // 最初のキー入力待ち
        countdownEl.hidden = true;
        if(field) field.disabled = false; // 入力受付を再開
        const thumbCountEl = document.getElementById('thumb-count');
        if (thumbCountEl) thumbCountEl.hidden = true;
        startGame();
      }, beatMs);
      return;
    }

    count--;
    setTimeout(step, beatMs);
  }

  // 処理開始
  step();

}

/* ---------- 文字ごとの無音カウントダウン (Mode1) ---------- */
function showPracticeCountdown(){
  // 既存タイマーを完全停止（Mode1の無音カウントダウン用）
  if (beatTimer) { clearInterval(beatTimer); beatTimer = null; }
  if (window.metronomeTimer) { clearInterval(window.metronomeTimer); window.metronomeTimer = null; }
  if (!countdownEl) return;
  // Mode2: placeholder を実ひらがなへ
  const rawKanaStep = lines[lineIdx][charIdx] || '';
  const kana = (window.currentMode === 2 && window.placeholderDisplay && window.placeholderDisplay[rawKanaStep]) ? window.placeholderDisplay[rawKanaStep] : rawKanaStep;
  let count = 5;
  waitingFirstKey = false; // リセット
  // 親指付近カウントダウン表示要素の準備（finger-thumb 内に配置）
  let thumbCountEl = document.getElementById('thumb-count');
  if (!thumbCountEl){
    const thumbSpan = document.querySelector('.finger-thumb');
    if (thumbSpan){

      thumbCountEl = document.createElement('div');
      thumbCountEl.id = 'thumb-count';
      // 固定座標で配置（画面座標）
      const rect = thumbSpan.getBoundingClientRect();
      thumbCountEl.style.position = 'fixed';
      thumbCountEl.style.left = (rect.left + rect.width/2) + 'px';
      thumbCountEl.style.top = (rect.top - 36) + 'px';
      thumbCountEl.style.transform = 'translateX(-50%)';
      thumbCountEl.style.fontSize = '1.8rem';
      thumbCountEl.style.fontWeight = 'bold';
      thumbCountEl.style.color = '#ff5722';
      thumbCountEl.style.zIndex = '9999';
      thumbCountEl.style.pointerEvents = 'none';
      thumbSpan.appendChild(thumbCountEl);
    }
  }
  thumbCountEl.hidden = false;
  countdownEl.hidden = false;
  // カウントダウン中は入力フィールドを無効化
  if(field) field.disabled = true;

  function step(){
    let notice;
    const vowelGuide = {
      'あ': {roma:'A', finger:'左手小指'},
      'い': {roma:'I', finger:'右手人差し指'},
      'う': {roma:'U', finger:'右手中指'},
      'え': {roma:'E', finger:'左手中指'},
      'お': {roma:'O', finger:'右手薬指'}
    };
    if(vowelGuide[kana]){
      const g = vowelGuide[kana];
      notice = `<div style="text-align:center;line-height:1.6;font-size:1.4rem;color:white;">
        <div>同じ文字を繰り返すレッスンです。</div>
        <div>${g.finger}に${g.roma}のキーの位置を</div>
        <div>覚えさせます。</div>
        <br>
        <div>「${kana}」を5回練習しましょう</div>
      </div>`;
    }else{
      const roma = (currentRoma || '').toUpperCase().split('').join(' ');
      notice = `<div style="text-align:center;line-height:1.6;font-size:1.4rem;color:white;">
        <div>「${kana}」を5回練習しましょう</div>
        <div style="letter-spacing:0.15rem;font-weight:bold;">${roma} ${roma}</div>
        <div>とリズムに乗って</div>
        <div>正確に打てるように</div>
        <div>練習します！</div>
      </div>`;
    }
    const num    = `<div class="practice-count">${count > 0 ? count : 'Start!'}</div>`;
    countdownEl.innerHTML = notice + num;

    if(count === 0){
      // ユーザーの入力待ち (無音)
      waitingFirstKey = true;
      return;
    }
    count--;
    setTimeout(step, BEAT_MS); // 無音カウントダウン
  }
  step();
}

/* ---------- クリック音 ---------- */
let audioCtx;
// クリック音の音量（0.0〜1.0） デフォルト=300/800≈0.375
window.clickVolume = 0.375;

// ---------------- Volume slider global handler ----------------
// Any input element with id="volume-slider" will control click volume.
(function(){
  function updateInitial(){
    const volEl = document.getElementById('volume-slider');
    if(volEl){
      volEl.value = window.clickVolume * (volEl.max ? +volEl.max : 100);
    }
  }
  // Set initial slider knob when DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateInitial);
  }else{
    updateInitial();
  }
  // Listen for any slider movement, even if element is inserted later
  document.addEventListener('input', (e)=>{
    if(e.target && e.target.id === 'volume-slider'){
      const el = e.target;
      const max = el.max ? +el.max : 100;
      window.clickVolume = +el.value / max;
    }
  });
})();
let lastClickTime = 0;
function playClick(){
  const now = performance.now();
  // 直近50ms以内にクリック音を鳴らしていれば二重再生をスキップ
  if (now - lastClickTime < 50) return;
  lastClickTime = now;
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gain.gain.setValueAtTime(window.clickVolume, audioCtx.currentTime);
    // 短いエンベロープでフェードアウトし余分なクリックを防止
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }catch(e){ /* ignore */ }
}

/* ---------- メトロノームビート処理 ---------- */
function handleBeat(){
  // カウントダウン中・waitingFirstKey中はクリック音を鳴らさない
  if (start.disabled === false || waitingFirstKey || (countdownEl && !countdownEl.hidden)) return;

  // 毎ビートごとにクリック音
  playClick();

  const expectedChar = currentRoma[field.value.length] || '';

  if(!expectedChar){
    awaitingInput = false;
    return; // ハイライト対象なし
  }

  // キーを点滅 (入力ナビゲーション)
  const keyEl = keyButtons.find(b => b.dataset.key === expectedChar);
  if(keyEl){
    keyEl.classList.add('beat-flash');
    setTimeout(()=>keyEl.classList.remove('beat-flash'), 150);
  }

  // 入力が間に合わなかった場合はエラー加算
  if(awaitingInput){
    errors++;
    updateStats?.();
  }
  // 次のビートまで入力待ち
  awaitingInput = true;
}

// ------------------- リセット処理 -------------------
function resetGame() {
  if (beatTimer) {
    clearInterval(beatTimer);
    beatTimer = null;
  }
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