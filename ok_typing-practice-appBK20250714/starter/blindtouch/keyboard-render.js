/* starter/blindtouch3/keyboard-render.js  ─ 仮想キーボード描画 */
(()=>{
  /* 109 配列（物理順） */
  const L = [
    ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
    ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
    ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
    ['ShiftLeft','IntlYen','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
    ['ControlLeft','WinLeft','AltLeft','NonConvert','Space','Convert','KanaMode','AltRight','ControlRight']
  ];

  /* ラベル辞書（足りない分だけ定義） */
  const label = {
    Backquote:'半/全', NonConvert:'無変換', Convert:'変換', Space:'Space',
    IntlYen:'¥', WinLeft:'Win', KanaMode:'かな',
    Minus:'-', Equal:'=', Backslash:'￥', BracketLeft:'[', BracketRight:']',
    Semicolon:';', Quote:':', Comma:',', Period:'.', Slash:'/',
    CapsLock:'Caps', ShiftLeft:'Shift', ShiftRight:'Shift',
    ControlLeft:'Ctrl', ControlRight:'Ctrl', AltLeft:'Alt', AltRight:'Alt',
    Backspace:'Backspace', Enter:'Enter', Tab:'Tab'
  };
  for(let i=0;i<=0;i++) label['Digit'+i]=''+i;           // 0
  for(let i=1;i<=9;i++) label['Digit'+i]=''+i;           // 1-9
  for(let f=1;f<=12;f++) label['F'+f]='F'+f;             // F1-F12

  /* 描画先 */
  const kb = document.getElementById('keyboard');
  if(!kb) return;

  L.forEach(row=>{
    const line = document.createElement('div'); line.className='row';
    row.forEach(code=>{
      const key = document.createElement('div');
      key.className = 'key';
      key.dataset.code = code;                // ← problem-engine が参照
      key.textContent = label[code] ?? (code.startsWith('Key') ? code.slice(3) : code);
      line.appendChild(key);
    });
    kb.appendChild(line);
  });
})();
