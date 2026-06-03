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

  const { error } = await window._supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      // 登录失败，尝试注册新账号
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
