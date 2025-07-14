// 濁点・半濁点の練習用文字列
const dakutenChars = [
  'が', 'ぎ', 'ぐ', 'げ', 'ご',
  'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
  'だ', 'ぢ', 'づ', 'で', 'ど',
  'ば', 'び', 'ぶ', 'べ', 'ぼ'
];

const handakutenChars = [
  'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'
];

// 現在の練習セット
let currentSet = [];
let currentIndex = 0;

// モード初期化
function initDakutenMode() {
  // 練習セットをシャッフル
  currentSet = [...dakutenChars, ...handakutenChars]
    .sort(() => Math.random() - 0.5);
  currentIndex = 0;
  
  // 最初の文字を表示
  if (currentSet.length > 0) {
    document.getElementById('practice-text').textContent = currentSet[0];
  }
  
  // カウンター表示
  const counter = document.getElementById('repetition-counter');
  if (counter) {
    counter.textContent = `1/${currentSet.length}`;
    counter.hidden = false;
  }
}

// 入力チェック
function checkDakutenInput(inputChar) {
  if (currentIndex >= currentSet.length) return false;
  
  const currentChar = currentSet[currentIndex];
  const isCorrect = inputChar === currentChar;
  
  if (isCorrect) {
    currentIndex++;
    updateCounter();
    
    if (currentIndex < currentSet.length) {
      document.getElementById('practice-text').textContent = currentSet[currentIndex];
    } else {
      // 全問正解時の処理
      document.getElementById('practice-text').textContent = 'おめでとうございます！';
      document.getElementById('repetition-counter').hidden = true;
    }
  }
  
  return isCorrect;
}

// カウンター更新
function updateCounter() {
  const counter = document.getElementById('repetition-counter');
  if (counter) {
    counter.textContent = `${currentIndex + 1}/${currentSet.length}`;
  }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
  const mode2Btn = document.querySelector('button[data-mode="2"]');
  if (mode2Btn) {
    mode2Btn.addEventListener('click', () => {
      initDakutenMode();
    });
  }
});

// グローバルに公開
window.checkDakutenInput = checkDakutenInput;