// mode2.js – Mode2 curriculum and UI patches (voiced / digraph / small kana)
// This file must load after script.js.

  /**
   * This function is the main entry point for Mode2 patches.
   * It initializes private-use Unicode characters as placeholders,
   * overrides the line list, and overrides `drawLine` and `prepareCharUI`.
   * @todo document the meaning of `REP` and `BASE` constants.
   */
(() => {
  if (window.mode2Inited) return;
  window.mode2Inited = true;
  'use strict';
  
  // script.jsのhandleKeyPressを使用（重複登録を避ける）
  
  // 既存の関数をオーバーライドしないよう、新しいグローバル変数にマッピングをコピー
  if (!window.originalKana2roma) {
    window.originalKana2roma = Object.assign({}, window.kana2roma || {});
  }

  /* ------------------------------------------------------------------
     1. Build placeholder mapping & curriculum lines                   
     ------------------------------------------------------------------*/
  const REP = typeof window.REPETITIONS === 'number' ? window.REPETITIONS : 5;

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

  const BASE = 0xE000; // Private-use block start
  const placeholderDisplay = {};
  const placeholderRoma = {};

  const ROMA_MAP = {
    'が':['ga'],'ぎ':['gi'],'ぐ':['gu'],'げ':['ge'],'ご':['go'],
    'ざ':['za'],'じ':['ji','zi'],'ず':['zu'],'ぜ':['ze'],'ぞ':['zo'],
    'だ':['da'],'ぢ':['di','ji','zi'],'づ':['zu','du'],'で':['de'],'ど':['do'],
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
    'ぢゃ':['dya','ja'],'ぢゅ':['dyu','ju'],'ぢょ':['dyo','jo'],
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
  };

  TOKENS.forEach((tok, idx) => {
    const ph = String.fromCharCode(BASE + idx);
    placeholderDisplay[ph] = tok;
    placeholderRoma[ph] = ROMA_MAP[tok] || [];
  });

  const lines = [];
  TOKENS.forEach((tok, idx) => {
    const ph = String.fromCharCode(BASE + idx);
    const lineIdx = Math.floor(idx / 10);
    if (!lines[lineIdx]) lines[lineIdx] = '';
    for (let i = 0; i < REP; i++) lines[lineIdx] += ph;
  });

  // --- Mode2 overrides Mode1 line list ---
  if (Array.isArray(window.lines)) {
    window.lines.length = 0;
    lines.forEach(l=>window.lines.push(l));
  } else {
    window.lines = lines;
  }
  // --- Purge Mode1 line data from script.js variable if present ---
  if (typeof lines !== 'undefined') {
    lines.length = 0;
    lines.push(...window.lines);
  }
  if(Array.isArray(window.defaultLines)){
    window.defaultLines.length=0;
    lines.forEach(l=>window.defaultLines.push(l));
  } else {
    window.defaultLines = [...lines];
  }
  if (typeof window.kana2roma === 'object') {
    Object.assign(window.kana2roma, ROMA_MAP, placeholderRoma);
  }
  window.placeholderDisplay = placeholderDisplay;
  window.placeholderRoma = placeholderRoma;

  /* ------------------------------------------------------------------
     2. drawLine override (compact display & underline current token)   
     ------------------------------------------------------------------*/
  const originalDrawLine = window.drawLine;
  window.drawLine = function () {
    if (window.currentMode === 2 && window.placeholderDisplay) {
      const currentLine = window.lines[lineIdx] || '';
      const uniqueCount = Math.ceil(currentLine.length / REP);
      const currentGroup = Math.floor(charIdx / REP);
      const parts = [];
      for (let ui = 0; ui < uniqueCount; ui++) {
        const ch = currentLine[ui * REP];
        const disp = window.placeholderDisplay[ch] || ch;
        if (ui < currentGroup) {
          parts.push('<span style="color:gray">' + disp + '</span>');
        } else if (ui === currentGroup) {
          parts.push('<span style="color:#2196f3;text-decoration:underline;">' + disp + '</span>');
        } else {
          parts.push(disp);
        }
      }
      const textEl = document.getElementById('practice-text');
      if (textEl) textEl.innerHTML = parts.join('');
    } else if (typeof originalDrawLine === 'function') {
      originalDrawLine();
    }
  };

  /* ------------------------------------------------------------------
     3. prepareCharUI override (key & finger highlighting)              
     ------------------------------------------------------------------*/
  const origPrepare = window.prepareCharUI;
  window.prepareCharUI = function () {
    if (window.currentMode === 2 && window.placeholderDisplay) {
      const groupBaseIdx = Math.floor(charIdx / REP) * REP;
      const nextKanaPh = window.lines[lineIdx]?.[groupBaseIdx];
      const disp = window.placeholderDisplay[nextKanaPh] || nextKanaPh;
      
      // Mode2のデバッグ情報を追加
      console.log('Mode2 prepareCharUI:', {
        charIdx, 
        REP, 
        groupBaseIdx,
        'charIdx % REP': charIdx % REP,
        nextKanaPh,
        disp,
        lineIdx,
        'window.lines[lineIdx]': window.lines[lineIdx]
      });
      // Mode2 ではローマ字ヒントを非表示
      const romaWrap = document.getElementById('next-roma-container');
      if (romaWrap) romaWrap.hidden = true;
      const nextC = document.getElementById('next-char');
      if (nextC) nextC.textContent = disp;

      // clear previous highlights
      document.querySelectorAll('.next-key').forEach(el => {
        el.classList.remove('next-key');
        el.style.removeProperty('--current-color');
      });
      document.querySelectorAll('.next-finger').forEach(el => {
        el.classList.remove('next-finger');
        el.style.removeProperty('--current-color');
      });

      // 残り回数表示
      const repCounter = document.getElementById('repetition-counter');
      if (repCounter){
        const remain = REP - (charIdx % REP);
        repCounter.hidden = false;
        repCounter.textContent = remain;
      }

      // romanisation
      const romaArr = placeholderRoma[nextKanaPh] || [];
      const romaStr = (romaArr[0] || '').toLowerCase();
      
      // Mode2用デバッグログ
      console.log('Mode2 prepareCharUI - nextKanaPh:', nextKanaPh, 'romaArr:', romaArr, 'romaStr:', romaStr);

      // make script.js aware of expected input (vars declared in script.js)
      window.currentRoma = romaStr;
      window.romaVariants = romaArr;
      
      // Mode2では必ず正しい値をグローバルにセットする
      // スコープ問題対策: 変数のコピーを保存
      if (window.romaVariants) {
        romaVariants = window.romaVariants.slice();
        currentRoma = window.currentRoma;
      }

      // enlarged keys under the kana
      if (typeof window.showEnlargedKeys === 'function') {
        window.showEnlargedKeys(romaStr);
      }
      const romaContainerEl = document.getElementById('roma-container');
      if (romaContainerEl) romaContainerEl.hidden = false;

      // key + finger highlight
      // Mode2では最初のキーだけを点滅させる（handleBeatがその後のキーを処理）
      const rootStyle = getComputedStyle(document.documentElement);
      if (romaStr && romaStr.length > 0) {
        // 入力シーケンスの先頭文字だけハイライト
        const ch = romaStr[0];
        const btn = document.querySelector(`.key[data-key='${ch}']`);
        const finger = getFingerForKeyMode2(ch);
        if (btn && finger) {
          let color = rootStyle.getPropertyValue(`--${finger}`).trim();
          if (!color) color = '#2196f3';
          btn.style.setProperty('--current-color', color);
          btn.classList.add('next-key');
          document.querySelectorAll(`.finger-${finger}`).forEach(span => {
            span.style.setProperty('--current-color', color);
            span.classList.add('next-finger');
          });
        }
      }
      return; // skip original prepareCharUI
    }
    if (typeof origPrepare === 'function') origPrepare();
  };

  /* ------------------------------------------------------------------
     4. finger map helper                                               
     ------------------------------------------------------------------*/
  function getFingerForKeyMode2(ch) {
    const map = {
      'q1az':'left-pinky','w2sx':'left-ring','e3dc':'left-middle','r4fv5tgb':'left-index',
      'y6hnu7jm':'right-index','i8k,':'right-middle','o9l.':'right-ring',
      'p0;:/[{}\'\"-=_+]\\':'right-pinky',' ':'thumb'
    };
    for (const keys in map) if (keys.includes(ch)) return map[keys];
    return 'left-index';
  }
})();

// Mode2用テンポボタン処理
// プレビュータイマーをグローバルに公開
window.mode2PreviewTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  const tempoSlider = document.getElementById('tempo-slider');
  const tempoValue = document.getElementById('tempo-value');
  const presetBtns = document.querySelectorAll('.tempo-preset');
  
  let audioCtx = null;
  
  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error('Web Audio API is not supported in this browser.');
    }
  }
  
  function playClick() {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(window.clickVolume !== undefined ? window.clickVolume : 0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.05);
  }
  
  // プリセットボタン処理
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      const bpmStr = btn.dataset.bpm;
      if (bpmStr === 'custom') {
        // スライダー表示
        if (tempoSlider) tempoSlider.style.display = 'block';
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playClick();
      } else {
        if (tempoSlider) tempoSlider.style.display = 'none';
        const bpm = +bpmStr;
        if (tempoSlider) tempoSlider.value = bpm;
        if (tempoValue) tempoValue.textContent = `${bpm} BPM`;
        if (typeof applyBPM === 'function') applyBPM(bpm);
        playClick();
        // preview beat
        clearInterval(window.mode2PreviewTimer);
        const interval = 60000 / bpm;
        window.mode2PreviewTimer = setInterval(playClick, interval);
      }
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // スライダー処理
  if (tempoSlider) {
    tempoSlider.addEventListener('input', () => {
      const bpm = +tempoSlider.value;
      if (tempoValue) tempoValue.textContent = `${bpm} BPM`;
      if (typeof applyBPM === 'function') applyBPM(bpm);
    });
  }
});
