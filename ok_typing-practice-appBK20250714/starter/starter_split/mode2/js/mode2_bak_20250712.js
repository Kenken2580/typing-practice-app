// mode2.js – curriculum and patches for Mode2 (voiced/small kana practice)
// This file MUST load after script.js and mode1.js.
// It defines a new curriculum of 92 tokens (voiced consonants, digraphs, etc.)
// and patches drawLine / prepareCharUI to display multi-character kana correctly.

(() => {
  if (window.mode2Inited) return; // guard
  window.mode2Inited = true;

  /** 1. Build placeholder mapping -------------------------------------- */
  const TOKENS = [
    'が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ',
    'だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ',
    'ぱ','ぴ','ぷ','ぺ','ぽ',
    'きゃ','きゅ','きょ','しゃ','しゅ','しょ','ちゃ','ちゅ','ちょ','にゃ','にゅ','にょ',
    'ひゃ','ひゅ','ひょ','みゃ','みゅ','みょ','りゃ','りゅ','りょ',
    'ぎゃ','ぎゅ','ぎょ','じゃ','じゅ','じょ','ぢゃ','ぢゅ','ぢょ','びゃ','びゅ','びょ','ぴゃ','ぴゅ','ぴょ',
    'しぇ','じぇ','ちぇ','うぃ','うぇ','うぉ','てぃ','てゅ','とぅ','でぃ','でゅ','どぅ',
    'ふぁ','ふぃ','ふぇ','ふぉ','ゔぁ','ゔぃ','ゔゅ','ゔぇ','ゔぉ',
    'ぁ','ぃ','ぅ','ぇ','ぉ','ゃ','ゅ','ょ','っ','ゎ'
  ];

  // Private-use characters start.
  const BASE = 0xE000;
  const placeholderDisplay = {};
  const placeholderRoma = {};

  // romanisation mapping for each token
  const ROMA_MAP = {
    'が':['ga'],'ぎ':['gi'],'ぐ':['gu'],'げ':['ge'],'ご':['go'],
    'ざ':['za'],'じ':['ji','zi'],'ず':['zu'],'ぜ':['ze'],'ぞ':['zo'],
    'だ':['da'],'ぢ':['ji','di','zi'],'づ':['zu','du'],'で':['de'],'ど':['do'],
    'ば':['ba'],'び':['bi'],'ぶ':['bu'],'べ':['be'],'ぼ':['bo'],
    'ぱ':['pa'],'ぴ':['pi'],'ぷ':['pu'],'ぺ':['pe'],'ぽ':['po'],
    'きゃ':['kya'],'きゅ':['kyu'],'きょ':['kyo'],
    'しゃ':['sha','sya'],'しゅ':['shu','syu'],'しょ':['sho','syo'],
    'ちゃ':['cha','tya','cya'],'ちゅ':['chu','tyu','cyu'],'ちょ':['cho','tyo','cyo'],
    'にゃ':['nya'],'にゅ':['nyu'],'にょ':['nyo'],
    'ひゃ':['hya'],'ひゅ':['hyu'],'ひょ':['hyo'],
    'みゃ':['mya'],'みゅ':['myu'],'みょ':['myo'],
    'りゃ':['rya'],'りゅ':['ryu'],'りょ':['ryo'],
    'ぎゃ':['gya'],'ぎゅ':['gyu'],'ぎょ':['gyo'],
    'じゃ':['ja','jya','zya'],'じゅ':['ju','jyu','zyu'],'じょ':['jo','jyo','zyo'],
    'ぢゃ':['ja','dya'],'ぢゅ':['ju','dyu'],'ぢょ':['jo','dyo'],
    'びゃ':['bya'],'びゅ':['byu'],'びょ':['byo'],
    'ぴゃ':['pya'],'ぴゅ':['pyu'],'ぴょ':['pyo'],
    'しぇ':['she','sye'],'じぇ':['je','jye'],'ちぇ':['che','tye','cye'],
    'うぃ':['wi'],'うぇ':['we'],'うぉ':['wo','who'],
    'てぃ':['ti'],'てゅ':['tyu','thu'],'とぅ':['tu','to'],
    'でぃ':['di','dhi'],'でゅ':['dyu','dhu'],'どぅ':['du','dho'],
    'ふぁ':['fa'],'ふぃ':['fi'],'ふぇ':['fe'],'ふぉ':['fo'],
    'ゔぁ':['va'],'ゔぃ':['vi'],'ゔゅ':['vyu'],'ゔぇ':['ve'],'ゔぉ':['vo'],
    'ぁ':['xa','la'],'ぃ':['xi','li'],'ぅ':['xu','lu'],'ぇ':['xe','le'],'ぉ':['xo','lo'],
    'ゃ':['xya','lya'],'ゅ':['xyu','lyu'],'ょ':['xyo','lyo'],
    'っ':['xtsu','ltsu','xtu','ltu'],'ゎ':['xwa','lwa']


  TOKENS.forEach((tok, idx) => {
    const ph = String.fromCharCode(BASE + idx);
    placeholderDisplay[ph] = tok;
    placeholderRoma[ph] = ROMA_MAP[tok] || [];
  });

  // Build lines (10 tokens per line) using placeholders
  const lines = [];
  // Build lines: 10 UNIQUE tokens per visual line, each repeated REP times consecutively
  TOKENS.forEach((tok, idx) => {
    const ph = String.fromCharCode(BASE + idx);
    const lineIdx = Math.floor(idx / 10); // decide line by token index, not by repetition
    if (!lines[lineIdx]) lines[lineIdx] = '';
    for (let rep = 0; rep < 5; rep++) {
      lines[lineIdx] += ph;

  });

  // Override global lines & mappings
  window.lines = lines;
  window.defaultLines = [...lines];
  if (typeof window.kana2roma === 'object') {
    Object.assign(window.kana2roma, placeholderRoma);
  }
  window.placeholderDisplay = placeholderDisplay;

  /** 2. Patch drawLine & prepareCharUI for Mode2 ----------------------- */
  const {drawLine: originalDrawLine, prepareCharUI: origPrep} = window;
  const REP = (typeof window.REPETITIONS === 'number') ? window.REPETITIONS : 5;
  

  


    if (window.currentMode === 2) {
      // 標準キー入力チェックと同様の前処理
      if (waitingFirstKey) {
        waitingFirstKey = false;
        if (countdownEl) countdownEl.hidden = true;
        playClick();
        if (!beatTimer) beatTimer = setInterval(handleBeat, BEAT_MS);
  
      awaitingInput = false;
      if (start.disabled === false || (e.isComposing && e.code !== 'IntlYen')) return;
      
      const specialKeys = ['Shift', 'Control', 'Alt', 'CapsLock', 'Enter', 'Backspace', 'Tab', 'Meta', 'ContextMenu', 'NonConvert', 'Convert', 'KanaMode', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Delete', 'Insert', 'IntlYen'];
      if (e.key.length > 1 && !specialKeys.includes(e.key)) return;
      
      e.preventDefault();
      if (!startTime) startTime = performance.now();
      
      // 入力されたキーを小文字化
      const k = e.key.toLowerCase();
      
      // 現在表示中の文字のプレースホルダーを取得
      const groupBaseIdx = Math.floor(charIdx / REP) * REP;
      const nextKanaPh = window.lines[lineIdx]?.[groupBaseIdx];
      
      // プレースホルダーに対応するローマ字を取得
      const romaArr = window.placeholderRoma[nextKanaPh] || [];
      const romaStr = (romaArr[0] || '').toLowerCase();
      
      // Mode2では入力中のローマ字の次の文字と比較
      const typedSoFar = field.value + k;
      let correctInput = false;
      
      // 入力中文字列が正解のローマ字の先頭部分と一致するか確認
      for (const r of romaArr) {
        const lowerR = r.toLowerCase();
        if (lowerR.startsWith(typedSoFar)) {
          correctInput = true;
          window.currentRoma = lowerR;
          break;
    
  
      
      // 押されたキーをハイライト
      const pressedKeyEl = keyButtons.find(b => b.dataset.code === e.code);
      if (pressedKeyEl) {
        pressedKeyEl.classList.add(correctInput ? 'correct' : 'wrong');
        setTimeout(() => {
          pressedKeyEl.classList.remove('correct', 'wrong');
    , 200);
  
      
      if (correctInput) {
        // 正解の場合
        field.value = typedSoFar;
        if (field.value === window.currentRoma) {
          // 完全に入力し終わった場合
          advanceToNextChar();
     else {
          // まだ入力途中の場合
          showNextKey(); // 次のキーのハイライト表示を更新
    
   else {
        // 間違った場合
        wrongTouches++;
        playWrong();
  
      


    
    // Mode2以外はオリジナルのハンドラを呼び出す



  window.drawLine = function () {
    if (window.currentMode === 2 && window.placeholderDisplay) {
      const currentLine = window.lines[lineIdx] || '';
      const uniqueCount = Math.ceil(currentLine.length / REP);
      const parts = [];
      const currentGroup = Math.floor(charIdx / REP);
      for (let ui = 0; ui < uniqueCount; ui++) {
        const ch = currentLine[ui * REP];
        const disp = window.placeholderDisplay[ch] || ch;
        if (ui < currentGroup) {
          parts.push(`<span style=\"color:gray\">${disp}</span>`);
     else if (ui === currentGroup) {
          parts.push(`<span style=\"color:#2196f3;text-decoration:underline;\">${disp}</span>`);
     else {
          parts.push(disp);
    
  
      const html = parts.join('');
      const textEl = document.getElementById('practice-text');
      if (textEl) textEl.innerHTML = html;
 else if (typeof originalDrawLine === 'function') {
      originalDrawLine();



  window.prepareCharUI = function () {
    const REP = (typeof window.REPETITIONS === 'number') ? window.REPETITIONS : 5;
    
    // Mode2の処理を先に行う（script.jsのprepareCharUIよりも優先）
    if (window.currentMode === 2 && window.placeholderDisplay) {
      const groupBaseIdx = Math.floor(charIdx / REP) * REP;
      const nextKanaPh = window.lines[lineIdx]?.[groupBaseIdx];
      const disp = window.placeholderDisplay[nextKanaPh] || nextKanaPh;
      const nextC = document.getElementById('next-char');
      if (nextC) nextC.textContent = disp;

      // ---- 同時キー点滅 (Mode2) ----
      // 前のハイライトをクリア
      document.querySelectorAll('.next-key').forEach(el => {
        el.classList.remove('next-key');
        el.style.removeProperty('--current-color');
  );
      document.querySelectorAll('.next-finger').forEach(el => {
        el.classList.remove('next-finger');
        el.style.removeProperty('--current-color');
  );

      // ローマ字を取得して各文字をハイライト
      // Mode2専用のローマ字マッピングを使用
      const romaArr = placeholderRoma[nextKanaPh] || [];
      const romaStr = (romaArr[0] || '').toLowerCase();
      console.log('Mode2 kana:', nextKanaPh, 'display:', disp, 'roma:', romaStr);

      // グローバル変数を更新（script.jsの処理との整合性のため）
      window.currentRoma = romaStr;
      window.romaVariants = romaArr;

      if (typeof window.showEnlargedKeys === 'function') {
        window.showEnlargedKeys(romaStr);
  
      const romaContainerEl = document.getElementById('roma-container');
      if(romaContainerEl) romaContainerEl.hidden = false;

      if (romaStr) {
        const rootStyle = getComputedStyle(document.documentElement);
        [...romaStr].forEach(ch => {
          // 小文字で検索
          const btn = document.querySelector(`.key[data-key='${ch.toLowerCase()}']`);
          // 指の色を取得
          const finger = getFingerForKeyMode2(ch.toLowerCase());
          if(btn && finger){
            let fingerColor = rootStyle.getPropertyValue(`--${finger}`).trim();
            if(!fingerColor) fingerColor = '#2196f3';
            btn.style.setProperty('--current-color', fingerColor);
            btn.classList.add('next-key');
            // 指レジェンド
            const fingerElements = document.querySelectorAll(`.finger-${finger}`);
            fingerElements.forEach(span=>{
              span.style.setProperty('--current-color', fingerColor);
              span.classList.add('next-finger');
        );
      
    );
  

      return; // Mode2 の専用処理だけで完結

    
    // Mode1やその他のモードの場合は元の関数を呼ぶ
    if (typeof origPrep === 'function') origPrep();
  }

  // モード2用の指の対応付け
  function getFingerForKeyMode2(ch){
    const fingerMap = {
      'q1az': 'left-pinky', 
      'w2sx': 'left-ring', 
      'e3dc': 'left-middle', 
      'r4fv5tgb': 'left-index',
      'y6hnu7jm': 'right-index', 
      'i8k,': 'right-middle', 
      'o9l.': 'right-ring', 
      'p0;:/[{"-=-]}\\': 'right-pinky',
      ' ': 'thumb'
  
    
    for(const keys in fingerMap){
      if(keys.includes(ch)){
        return fingerMap[keys];
  

    return 'left-index'; // デフォルト
  }
})();
