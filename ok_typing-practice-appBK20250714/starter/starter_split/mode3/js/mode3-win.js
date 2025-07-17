// mode3-win.js – Windows 半角 / かな / カナ 切替レッスン（たたき台）
// 必要最小限のロジックのみ。細部実装は順次追加していく。

(() => {
  'use strict';
  if (window.mode3WinInit) return; // 多重ロード防止
  window.mode3WinInit = true;

  /* --------------------------------------------------
     1. カリキュラム（windsurfConfigから取得）
     --------------------------------------------------*/
  // windsurfConfig が存在すれば使用、なければデフォルト値
  let curriculum = [
    'Backquote',   // 半角/全角キー
    'KanaMode',  // かなキー
    'Digit2',    // 数字キー 2
    'KeyA',      // A
    'KeyB',      // B
  ];
  
  // ユーザーに見せるラベル変換
  const codeLabelMap = {
    Backquote: '半/全',
    KanaMode: 'かな',
    NonConvert: '無変換',
    Convert: '変換',
    F7: 'F7',
    Enter: 'Enter',
    'Shift+1': '!',
    'Shift+9': '(',
    'Shift+0': ')',
    Digit0: '0', Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4',
    Digit5: '5', Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9',
    KeyA: 'A', KeyB: 'B', KeyC: 'C', KeyD: 'D', KeyE: 'E',
    KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyI: 'I', KeyJ: 'J',
    KeyK: 'K', KeyL: 'L', KeyM: 'M', KeyN: 'N', KeyO: 'O',
    KeyP: 'P', KeyQ: 'Q', KeyR: 'R', KeyS: 'S', KeyT: 'T',
    KeyU: 'U', KeyV: 'V', KeyW: 'W', KeyX: 'X', KeyY: 'Y', KeyZ: 'Z',
    Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']',
    Semicolon: ';', Quote: "'", Backslash: '\\', Comma: ',', Period: '.',
    Slash: '/', Space: ' ', IntlYen: '¥', IntlRo: '\\'
  };
  
  // windsurfConfigからカリキュラムを取得
  if (window.windsurfConfig && window.windsurfConfig.lessons) {
    // 最初のレッスンを使用（今日の日付）
    const lessonLabels = window.windsurfConfig.lessons[0];
    
    // ラベルをKeyboardEvent.codeに変換
    curriculum = lessonLabels.map(label => {
      // ラベルからコードを逆引き
      for (const [code, lbl] of Object.entries(codeLabelMap)) {
        if (lbl === label) return code;
      }
      return label; // 見つからない場合はそのまま使用
    });
  }

  // legacy Mode1 variables stub to avoid ReferenceError
  window.lines = window.lines || [''];

   let step = 0;

  // -------- Mode1 カリキュラム無効化用に関数を上書き --------
  window.startCountdown = () => {
    step = 0;
    renderLesson();
    nextStep();
  };
  window.resetGame = () => {
    step = 0;
    clearHighlights();
    clearTyped();
    updateMessage('Start を押してレッスンを始めましょう');
  };

  const $ = s => document.querySelector(s);
  const messageEl = $('#practice-text');
  const typedDisplay = document.getElementById('typed-display');
  const lessonDisplay = document.getElementById('lesson-display');

  /* --------------------------------------------------
     2. UI 補助関数
     --------------------------------------------------*/
  function clearHighlights() {
    document.querySelectorAll('.key').forEach(k => {
      k.classList.remove('next-key');
      k.style.removeProperty('--current-color');
    });
    document.querySelectorAll('.next-finger').forEach(el => {
      el.classList.remove('next-finger');
      el.style.removeProperty('--current-color');
    });
  }

  function renderLesson(){
    if(!lessonDisplay) return;
    lessonDisplay.innerHTML='';
    curriculum.forEach(code=>{
      const span=document.createElement('span');
      span.className='box';
      span.textContent = codeLabelMap[code] || code;
      lessonDisplay.appendChild(span);
    });
  }

  function updateLessonHighlight(){
    if(!lessonDisplay) return;
    [...lessonDisplay.children].forEach((el,idx)=>{
      el.classList.toggle('current', idx===step);
      el.classList.toggle('done', idx<step);
    });
  }

  function clearTyped(){
    if(typedDisplay) typedDisplay.innerHTML='';
  }

  function highlightKey(code) {
    clearHighlights();
    const btn = document.querySelector(`.key[data-code='${code}']`);
    if (!btn) return;
    btn.classList.add('next-key');

    // 運指色のセット（script.js の fingerMap を再利用）
    const ch = (btn.dataset.key || '').toLowerCase();
    if (typeof getFingerForKey === 'function') {
      const finger = getFingerForKey(ch);
      if (finger) {
        const rootStyle = getComputedStyle(document.documentElement);
        let color = rootStyle.getPropertyValue(`--${finger}`).trim();
        if (!color) color = '#2196f3';
        btn.style.setProperty('--current-color', color);
        document.querySelectorAll(`.finger-${finger}`).forEach(span => {
          span.classList.add('next-finger');
          span.style.setProperty('--current-color', color);
        });
      }
    }
  }

  const SKIP_CHARS = [
    'backspace','delete','bs','tab','space','\u2423',
    'ctrl','control','alt','shift','win','meta','app','caps','capslock','fn'
  ]; // 表示しないキーラベル (小文字変換で比較)
  function appendTyped(char, isCorrect) {
    // これらのキーは黒帯に表示しない
    if (SKIP_CHARS.includes(char.toLowerCase())) return;
    if (!typedDisplay) return;
    
    // 初回入力時はインフォメーションをクリア
    if (typedDisplay.querySelector('.info-message')) {
      typedDisplay.innerHTML = '';
    }
    
    const span = document.createElement('span');
    span.className = isCorrect ? 'typed-correct' : 'typed-incorrect';
    span.textContent = char;
    typedDisplay.appendChild(span);
  }

  function updateMessage(msg) {
    if (messageEl) messageEl.textContent = msg;
  }

  /* --------------------------------------------------
     3. レッスン制御
     --------------------------------------------------*/
  function nextStep() {
    if (step >= curriculum.length) {
      updateMessage('お疲れさまでした！レッスン終了です。');
      clearHighlights();
      return;
    }
    const code = curriculum[step];
    highlightKey(code);
    updateLessonHighlight();
    const label = codeLabelMap[code] || code;
    updateMessage(`${label} を押してください`);
  }

  function handleKey(e) {
    const expected = curriculum[step];
    if (!expected) return;
    
    // 特殊キーの処理 (Shift+1 など)
    if (expected.startsWith('Shift+')) {
      const keyCode = expected.split('+')[1];
      if (e.shiftKey && e.code === `Digit${keyCode}`) {
        const label = codeLabelMap[expected] || expected;
        appendTyped(label, true);
        step++;
        nextStep();
        return;
      }
    }
    
    // 通常キーの処理
    if (e.code === expected) {
      const btnExp=document.querySelector(`.key[data-code='${expected}']`);
      if(btnExp) {
        let label = btnExp.textContent.trim();
        if (expected === 'Space') label = ' ';
        appendTyped(label, true);
      } else {
        // ボタンが見つからない場合はラベルマップから
        const label = codeLabelMap[expected] || expected;
        appendTyped(label, true);
      }
      step++;
      nextStep();
    } else {
      // ミス: 赤フラッシュのみ簡易実装
      const btn = document.querySelector(`.key[data-code='${e.code}']`);
      if (btn) {
        appendTyped(btn.textContent.trim(), false);
        btn.classList.add('mistype');
        setTimeout(() => btn.classList.remove('mistype'), 500);
      }
    }
  }

  /* --------------------------------------------------
     4. レッスンセレクター UI
     --------------------------------------------------*/
  function createLessonSelector() {
    if (!window.windsurfConfig || !window.windsurfConfig.lessons) return;
    
    // 既存のセレクターを削除
    const existingSelector = document.getElementById('lesson-selector');
    if (existingSelector) existingSelector.remove();
    
    // セレクターコンテナ作成
    const selectorContainer = document.createElement('div');
    selectorContainer.id = 'lesson-selector';
    selectorContainer.style.margin = '20px auto';
    selectorContainer.style.maxWidth = '600px';
    selectorContainer.style.textAlign = 'center';
    
    // タイトル作成
    const title = document.createElement('h3');
    title.textContent = 'レッスンを選択してください';
    selectorContainer.appendChild(title);
    
    // ボタングループ作成
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.flexWrap = 'wrap';
    buttonGroup.style.justifyContent = 'center';
    buttonGroup.style.gap = '10px';
    buttonGroup.style.margin = '10px 0';
    
    // レッスンボタン作成
    const lessons = window.windsurfConfig.lessons;
    lessons.forEach((lesson, index) => {
      const button = document.createElement('button');
      button.className = 'lesson-btn';
      button.style.padding = '8px 15px';
      button.style.border = '1px solid #ccc';
      button.style.borderRadius = '4px';
      button.style.backgroundColor = index === 0 ? '#007bff' : '#f8f9fa';
      button.style.color = index === 0 ? 'white' : 'black';
      button.style.cursor = 'pointer';
      
      // レッスンタイトル設定
      let title;
      if (index === 0) {
        title = '① 今日の日付';
      } else {
        title = `${index + 1} ${getShortLessonTitle(lesson)}`;
      }
      button.textContent = title;
      
      // クリックイベント
      button.addEventListener('click', () => {
        // ボタンのスタイルをリセット
        document.querySelectorAll('.lesson-btn').forEach(btn => {
          btn.style.backgroundColor = '#f8f9fa';
          btn.style.color = 'black';
        });
        
        // 選択されたボタンをハイライト
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        
        // カリキュラム更新
        const lessonLabels = lessons[index];
        curriculum = lessonLabels.map(label => {
          for (const [code, lbl] of Object.entries(codeLabelMap)) {
            if (lbl === label) return code;
          }
          return label;
        });
        
        // レッスンリセット
        step = 0;
        clearHighlights();
        clearTyped();
        renderLesson();
        updateMessage('Start を押してレッスンを始めましょう');
      });
      
      buttonGroup.appendChild(button);
    });
    
    selectorContainer.appendChild(buttonGroup);
    
    // セレクターをページに挿入
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.parentNode.insertBefore(selectorContainer, welcomeMessage.nextSibling);
        } else {
      const container = document.querySelector('.container');
      if (container) {
        const h1 = container.querySelector('h1');
        if (h1 && h1.nextSibling) {
          container.insertBefore(selectorContainer, h1.nextSibling);
        } else {
          container.appendChild(selectorContainer);
        }
      }
    }
  }
  
  // レッスンの短いタイトルを生成
  function getShortLessonTitle(lesson) {
    if (!lesson || lesson.length === 0) return '不明';
    
    const firstFewKeys = lesson.slice(0, 3);
    const lastKey = lesson[lesson.length - 1];
    
    if (lesson.includes('年') && lesson.includes('月') && lesson.includes('日')) {
      return '年月日';
    } else if (lesson.includes('@')) {
      return 'メールアドレス';
    } else if (lesson.includes('http')) {
      return 'URL';
    } else if (lesson.includes('-') && lesson.length < 15) {
      return '電話番号';
    } else if (lesson.includes('ゆ') && lesson.includes('び')) {
      return '郵便番号';
    } else if (lesson.includes('F7')) {
      return 'カタカナ語';
    } else if (lesson.includes('C:')) {
      return 'パス';
    } else if (lesson.includes('^')) {
      return '顔文字';
    } else {
      return `${firstFewKeys.join('')}...${lastKey}`;
    }
  }

  /* --------------------------------------------------
     5. スタート & イベント登録
     --------------------------------------------------*/
  let startBtn = $('#start-btn');
  // remove any existing event listeners added by legacy script by cloning
  if(startBtn){
    const cleanBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(cleanBtn,startBtn);
    startBtn = cleanBtn;
  }
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      step = 0;
      clearHighlights();
      clearTyped();
      renderLesson();
      nextStep();
    });
  }
  
  // レッスンセレクターを作成
  createLessonSelector();

  document.addEventListener('keydown', function(event) {
    // Check if the event has already been handled by lesson1.html
    const isHandled = event.lesson1Handled || false;
    
    // Listen for our custom event to mark this event as handled
    event.target.addEventListener('lesson1-keydown-handled', function() {
      event.lesson1Handled = true;
    }, { once: true });
    
    // Wait a tiny bit to see if our custom event fires
    setTimeout(function() {
      if (!event.lesson1Handled) {
        // Only handle the key if it wasn't already handled by lesson1.html
        handleKey(event);
      }
    }, 0);
  });
})();
