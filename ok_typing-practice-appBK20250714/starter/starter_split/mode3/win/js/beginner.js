// beginner.js – メトロノーム練習機能を script.js の上に追加拡張
// 依存: script.js が先に読み込まれていること

(() => {
  /* ---------------- 設定 ---------------- */
  const DEFAULT_BPM = 60;
  const FAST_BPM = 90;
  const MIN_BPM = 40;
  const MAX_BPM = 160;

  /* ---------------- 変数 ---------------- */
  let inCountdown = false;
  let metronomeTimer = null;
  let bpm = DEFAULT_BPM;
  let awaitingInput = false; // ビートとビートの間で入力待ちかどうか
  let beatWaiting = false;   // ビート音が鳴ってからの入力待ち
  let totalBeats = 0;

  /* ---------------- DOM ---------------- */
  const controlButtons = document.getElementById('control-buttons');
  const modeButtons = document.createElement('div');
  modeButtons.id = 'mode-buttons';
  modeButtons.innerHTML = `
    <button id="mode1-btn">Mode 1</button>
    <button id="mode2-btn">Mode 2</button>
    <button id="mode3-btn">Mode 3</button>
    <div id="tempo-control">
      <input type="range" id="tempo-slider" min="${MIN_BPM}" max="${MAX_BPM}" value="${DEFAULT_BPM}">
      <span id="tempo-value">${DEFAULT_BPM} BPM</span>
    </div>
    <div id="volume-control" style="display:flex;align-items:center;margin-top:4px;gap:4px;">
      <label for="volume-slider" style="font-size:12px;">VOL</label>
      <input type="range" id="volume-slider" min="0" max="800" value="300" style="flex:1;">
    </div>
  `;
  document.body.appendChild(modeButtons);

  const mode1Btn = document.getElementById('mode1-btn');
  const mode2Btn = document.getElementById('mode2-btn');
  const mode3Btn = document.getElementById('mode3-btn');
  const nextC = document.getElementById('next-char');
  const nextRomaContainer = document.getElementById('next-roma-container');
  nextRoma = document.getElementById('next-roma'); // グローバルスコープで定義
  const tempoSlider = document.getElementById('tempo-slider');
  const tempoValue  = document.getElementById('tempo-value');
  const tempoControl = document.getElementById('tempo-control');
  const volumeSlider = document.getElementById('volume-slider');

  // ボリュームスライダー初期化
  if (volumeSlider) {
    // 初期値をwindow.clickVolumeから反映（未設定なら0.05）
    volumeSlider.value = (window.clickVolume !== undefined ? window.clickVolume : 0.375) * 800;
    // スライダー操作でwindow.clickVolumeを書き換え
    volumeSlider.oninput = () => {
      window.clickVolume = +volumeSlider.value / 800;
    };
  }

  /* ---------------- 音源 ---------------- */
  let audioCtx = null;
  
  // AudioContextの初期化とクリック音の再生
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // ブラウザの自動再生ポリシーで一時停止された場合に復帰させる
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }
  
  function playClick(){
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 440; // 440Hz
    gain.gain.value = window.clickVolume || 0.05; // script.js と統一
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1); // 100ms
  }

  /* ---------------- モード設定 ---------------- */
  function setActive(btn){
    [mode1Btn,mode2Btn,mode3Btn].forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }
  function selectMode(mode){
    // 音声コンテキストを初期化
    initAudio();
    
    switch(mode){
      case 1:
        bpm = DEFAULT_BPM;
        tempoControl.style.display='none';
        setActive(mode1Btn);
        // Mode1 では script.js が独自のビート制御を行うため beginner.js のタイマーを停止
        if (metronomeTimer) { clearInterval(metronomeTimer); metronomeTimer = null; }
        break;
      case 2: bpm = FAST_BPM;    tempoControl.style.display='none'; setActive(mode2Btn); break;
      case 3: bpm = +tempoSlider.value; tempoControl.style.display='flex'; setActive(mode3Btn); break;
    }
    // ゲーム中（startボタンが無効＝プレイ中）のみテンポを即時反映
    if(start.disabled) restartMetronome();
  }

  mode1Btn.onclick = ()=> selectMode(1);
  mode2Btn.onclick = ()=> selectMode(2);
  mode3Btn.onclick = ()=> selectMode(3);

  /* テンポスライダー */
  tempoSlider.oninput = () => {
    tempoValue.textContent = `${tempoSlider.value} BPM`;
    if(mode3Btn.classList.contains('active')){
      bpm = +tempoSlider.value;
      // ゲーム中のみ反映
      if(start.disabled) restartMetronome();
    }
  };

  /* ---------------- メトロノーム制御 ---------------- */
  function restartMetronome(){
    if(metronomeTimer) clearInterval(metronomeTimer);
    // Mode1（練習モード）は script.js に任せる
    if(mode1Btn.classList.contains('active')) return;
    const intervalMs = 60000 / bpm;
    metronomeTimer = setInterval(handleBeat, intervalMs);
  }

  // 文字のローマ字をビートごとに分解するためのキュー
  let romaQueue = [];

  // 次の文字を準備し、ローマ字キューを生成
  function prepareNextChar() {
    // ローマ字キューをクリア
    romaQueue = [];
    
    // 次のヒラガナを取得
    const nextKana = lines[lineIdx][charIdx];
    if (nextKana) {
      // 対応するローマ字バリエーションを取得
      romaVariants = kana2roma[nextKana];
      currentRoma = romaVariants[0];
      
      // 最初のローマ字を一文字ずつキューに追加
      for (let i = 0; i < currentRoma.length; i++) {
        romaQueue.push(currentRoma[i]);
      }
      
      // ヒラガナを表示
      nextC.textContent = nextKana;
    }
    
    // 最初のキューをナビゲーション表示
    showRomaChar();
  }
  
  // ローマ字の次の1文字をナビゲーション表示
  function showRomaChar() {
    if (romaQueue.length > 0) {
      const nextChar = romaQueue[0];
      
      // ローマ字表示を更新
      nextRomaContainer.hidden = false;
      nextRoma.textContent = nextChar;
      
      // キーボードナビゲーションを表示
      const upperChar = nextChar.toUpperCase();
      const keys = document.querySelectorAll('.key');
      
      // すべてのキーからpulseクラスを削除
      keys.forEach(key => {
        key.classList.remove('pulse');
        key.classList.remove('pulse-left-pinky');
        key.classList.remove('pulse-left-ring');
        key.classList.remove('pulse-left-middle');
        key.classList.remove('pulse-left-index');
        key.classList.remove('pulse-right-index');
        key.classList.remove('pulse-right-middle');
        key.classList.remove('pulse-right-ring');
        key.classList.remove('pulse-right-pinky');
        key.classList.remove('pulse-thumb');
      });
      
      // 次に打つキーに運指に合わせたpulseクラスを追加
      keys.forEach(key => {
        if (key.textContent === upperChar) {
          // 運指に応じたpulseクラスを追加
          const fingerClass = getFingerClass(upperChar);
          key.classList.add(fingerClass);
        }
      });
    }
  }
  
  // 文字に対応する運指クラスを取得
  function getFingerClass(char) {
    // かな配列キーボードの場合の指割り当て
    const leftPinky = ['1', 'Q'];
    const leftRing = ['2', 'W'];
    const leftMiddle = ['3', 'E'];
    const leftIndex = ['4', '5', 'R', 'T', 'D', 'F', 'G', 'C', 'V', 'B'];
    const rightIndex = ['6', '7', 'Y', 'U', 'H', 'J', 'N', 'M'];
    const rightMiddle = ['8', 'I', 'K'];
    const rightRing = ['9', 'O', 'L'];
    const rightPinky = ['0', 'P', '-', '=', '\\', '@', '[', ']', ';', ':', '.', ','];
    const thumb = [' '];
    
    if (leftPinky.includes(char)) return 'pulse-left-pinky';
    if (leftRing.includes(char)) return 'pulse-left-ring';
    if (leftMiddle.includes(char)) return 'pulse-left-middle';
    if (leftIndex.includes(char)) return 'pulse-left-index';
    if (rightIndex.includes(char)) return 'pulse-right-index';
    if (rightMiddle.includes(char)) return 'pulse-right-middle';
    if (rightRing.includes(char)) return 'pulse-right-ring';
    if (rightPinky.includes(char)) return 'pulse-right-pinky';
    if (thumb.includes(char)) return 'pulse-thumb';
    
    // デフォルトの場合は通常のpulse
    return 'pulse';
  }

  function handleBeat(){
    // playClick は script.js 側で鳴らすためここでは鳴らさない

    if(awaitingInput){
      errors++;
      if (romaQueue.length > 1) {
        romaQueue.shift();
        showRomaChar();
      } else {
        advanceToNextChar();
        prepareNextChar();
      }
    }

    awaitingInput = true;
    beatWaiting = true; // 新しいビートが始まったのでビート待ちを有効に

    if(start.disabled && !inCountdown){
      totalBeats++;
    }
  }

  /* ---------------- start / reset 拡張 ---------------- */
  const origStartGame = window.startGame;
  window.startGame = function(){
    origStartGame();
    awaitingInput = false;
    totalBeats = 0;

    // カウントダウン開始
    inCountdown = true;
    let count = 5; // 5 から 1 までカウントし、その後スタート

    // ディスプレイが表示されていることを確認
    const mainDisplay = document.getElementById('main-display-wrapper');
    mainDisplay.style.display = 'block';

    // 表示をクリアして準備
    if (nextRomaContainer) nextRomaContainer.hidden = false;
    nextRoma.textContent = 'カウントダウン中';

    // 音声を初期化
    initAudio();

    const beatMs = 60000 / bpm;

    // 画面表示とクリック音を完全同期させる再帰関数
    function countdownStep() {
      // 数字または "スタート" を表示
      nextC.textContent = count > 0 ? count.toString() : 'スタート';
      nextC.style.fontSize = '72px';
      nextC.style.fontWeight = 'bold';
      nextC.style.whiteSpace = 'nowrap';

      // クリック音再生
      playClick();

      if (count === 0) {
        // スタートの次のビートからゲーム開始
        setTimeout(() => {
          inCountdown = false;
          // 表示をリセット
          nextC.style.fontSize = '';
          nextC.style.fontWeight = '';
          nextC.style.whiteSpace = '';
          nextRoma.textContent = '';

          // 初回の文字を準備
          lineIdx = 0;
          charIdx = 0;
          advanceToNextChar();
          prepareNextChar();
          restartMetronome();
          awaitingInput = true;
        }, beatMs);
        return;
      }

      // 次のステップをスケジュール
      count--;
      setTimeout(countdownStep, beatMs);
    }

    // カウントダウン処理開始
    countdownStep();
  };
  const origResetGame = window.resetGame;
  window.resetGame = function(){
    origResetGame();
    clearInterval(metronomeTimer);
    awaitingInput = false;
  };

  /* ---------------- キー入力フック ---------------- */
  const origHandleKeyPress = window.handleKeyPress;
  window.handleKeyPress = function(e){
    if (inCountdown) return;

    const typedKey = e.key.toLowerCase();
    const expectedKey = romaQueue.length > 0 ? romaQueue[0].toLowerCase() : '';

    if (typedKey === expectedKey) {
      awaitingInput = false;
      beatWaiting = false;
    }

    const beforeCharIdx = charIdx;
    origHandleKeyPress(e);
    const afterCharIdx = charIdx;

    if (beforeCharIdx !== afterCharIdx) {
      prepareNextChar();
    } else if (typedKey === expectedKey) {
      if (romaQueue.length > 0) {
        romaQueue.shift();
      }
      showRomaChar();
    }
  };

  /* ---------------- 初期化 ---------------- */
  // デフォルトで Mode1 を選択
  selectMode(1);
})();
