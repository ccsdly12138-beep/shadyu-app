// 根据日期计算今天学哪10个词
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

let idx = 0;
let accent = 'us'; // 'us' 或 'uk'
const todayList = getTodayWords();

function showWord() {
  const w = todayList[idx];
  document.getElementById('word').textContent = w.en;
  document.getElementById('translation').textContent = w.zh;
  document.getElementById('progress').textContent = (idx + 1) + ' / 10';
}

function speakWord() {
  const w = todayList[idx];
  const utter = new SpeechSynthesisUtterance(w.en);
  utter.lang = accent === 'us' ? 'en-US' : 'en-GB';
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function toggleAccent() {
  accent = accent === 'us' ? 'uk' : 'us';
  document.getElementById('accentBtn').textContent = accent === 'us' ? '🇺🇸 美式' : '🇬🇧 英式';
  speakWord();
}

function markKnown() {
  idx = (idx + 1) % 10;
  showWord();
}

function markUnknown() {
  idx = (idx + 1) % 10;
  showWord();
}

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) { alert('请输入邮箱和密码'); return; }

  const { error } = await window._supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await window._supabase.auth.signUp({ email, password });
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          alert('该邮箱已注册，请检查密码是否正确');
        } else {
          alert('失败: ' + signUpError.message);
        }
      } else {
        alert('✅ 注册成功，已自动登录');
      }
    } else {
      alert('失败: ' + error.message);
    }
  }
}

async function logout() {
  await window._supabase.auth.signOut();
}

window._supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    showWord();
  } else {
    document.getElementById('login').style.display = 'block';
    document.getElementById('app').style.display = 'none';
  }
});
