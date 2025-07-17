// problem-engine.js - Mode3独立の高度な日本語入力学習システム
// 半角/全角、ひらがな、カタカナ切り替えを含む総合的な学習エンジン

(() => {
  'use strict';
  if (window.mode3ProblemEngine) return; // 多重ロード防止
  window.mode3ProblemEngine = true;

  /* --------------------------------------------------
     1. 学習カリキュラム定義
     --------------------------------------------------*/
  const learningCurriculum = [
    {
      id: 'basic-switch',
      title: '基本切り替え操作',
      description: '半角/全角キーとかなキーの基本操作を学びましょう',
      problems: [
        {
          instruction: '半角/全角キーを押して入力モードを切り替えてください',
          expectedKeys: ['Backquote'],
          displayKeys: ['半/全'],
          inputMode: 'direct'
        },
        {
          instruction: 'かなキーを押してひらがな入力モードにしてください', 
          expectedKeys: ['KanaMode'],
          displayKeys: ['かな'],
          inputMode: 'direct'
        },
        {
          instruction: '再び半角/全角キーで半角モードに戻してください',
          expectedKeys: ['Backquote'],
          displayKeys: ['半/全'],
          inputMode: 'direct'
        }
      ]
    },
    {
      id: 'hiragana-basic',
      title: 'ひらがな基本入力',
      description: 'ひらがなモードでの基本的な文字入力',
      problems: [
        {
          instruction: '「あ」を入力してください（aキーを押す）',
          expectedKeys: ['KeyA'],
          displayKeys: ['a'],
          inputMode: 'hiragana',
          expectedResult: 'あ'
        },
        {
          instruction: '「か」を入力してください（k+aキーを押す）',
          expectedKeys: ['KeyK', 'KeyA'],
          displayKeys: ['k', 'a'],
          inputMode: 'hiragana',
          expectedResult: 'か'
        },
        {
          instruction: '「さ」を入力してください（s+aキーを押す）',
          expectedKeys: ['KeyS', 'KeyA'],
          displayKeys: ['s', 'a'],
          inputMode: 'hiragana',
          expectedResult: 'さ'
        },
        {
          instruction: '「た」を入力してください（t+aキーを押す）',
          expectedKeys: ['KeyT', 'KeyA'],
          displayKeys: ['t', 'a'],
          inputMode: 'hiragana',
          expectedResult: 'た'
        }
      ]
    },
    {
      id: 'hiragana-combination',
      title: 'ひらがな組み合わせ',
      description: 'より複雑なひらがなの組み合わせを練習',
      problems: [
        {
          instruction: '「き」を入力してください（k+iキーを押す）',
          expectedKeys: ['KeyK', 'KeyI'],
          displayKeys: ['k', 'i'],
          inputMode: 'hiragana',
          expectedResult: 'き'
        },
        {
          instruction: '「し」を入力してください（s+iキーを押す）',
          expectedKeys: ['KeyS', 'KeyI'],
          displayKeys: ['s', 'i'],
          inputMode: 'hiragana',
          expectedResult: 'し'
        },
        {
          instruction: '「ち」を入力してください（t+iキーを押す）',
          expectedKeys: ['KeyT', 'KeyI'],
          displayKeys: ['t', 'i'],
          inputMode: 'hiragana',
          expectedResult: 'ち'
        },
        {
          instruction: '「ん」を入力してください（n+nキーを押す）',
          expectedKeys: ['KeyN', 'KeyN'],
          displayKeys: ['n', 'n'],
          inputMode: 'hiragana',
          expectedResult: 'ん'
        }
      ]
    },
    {
      id: 'katakana-conversion',
      title: 'カタカナ変換技術',
      description: 'F7キーを使ったカタカナ変換の練習',
      problems: [
        {
          instruction: '「あ」と入力してF7でカタカナに変換してください',
          expectedKeys: ['KeyA', 'F7'],
          displayKeys: ['a', 'F7'],
          inputMode: 'hiragana',
          expectedResult: 'ア'
        },
        {
          instruction: '「か」と入力してF7でカタカナに変換してください',
          expectedKeys: ['KeyK', 'KeyA', 'F7'],
          displayKeys: ['k', 'a', 'F7'],
          inputMode: 'hiragana',
          expectedResult: 'カ'
        },
        {
          instruction: '「さ」と入力してF7でカタカナに変換してください',
          expectedKeys: ['KeyS', 'KeyA', 'F7'],
          displayKeys: ['s', 'a', 'F7'],
          inputMode: 'hiragana',
          expectedResult: 'サ'
        }
      ]
    },
    {
      id: 'function-keys-advanced',
      title: '高度なファンクションキー活用',
      description: 'F8(半角カタカナ)、F10(半角英数)の実践的な使い方',
      problems: [
        {
          instruction: '「あ」と入力してF8で半角カタカナに変換してください',
          expectedKeys: ['KeyA', 'F8'],
          displayKeys: ['a', 'F8'],
          inputMode: 'hiragana',
          expectedResult: 'ｱ'
        },
        {
          instruction: '「か」と入力してF8で半角カタカナに変換してください',
          expectedKeys: ['KeyK', 'KeyA', 'F8'],
          displayKeys: ['k', 'a', 'F8'],
          inputMode: 'hiragana',
          expectedResult: 'ｶ'
        },
        {
          instruction: '「あ」と入力してF10で半角英数に変換してください',
          expectedKeys: ['KeyA', 'F10'],
          displayKeys: ['a', 'F10'],
          inputMode: 'hiragana',
          expectedResult: 'a'
        },
        {
          instruction: '「か」と入力してF10で半角英数に変換してください',
          expectedKeys: ['KeyK', 'KeyA', 'F10'],
          displayKeys: ['k', 'a', 'F10'],
          inputMode: 'hiragana',
          expectedResult: 'ka'
        }
      ]
    },
    {
      id: 'practical-application',
      title: '実践的な文字入力',
      description: '日常的な文字入力シナリオの練習',
      problems: [
        {
          instruction: '「こんにちは」と入力してください',
          expectedKeys: ['KeyK', 'KeyO', 'KeyN', 'KeyN', 'KeyI', 'KeyT', 'KeyI', 'KeyH', 'KeyA'],
          displayKeys: ['k', 'o', 'n', 'n', 'i', 't', 'i', 'h', 'a'],
          inputMode: 'hiragana',
          expectedResult: 'こんにちは'
        },
        {
          instruction: '「ありがとう」と入力してください',
          expectedKeys: ['KeyA', 'KeyR', 'KeyI', 'KeyG', 'KeyA', 'KeyT', 'KeyO', 'KeyU'],
          displayKeys: ['a', 'r', 'i', 'g', 'a', 't', 'o', 'u'],
          inputMode: 'hiragana',
          expectedResult: 'ありがとう'
        },
        {
          instruction: '「こんにちは」をカタカナで入力してください（F7使用）',
          expectedKeys: ['KeyK', 'KeyO', 'KeyN', 'KeyN', 'KeyI', 'KeyT', 'KeyI', 'KeyH', 'KeyA', 'F7'],
          displayKeys: ['k', 'o', 'n', 'n', 'i', 't', 'i', 'h', 'a', 'F7'],
          inputMode: 'hiragana',
          expectedResult: 'コンニチハ'
        }
      ]
    }
  ];

  /* --------------------------------------------------
     2. 状態管理
     --------------------------------------------------*/
  let currentCurriculum = 0;
  let currentProblem = 0;
  let currentKeyIndex = 0;
  let userInputSequence = [];
  let isActive = false;
  let inputBuffer = '';

  /* --------------------------------------------------
     3. UI要素の参照
     --------------------------------------------------*/
  const elements = {
    lessonDisplay: document.getElementById('lesson-display'),
    practiceText: document.getElementById('practice-text'),
    typedDisplay: document.getElementById('typed-display'),
    inputField: document.getElementById('input-field'),
    keyboard: document.getElementById('keyboard'),
    retryMessage: document.getElementById('retry-message')
  };

  /* --------------------------------------------------
     4. キー表示用のアイコン/画像マップ
     --------------------------------------------------*/
  const keyIconMap = {
    'Backquote': { type: 'image', src: 'images/hanzen.png', alt: '半/全' }, // 半/全キーのアイコン
    'F7': '🔤', // カタカナ変換
    'F8': '🔡', // 半角カタカナ
    'F10': '🔠', // 半角英数
    'KanaMode': 'あ', // かな
    'Convert': '変換',
    'NonConvert': '無変換',
    'Enter': '⏎', // Enterキー
    'Space': '␣', // スペース
    'Shift': '⇧', // Shift
    'Ctrl': 'Ctrl',
    'Alt': 'Alt'
  };

  /* --------------------------------------------------
     5. 問題表示機能
     --------------------------------------------------*/
  function displayCurrentProblem() {
    const curriculum = learningCurriculum[currentCurriculum];
    const problem = curriculum.problems[currentProblem];
    
    if (!problem) return;

    // 特別なキーの判定関数
    const isSpecialKey = (keyCode) => {
      return ['Backquote', 'F7', 'F8', 'F10', 'KanaMode', 'Convert', 'NonConvert'].includes(keyCode);
    };
    
    // 指示文を表示
    elements.practiceText.innerHTML = `
      <div class="problem-instruction">${problem.instruction}</div>
      <div class="key-sequence">
        ${problem.displayKeys.map((key, index) => {
          const keyCode = problem.expectedKeys[index];
          const isSpecial = isSpecialKey(keyCode);
          const iconData = keyIconMap[keyCode];
          
          let displayContent;
          if (iconData && iconData.type === 'image') {
            console.log('Loading image:', iconData.src); // デバッグ用
            displayContent = `<img src="${iconData.src}" alt="${iconData.alt}" class="key-icon" onerror="console.error('Image failed to load:', this.src)" onload="console.log('Image loaded successfully:', this.src)" />`;
          } else {
            displayContent = iconData || key;
          }
          
          return `
            <span class="key-display ${index === currentKeyIndex ? 'current' : ''} ${index < currentKeyIndex ? 'completed' : ''} ${isSpecial ? 'special-key' : ''}">
              ${displayContent}
            </span>
          `;
        }).join('')}
      </div>
    `;

    // 現在のキーをハイライト
    if (currentKeyIndex < problem.expectedKeys.length) {
      highlightKey(problem.expectedKeys[currentKeyIndex]);
    }
  }

  /* --------------------------------------------------
     6. 入力判定とフィードバック
     --------------------------------------------------*/
  function checkInput(keyCode) {
    const curriculum = learningCurriculum[currentCurriculum];
    const problem = curriculum.problems[currentProblem];
    
    if (!problem || currentKeyIndex >= problem.expectedKeys.length) return;

    const expectedKey = problem.expectedKeys[currentKeyIndex];
    const isCorrect = keyCode === expectedKey;

    // 黒帯に入力内容を表示（メモ帳風）
    appendToTypedDisplay(keyCode, isCorrect);

    // 正誤判定の視覚フィードバック
    showInputFeedback(isCorrect, currentKeyIndex);

    if (isCorrect) {
      currentKeyIndex++;
      userInputSequence.push(keyCode);

      // 問題完了チェック
      if (currentKeyIndex >= problem.expectedKeys.length) {
        setTimeout(() => {
          nextProblem();
        }, 1000);
      } else {
        // 次のキーをハイライト
        highlightKey(problem.expectedKeys[currentKeyIndex]);
      }
    } else {
      // 間違いの場合、リトライメッセージ表示
      elements.retryMessage.hidden = false;
      setTimeout(() => {
        elements.retryMessage.hidden = true;
      }, 2000);
    }

    // キー表示を更新
    updateKeySequenceDisplay();
  }

  /* --------------------------------------------------
     7. 黒帯表示（メモ帳風）
     --------------------------------------------------*/
  function appendToTypedDisplay(keyCode, isCorrect) {
    const keyLabel = getKeyLabel(keyCode);
    const span = document.createElement('span');
    span.textContent = keyLabel;
    
    // 基本の正誤クラス
    span.className = isCorrect ? 'correct-input' : 'incorrect-input';
    
    // 特別なキーの場合は追加のクラスを付与
    const isSpecial = ['Backquote', 'F7', 'F8', 'F10', 'KanaMode', 'Convert', 'NonConvert'].includes(keyCode);
    if (isSpecial) {
      span.classList.add('special-key-typed');
    }
    
    elements.typedDisplay.appendChild(span);
  }

  function getKeyLabel(keyCode) {
    // アイコンマップからチェック
    const iconData = keyIconMap[keyCode];
    if (iconData && iconData.type === 'image') {
      return iconData.alt; // 黒帯ではテキストで表示
    }
    
    const labelMap = {
      'Backquote': '半/全',
      'KanaMode': 'かな',
      'F7': 'F7',
      'F8': 'F8',
      'F10': 'F10',
      'KeyA': 'a', 'KeyB': 'b', 'KeyC': 'c', 'KeyD': 'd', 'KeyE': 'e',
      'KeyF': 'f', 'KeyG': 'g', 'KeyH': 'h', 'KeyI': 'i', 'KeyJ': 'j',
      'KeyK': 'k', 'KeyL': 'l', 'KeyM': 'm', 'KeyN': 'n', 'KeyO': 'o',
      'KeyP': 'p', 'KeyQ': 'q', 'KeyR': 'r', 'KeyS': 's', 'KeyT': 't',
      'KeyU': 'u', 'KeyV': 'v', 'KeyW': 'w', 'KeyX': 'x', 'KeyY': 'y', 'KeyZ': 'z',
      'Digit0': '0', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4',
      'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9',
      'Space': 'スペース',
      'Enter': 'Enter',
      'Shift': 'Shift',
      'Convert': '変換',
      'NonConvert': '無変換'
    };
    return labelMap[keyCode] || keyCode;
  }

  /* --------------------------------------------------
     8. 正誤判定の視覚フィードバック（レイヤー方式）
     --------------------------------------------------*/
  function showInputFeedback(isCorrect, keyIndex) {
    const keyDisplays = document.querySelectorAll('.key-display');
    if (keyDisplays[keyIndex]) {
      const feedback = document.createElement('div');
      feedback.className = `feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.textContent = isCorrect ? '○' : '×';
      
      keyDisplays[keyIndex].style.position = 'relative';
      keyDisplays[keyIndex].appendChild(feedback);
      
      setTimeout(() => {
        feedback.remove();
      }, 1500);
    }
  }

  /* --------------------------------------------------
     9. キーシーケンス表示の更新
     --------------------------------------------------*/
  function updateKeySequenceDisplay() {
    const curriculum = learningCurriculum[currentCurriculum];
    const problem = curriculum.problems[currentProblem];
    
    if (!problem) return;

    const keyDisplays = document.querySelectorAll('.key-display');
    keyDisplays.forEach((display, index) => {
      display.className = 'key-display';
      if (index < currentKeyIndex) {
        display.classList.add('completed');
      } else if (index === currentKeyIndex) {
        display.classList.add('current');
      }
    });
  }

  /* --------------------------------------------------
     10. キーボードハイライト
     --------------------------------------------------*/
  
  // キーコードから文字へのマッピング
  const keyCodeToChar = {
    'KeyA': 'a', 'KeyB': 'b', 'KeyC': 'c', 'KeyD': 'd', 'KeyE': 'e',
    'KeyF': 'f', 'KeyG': 'g', 'KeyH': 'h', 'KeyI': 'i', 'KeyJ': 'j',
    'KeyK': 'k', 'KeyL': 'l', 'KeyM': 'm', 'KeyN': 'n', 'KeyO': 'o',
    'KeyP': 'p', 'KeyQ': 'q', 'KeyR': 'r', 'KeyS': 's', 'KeyT': 't',
    'KeyU': 'u', 'KeyV': 'v', 'KeyW': 'w', 'KeyX': 'x', 'KeyY': 'y', 'KeyZ': 'z',
    'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
    'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
    'Space': ' ', 'Backquote': '¥'
  };
  
  // 指の色マップ
  const fingerColors = {
    'left-pinky': '#ff0000',
    'left-ring': '#ffa500', 
    'left-middle': '#ffd800',
    'left-index': '#00c000',
    'right-index': '#00d8d8',
    'right-middle': '#0040ff',
    'right-ring': '#8000ff',
    'right-pinky': '#ff80b2',
    'thumb': '#808080'
  };
  
  function highlightKey(keyCode) {
    // 既存のハイライトをクリア
    document.querySelectorAll('.key').forEach(key => {
      key.classList.remove('next-key');
      key.style.removeProperty('border-color');
      key.style.removeProperty('box-shadow');
      key.style.removeProperty('background-color');
    });

    // 対象キーをハイライト
    const targetKey = document.querySelector(`[data-code="${keyCode}"]`);
    if (targetKey) {
      // キーコードから文字を取得
      const char = keyCodeToChar[keyCode];
      let fingerType = null;
      
      // 指の種類を取得
      if (char && window.getFingerForKey) {
        fingerType = window.getFingerForKey(char);
      }
      
      // 指の色を取得
      const fingerColor = fingerType ? fingerColors[fingerType] : '#2196f3';
      
      // ハイライトを適用
      targetKey.classList.add('next-key');
      targetKey.style.borderColor = fingerColor;
      targetKey.style.boxShadow = `0 0 12px 3px ${fingerColor}66`;
      targetKey.style.backgroundColor = `${fingerColor}1a`;
    }
  }

  /* --------------------------------------------------
     11. 問題進行制御
     --------------------------------------------------*/
  function nextProblem() {
    currentProblem++;
    currentKeyIndex = 0;
    userInputSequence = [];
    elements.typedDisplay.innerHTML = ''; // 黒帯をクリア

    const curriculum = learningCurriculum[currentCurriculum];
    
    if (currentProblem >= curriculum.problems.length) {
      // カリキュラム完了
      nextCurriculum();
    } else {
      // 次の問題を表示
      displayCurrentProblem();
    }
    updateProgress();
  }

  function nextCurriculum() {
    currentCurriculum++;
    currentProblem = 0;
    currentKeyIndex = 0;
    userInputSequence = [];
    elements.typedDisplay.innerHTML = ''; // 黒帯をクリア

    if (currentCurriculum >= learningCurriculum.length) {
      // 全カリキュラム完了
      showCompletionMessage();
    } else {
      displayCurrentProblem();
    }
    updateProgress();
  }

  function showCompletionMessage() {
    elements.practiceText.innerHTML = `
      <div class="completion-message">
        <h2>🎉 おめでとうございます！</h2>
        <p>すべてのレッスンが完了しました。</p>
        <button onclick="window.mode3ProblemEngine.restart()">最初から始める</button>
      </div>
    `;
  }

  /* --------------------------------------------------
     12. イベントハンドラー
     --------------------------------------------------*/
  function handleKeyDown(event) {
    if (!isActive) return;
    
    event.preventDefault();
    checkInput(event.code);
  }

  /* --------------------------------------------------
     13. 進捗管理
     --------------------------------------------------*/
  function getProgress() {
    const totalProblems = learningCurriculum.reduce((sum, curriculum) => sum + curriculum.problems.length, 0);
    const completedProblems = learningCurriculum.slice(0, currentCurriculum).reduce((sum, curriculum) => sum + curriculum.problems.length, 0) + currentProblem;
    const percentage = Math.round((completedProblems / totalProblems) * 100);
    
    return {
      title: learningCurriculum[currentCurriculum]?.title || '',
      percentage: percentage,
      currentCurriculum: currentCurriculum + 1,
      totalCurricula: learningCurriculum.length,
      currentProblem: currentProblem + 1,
      totalProblems: learningCurriculum[currentCurriculum]?.problems.length || 0
    };
  }

  function updateProgress() {
    if (window.updateProgressDisplay) {
      window.updateProgressDisplay();
    }
  }

  /* --------------------------------------------------
     14. 公開API
     --------------------------------------------------*/
  window.mode3ProblemEngine = {
    start() {
      isActive = true;
      currentCurriculum = 0;
      currentProblem = 0;
      currentKeyIndex = 0;
      userInputSequence = [];
      elements.typedDisplay.innerHTML = '';
      displayCurrentProblem();
      updateProgress();
      
      // イベントリスナー登録
      document.addEventListener('keydown', handleKeyDown);
    },

    stop() {
      isActive = false;
      document.removeEventListener('keydown', handleKeyDown);
    },

    restart() {
      this.stop();
      this.start();
    },

    reset() {
      this.stop();
      elements.practiceText.innerHTML = '';
      elements.typedDisplay.innerHTML = '';
      document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('next-key');
      });
    },

    skip() {
      if (isActive) {
        nextProblem();
        updateProgress();
      }
    },

    getProgress() {
      return getProgress();
    }
  };

  /* --------------------------------------------------
     14. 初期化
     --------------------------------------------------*/
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Mode3 Problem Engine loaded');
  });

})();
