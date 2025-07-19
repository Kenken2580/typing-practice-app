// problem-generators.js - Mode3の問題生成関数群
// 各レッスンに対応した詳細な問題生成とキーストロークシーケンス生成

(() => {
  'use strict';

  // ローマ字入力シーケンス生成ヘルパー関数
  function getRomajiSequence(hiraganaText) {
    const hiraganaToRomaji = {
      'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
      'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
      'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
      'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
      'ざ': 'za', 'じ': 'zi', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
      'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
      'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
      'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
      'は': 'ha', 'ひ': 'hi', 'ふ': 'hu', 'へ': 'he', 'ほ': 'ho',
      'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
      'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
      'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
      'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
      'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
      'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'nn',
      'ー': '-', '。': '.', '、': ',', '！': '!', '？': '?'
    };

    let sequence = [];
    for (let char of hiraganaText) {
      if (hiraganaToRomaji[char]) {
        for (let romaji of hiraganaToRomaji[char]) {
          sequence.push({
            key: romaji.toUpperCase(),
            display: romaji,
            type: 'romaji'
          });
        }
      }
    }
    return sequence;
  }

  // レッスン① 今日の日付
  function genTodayDateProblemSequence() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayNames = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
    const dayName = dayNames[today.getDay()];
    
    const finalProblemText = `${year}年${month}月${date}日（${dayName}）`;
    
    let keystrokeSequence = [];
    
    // IMEひらがなモードに切り替え
    keystrokeSequence.push({ key: 'KanaMode', display: 'かな', type: 'ime' });
    
    // 年の入力
    keystrokeSequence.push(...getRomajiSequence(`${year}ねん`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    // 月の入力
    keystrokeSequence.push(...getRomajiSequence(`${month}がつ`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    // 日の入力
    keystrokeSequence.push(...getRomajiSequence(`${date}にち`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    // 曜日の入力
    keystrokeSequence.push(...getRomajiSequence(`（${dayName}）`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    return { finalProblemText, keystrokeSequence };
  }

  // レッスン② 年月日変換
  function genRandomDateProblemSequence() {
    const patterns = [
      { year: 2024, month: 12, date: 25, day: 'すい' },
      { year: 2025, month: 1, date: 1, day: 'すい' },
      { year: 2025, month: 3, date: 15, day: 'ど' },
      { year: 2025, month: 7, date: 20, day: 'にち' }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const finalProblemText = `${pattern.year}年${pattern.month}月${pattern.date}日（${pattern.day}）`;
    
    let keystrokeSequence = [];
    
    // IMEひらがなモードに切り替え
    keystrokeSequence.push({ key: 'KanaMode', display: 'かな', type: 'ime' });
    
    // 年月日の入力とスペース変換
    keystrokeSequence.push(...getRomajiSequence(`${pattern.year}ねん`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    keystrokeSequence.push(...getRomajiSequence(`${pattern.month}がつ`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    keystrokeSequence.push(...getRomajiSequence(`${pattern.date}にち`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    keystrokeSequence.push(...getRomajiSequence(`（${pattern.day}）`));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    return { finalProblemText, keystrokeSequence };
  }

  // レッスン③ 半/全・Fキー変換
  function genFKeyConversionProblemSequence() {
    const patterns = [
      {
        text: 'カタカナ変換テスト',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('かたかなへんかんてすと'),
          { key: 'F7', display: 'F7', type: 'convert' }
        ]
      },
      {
        text: 'ﾊﾝｶｸｶﾀｶﾅ',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('はんかくかたかな'),
          { key: 'F8', display: 'F8', type: 'convert' }
        ]
      },
      {
        text: 'ＺＥＮＫＡＫＵ',
        sequence: [
          { key: 'Backquote', display: '半/全', type: 'ime' },
          ...getRomajiSequence('zenkaku'),
          { key: 'F9', display: 'F9', type: 'convert' }
        ]
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: pattern.sequence
    };
  }

  // レッスン④ 半/全とスペース変換の複合
  function genMixedConversionProblem1Sequence() {
    const patterns = [
      {
        text: '電話番号：03-1234-5678',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('でんわばんごう'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Backquote', display: '半/全', type: 'ime' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          ...getRomajiSequence('03-1234-5678')
        ]
      },
      {
        text: 'メール：test@example.com',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('めーる'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Backquote', display: '半/全', type: 'ime' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          ...getRomajiSequence('test@example.com')
        ]
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: pattern.sequence
    };
  }

  // レッスン⑤ 半/全とFキー変換の複合
  function genMixedConversionProblem2Sequence() {
    const patterns = [
      {
        text: 'フリガナ：ﾀﾅｶ ﾀﾛｳ',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('ふりがな'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Backquote', display: '半/全', type: 'ime' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('たなか たろう'),
          { key: 'F8', display: 'F8', type: 'convert' }
        ]
      },
      {
        text: 'コード：ＡＢＣＤ１２３４',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('こーど'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Backquote', display: '半/全', type: 'ime' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          ...getRomajiSequence('abcd1234'),
          { key: 'F9', display: 'F9', type: 'convert' }
        ]
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: pattern.sequence
    };
  }

  // レッスン⑥ スペースとFキー変換の複合
  function genMixedConversionProblem3Sequence() {
    const patterns = [
      {
        text: 'IT学習：プログラミング',
        sequence: [
          { key: 'Backquote', display: '半/全', type: 'ime' },
          ...getRomajiSequence('IT'),
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('がくしゅう'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          ...getRomajiSequence('ぷろぐらみんぐ'),
          { key: 'F7', display: 'F7', type: 'convert' }
        ]
      },
      {
        text: 'システム開発：データベース',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('しすてむ'),
          { key: 'F7', display: 'F7', type: 'convert' },
          ...getRomajiSequence('かいはつ'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          ...getRomajiSequence('でーたべーす'),
          { key: 'F7', display: 'F7', type: 'convert' }
        ]
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: pattern.sequence
    };
  }

  // レッスン⑦ 総合練習
  function genComprehensiveProblemSequence() {
    const patterns = [
      {
        text: '2025年1月15日（水）連絡先：support@example.com',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('2025ねん'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          ...getRomajiSequence('1がつ'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          ...getRomajiSequence('15にち'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          ...getRomajiSequence('（すい）'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          ...getRomajiSequence('れんらくさき'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          { key: 'Backquote', display: '半/全', type: 'ime' },
          ...getRomajiSequence('support@example.com'),
          { key: 'KanaMode', display: 'かな', type: 'ime' }
        ]
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: pattern.sequence
    };
  }

  // レッスン⑧ 早口言葉
  function genTongueTwisterProblemSequence() {
    const patterns = [
      'なまむぎなまごめなまたまご',
      'とうきょうとっきょきょかきょく',
      'あかまきがみあおまきがみきまきがみ',
      'きゃくきゃくきょきょきゅきゅ',
      'すもももももももものうち'
    ];
    
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    let keystrokeSequence = [];
    keystrokeSequence.push({ key: 'KanaMode', display: 'かな', type: 'ime' });
    keystrokeSequence.push(...getRomajiSequence(selectedPattern));
    
    return {
      finalProblemText: selectedPattern,
      keystrokeSequence: keystrokeSequence
    };
  }

  // レッスン⑨ AI話題特化
  function genAITopicProblemSequence() {
    const patterns = [
      {
        text: 'ディープラーニング：機械学習の進歩',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('でぃーぷらーにんぐ'),
          { key: 'F7', display: 'F7', type: 'convert' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          ...getRomajiSequence('きかいがくしゅう'),
          { key: 'Space', display: 'スペース', type: 'convert' },
          ...getRomajiSequence('のしんぽ'),
          { key: 'Space', display: 'スペース', type: 'convert' }
        ]
      },
      {
        text: 'ニューラルネットワーク：Python、TensorFlow',
        sequence: [
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('にゅーらるねっとわーく'),
          { key: 'F7', display: 'F7', type: 'convert' },
          { key: 'Shift', display: 'Shift+', type: 'modifier' },
          { key: 'Semicolon', display: ':', type: 'direct' },
          { key: 'Backquote', display: '半/全', type: 'ime' },
          ...getRomajiSequence('Python'),
          { key: 'KanaMode', display: 'かな', type: 'ime' },
          ...getRomajiSequence('、'),
          { key: 'Backquote', display: '半/全', type: 'ime' },
          ...getRomajiSequence('TensorFlow')
        ]
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: pattern.sequence
    };
  }

  // レッスン⑩ 長文練習
  function genLongTextProblemSequence() {
    // 漢字読みマッピング
    const kanjiReadings = {
      '日': 'にち', '本': 'ほん', '文': 'ぶん', '化': 'か', '技': 'ぎ', '術': 'じゅつ',
      '社': 'しゃ', '会': 'かい', '発': 'はつ', '展': 'てん', '情': 'じょう', '報': 'ほう',
      '学': 'がく', '習': 'しゅう', '教': 'きょう', '育': 'いく', '環': 'かん', '境': 'きょう',
      '問': 'もん', '題': 'だい', '解': 'かい', '決': 'けつ', '方': 'ほう', '法': 'ほう'
    };
    
    const patterns = [
      {
        text: '日本の文化と技術の発展について学習する。',
        reading: 'にほんのぶんかとぎじゅつのはってんについてがくしゅうする。'
      },
      {
        text: '情報社会における教育環境の問題解決方法を考える。',
        reading: 'じょうほうしゃかいにおけるきょういくかんきょうのもんだいかいけつほうほうをかんがえる。'
      }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    let keystrokeSequence = [];
    keystrokeSequence.push({ key: 'KanaMode', display: 'かな', type: 'ime' });
    
    // 読みを入力してスペース変換
    keystrokeSequence.push(...getRomajiSequence(pattern.reading));
    keystrokeSequence.push({ key: 'Space', display: 'スペース', type: 'convert' });
    
    return {
      finalProblemText: pattern.text,
      keystrokeSequence: keystrokeSequence
    };
  }

  // グローバルに公開
  window.genTodayDateProblemSequence = genTodayDateProblemSequence;
  window.genRandomDateProblemSequence = genRandomDateProblemSequence;
  window.genFKeyConversionProblemSequence = genFKeyConversionProblemSequence;
  window.genMixedConversionProblem1Sequence = genMixedConversionProblem1Sequence;
  window.genMixedConversionProblem2Sequence = genMixedConversionProblem2Sequence;
  window.genMixedConversionProblem3Sequence = genMixedConversionProblem3Sequence;
  window.genComprehensiveProblemSequence = genComprehensiveProblemSequence;
  window.genTongueTwisterProblemSequence = genTongueTwisterProblemSequence;
  window.genAITopicProblemSequence = genAITopicProblemSequence;
  window.genLongTextProblemSequence = genLongTextProblemSequence;

})();
