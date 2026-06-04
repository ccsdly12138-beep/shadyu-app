function getTodayWords() {
  const start = new Date('2025-01-01');
  const today = new Date();
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const startIdx = (diffDays * 10) % WORDS.length;
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push(WORDS[(startIdx + i) % WORDS.length]);
  }
  return result;
}

function getStreak() {
  const key = 'streak_data';
  const today = new Date().toDateString();
  const raw = localStorage.getItem(key);
  const data = raw ? JSON.parse(raw) : { count: 0, lastDate: '' };
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (data.lastDate === today) return data.count;
  if (data.lastDate === yesterday) {
    data.count += 1;
  } else {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem(key, JSON.stringify(data));
  return data.count;
}

let idx = 0;
const todayList = getTodayWords();
const streak = getStreak();

function showWord() {
  if (idx >= 10) {
    document.getElementById('wordCard').style.display = 'none';
    document.getElementById('doneMsg').style.display = 'block';
    return;
  }
  const w = todayList[idx];
  document.getElementById('word').textContent = w.en;
  document.getElementById('phonetic').textContent = w.phonetic || '';
  document.getElementById('translation').textContent = w.zh;
  document.getElementById('progress').textContent = '第 ' + (Math.floor((new Date() - new Date('2025-01-01')) / 86400000) + 1) + ' 天 · ' + (idx + 1) + '/10';
  document.getElementById('streak').textContent = '🔥 连续 ' + streak + ' 天';
}

function speakUS() {
  const utter = new SpeechSynthesisUtterance(todayList[idx].en);
  utter.lang = 'en-US';
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function speakUK() {
  const utter = new SpeechSynthesisUtterance(todayList[idx].en);
  utter.lang = 'en-GB';
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function markKnown() {
  idx++;
  showWord();
}

function markUnknown() {
  idx++;
  showWord();
}
