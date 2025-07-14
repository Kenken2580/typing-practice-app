// URLパラメータから結果データを取得
function getResultFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    score: parseInt(urlParams.get('score')) || 0,
    correctCount: parseInt(urlParams.get('correct')) || 0,
    totalChars: parseInt(urlParams.get('total')) || 0,
    errors: parseInt(urlParams.get('errors')) || 0,
    time: urlParams.get('time') || '0:00',
    wpm: parseInt(urlParams.get('wpm')) || 0,
    accuracy: parseInt(urlParams.get('accuracy')) || 0
  };
}

// 結果を表示する関数
function displayResults() {
  const result = getResultFromUrl();
  
  // 各要素に値を設定
  document.getElementById('final-score').textContent = result.score;
  document.getElementById('correct-count').textContent = result.correctCount;
  document.getElementById('total-chars').textContent = result.totalChars;
  document.getElementById('error-count').textContent = result.errors;
  document.getElementById('typing-time').textContent = result.time;
  document.getElementById('wpm-display').textContent = result.wpm;
  document.getElementById('accuracy-display').textContent = `${result.accuracy}%`;
  
  // スターの表示（正確率に基づいて1-5つ星）
  const stars = Math.min(5, Math.ceil(result.accuracy / 20));
  const levelDisplay = document.getElementById('level-display');
  levelDisplay.innerHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  
  // 正答率に応じたメッセージを取得
  let messageText = '';
  if (result.accuracy <= 30) {
    messageText = 'トライアルクリア！次のビギナーステージで、基本の指使いからマスターしましょう！';
  } else if (result.accuracy <= 50) {
    messageText = 'ナイスチャレンジ！ビギナーステージに進めば、もっとスムーズに打てるようになりますよ。';
  } else if (result.accuracy <= 80) {
    messageText = '素晴らしい上達です！ビギナーステージで、さらに実践的な練習に挑戦しませんか？';
  } else if (result.accuracy <= 90) {
    messageText = 'お見事！トライアルはもう完璧ですね。ビギナーステージで、あなたの実力をさらに伸ばしましょう！';
  } else if (result.accuracy <= 95) {
    messageText = '驚異的なスコアです！ぜひビギナーステージで、より高難易度の課題に挑戦してみてください。';
  } else { // 95%超
    messageText = 'パーフェクト！あなたはもうトライアルの達人です。次のビギナーステージが、あなたを待っています！';
  }

  const message = document.createElement('div');
  message.className = 'level-message';
  message.textContent = messageText;
  message.style.textAlign = 'center';
  message.style.marginTop = '10px';
  message.style.fontSize = '1.2rem';
  message.style.color = '#4a6fa5';
  
  levelDisplay.parentNode.insertBefore(message, levelDisplay.nextSibling);
}

// もう一度挑戦するボタンのイベントリスナー
document.getElementById('retry-button').addEventListener('click', function() {
  // 履歴を残さずにindex.htmlに遷移
  window.location.replace('beginner.html');
});

// ページ読み込み時に結果を表示
window.addEventListener('DOMContentLoaded', displayResults);
