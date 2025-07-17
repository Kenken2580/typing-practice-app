// keyboard-render.js – Mode3 用: 仮想キーボード描画と fingerMap だけを提供
(() => {
  if (window.mode3KeyboardInit) return;
  window.mode3KeyboardInit = true;

  const kb = document.getElementById('keyboard');
  if (!kb) return;

  /* ---------- JIS キーボードレイアウト ---------- */
  const jisLayout = [
    // 0行目 - ファンクションキー
    [
      { text: 'Esc', code: 'Escape', span: 2, key: 'escape' },
      { text: '', code: '', span: 1, key: '', transparent: true },
      { text: 'F1', code: 'F1', span: 2, key: 'f1' }, { text: 'F2', code: 'F2', span: 2, key: 'f2' }, { text: 'F3', code: 'F3', span: 2, key: 'f3' }, { text: 'F4', code: 'F4', span: 2, key: 'f4' },
      { text: 'F5', code: 'F5', span: 2, key: 'f5' }, { text: 'F6', code: 'F6', span: 2, key: 'f6' }, { text: 'F7', code: 'F7', span: 2, key: 'f7' }, { text: 'F8', code: 'F8', span: 2, key: 'f8' },
      { text: 'F9', code: 'F9', span: 2, key: 'f9' }, { text: 'F10', code: 'F10', span: 2, key: 'f10' }, { text: 'F11', code: 'F11', span: 2, key: 'f11' }, { text: 'F12', code: 'F12', span: 2, key: 'f12' },
      { text: '', code: '', span: 1, key: '', transparent: true }, { text: '', code: '', span: 2, key: '', transparent: true }
    ],
    // 1行目
    [
      { text: '半/全', code: 'IntlYen', span: 2, key: '¥' }, { text: '1', code: 'Digit1', span: 2, key: '1' }, { text: '2', code: 'Digit2', span: 2, key: '2' }, { text: '3', code: 'Digit3', span: 2, key: '3' }, { text: '4', code: 'Digit4', span: 2, key: '4' }, { text: '5', code: 'Digit5', span: 2, key: '5' },
      { text: '6', code: 'Digit6', span: 2, key: '6' }, { text: '7', code: 'Digit7', span: 2, key: '7' }, { text: '8', code: 'Digit8', span: 2, key: '8' }, { text: '9', code: 'Digit9', span: 2, key: '9' }, { text: '0', code: 'Digit0', span: 2, key: '0' },
      { text: '-', code: 'Minus', span: 2, key: '-' }, { text: '^', code: 'Equal', span: 2, key: '^' }, { text: '¥', code: 'IntlYen', span: 2, key: '¥' }, { text: 'Bs', code: 'Backspace', span: 2, key: 'backspace' }
    ],
    // 2行目
    [
      { text: 'Tab', code: 'Tab', span: 3, key: 'tab' }, { text: 'Q', code: 'KeyQ', span: 2, key: 'q' }, { text: 'W', code: 'KeyW', span: 2, key: 'w' }, { text: 'E', code: 'KeyE', span: 2, key: 'e' }, { text: 'R', code: 'KeyR', span: 2, key: 'r' }, { text: 'T', code: 'KeyT', span: 2, key: 't' },
      { text: 'Y', code: 'KeyY', span: 2, key: 'y' }, { text: 'U', code: 'KeyU', span: 2, key: 'u' }, { text: 'I', code: 'KeyI', span: 2, key: 'i' }, { text: 'O', code: 'KeyO', span: 2, key: 'o' }, { text: 'P', code: 'KeyP', span: 2, key: 'p' },
      { text: '@', code: 'BracketLeft', span: 2, key: '@' }, { text: '[', code: 'BracketRight', span: 2, key: '[' },
      { text: 'Enter', code: 'Enter', span: 3, key: 'enter', rowSpan: 2 }
    ],
        // 3行目
        [
          { text: 'Caps', code: 'CapsLock', span: 3, key: 'capslock' }, 
    { text: 'A', code: 'KeyA', span: 2, key: 'a' }, 
    { text: 'S', code: 'KeyS', span: 2, key: 's' }, 
    { text: 'D', code: 'KeyD', span: 2, key: 'd' }, 
    { text: 'F', code: 'KeyF', span: 2, key: 'f' }, 
    { text: 'G', code: 'KeyG', span: 2, key: 'g' },
          { text: 'H', code: 'KeyH', span: 2, key: 'h' }, 
    { text: 'J', code: 'KeyJ', span: 2, key: 'j' }, 
    { text: 'K', code: 'KeyK', span: 2, key: 'k' }, 
    { text: 'L', code: 'KeyL', span: 2, key: 'l' },
    { text: ';', code: 'Semicolon', span: 2, key: ';' }, 
    { text: ':', code: 'Quote', span: 2, key: ':' }, 
    { text: ']', code: 'Backslash', span: 2, key: ']' }
        ],
    // 4行目
    [
      { text: 'Shift', code: 'ShiftLeft', span: 4, key: 'shift' }, { text: 'Z', code: 'KeyZ', span: 2, key: 'z' }, { text: 'X', code: 'KeyX', span: 2, key: 'x' }, { text: 'C', code: 'KeyC', span: 2, key: 'c' }, { text: 'V', code: 'KeyV', span: 2, key: 'v' },
      { text: 'B', code: 'KeyB', span: 2, key: 'b' }, { text: 'N', code: 'KeyN', span: 2, key: 'n' }, { text: 'M', code: 'KeyM', span: 2, key: 'm' },
      { text: ',', code: 'Comma', span: 2, key: ',' }, { text: '.', code: 'Period', span: 2, key: '.' }, { text: '/', code: 'Slash', span: 2, key: '/' },
      { text: '_', code: 'IntlRo', span: 2, key: '_' }, { text: 'Shift', code: 'ShiftRight', span: 4, key: 'shift' }
    ],
    // 5行目
    [
      { text: 'Ctrl', code: 'ControlLeft', span: 3, key: 'control' }, { text: 'Win', code: 'MetaLeft', span: 2, key: 'meta' }, { text: 'Alt', code: 'AltLeft', span: 2, key: 'alt' },
      { text: '無変換', code: 'NonConvert', span: 3, key: 'nonconvert' }, { text: 'Space', code: 'Space', span: 7, key: ' ' },
      { text: '変換', code: 'Convert', span: 3, key: 'convert' }, { text: 'かな', code: 'KanaMode', span: 3, key: 'kanamode' },
      { text: 'Win', code: 'MetaRight', span: 2, key: 'meta' }, { text: 'App', code: 'ContextMenu', span: 2, key: 'contextmenu'}, { text: 'Ctrl', code: 'ControlRight', span: 3, key: 'control' }
    ]
  ];

  jisLayout.forEach(row => {
    row.forEach((keyData, idx) => {
      const d = document.createElement('div');
      d.className = 'key';
      if (idx === 0) d.classList.add('key-row-start');
      d.dataset.code = keyData.code;
      d.dataset.key = keyData.key;
      d.textContent = keyData.text;
      if (keyData.span) d.style.gridColumn = `span ${keyData.span}`;
      if (keyData.rowSpan) d.style.gridRow = `span ${keyData.rowSpan}`;
      if (keyData.transparent) {
        d.style.visibility = 'hidden';
        d.style.pointerEvents = 'none';
      }
      kb.appendChild(d);
    });
  });

  // finger map + helper for mode3-win.js
  const fingerMap = {
    "1qaz¥": 'left-pinky', "2wsx": 'left-ring', "3edc": 'left-middle', "4rfv5tgb": 'left-index',
    "6yhn7ujm": 'right-index', "8ik,": 'right-middle', "9ol.": 'right-ring', "0p;:[@]-^": 'right-pinky',
    " ": 'thumb', "_/]": 'right-pinky'
  };
  window.getFingerForKey = function(ch){
    ch = (ch || '').toLowerCase();
    for(const [keys,f] of Object.entries(fingerMap)){
      if(keys.includes(ch)) return f;
    }
    return null;
  };
})();
