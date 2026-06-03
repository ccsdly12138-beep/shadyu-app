let idx = 0;
function todayWords() { return WORDS.slice(0, 10); }
function showWord() { document.getElementById('word').textContent = todayWords()[idx]; }
function speakWord() { speechSynthesis.speak(new SpeechSynthesisUtterance(todayWords()[idx])); }
function markKnown()   { idx = (idx + 1) % 10; showWord(); }
function markUnknown() { idx = (idx + 1) % 10; showWord(); }

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) { alert('请输入邮箱和密码'); return; }

  // 先尝试登录
  const { error } = await window._supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // 登录失败则尝试注册
    const { error: signUpError } = await window._supabase.auth.signUp({ email, password });
    if (signUpError) {
      alert('失败: ' + signUpError.message);
    } else {
      alert('✅ 注册成功，已自动登录');
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
