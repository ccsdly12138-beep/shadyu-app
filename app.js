// 登录/注册
async function login() {
  const email = document.getElementById('email').value.trim();
  if (!email) { alert('请输入邮箱'); return; }

  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    alert('登录失败: ' + error.message);
  } else {
    alert('✅ 验证邮件已发送，请查收并点击链接登录');
  }
}

// 监听登录状态变化，控制界面显示
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    showWord();
  } else {
    document.getElementById('login').style.display = 'block';
    document.getElementById('app').style.display = 'none';
  }
});

let idx = 0;
function todayWords() { return WORDS.slice(0, 10); }
function showWord() { document.getElementById('word').textContent = todayWords()[idx]; }
function speakWord() { speechSynthesis.speak(new SpeechSynthesisUtterance(todayWords()[idx])); }
function markKnown()   { idx = (idx + 1) % 10; showWord(); }
function markUnknown() { idx = (idx + 1) % 10; showWord(); }
