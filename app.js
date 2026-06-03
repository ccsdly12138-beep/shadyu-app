let idx=0;
function todayWords(){return WORDS.slice(0,10)}
function showWord(){document.getElementById('word').textContent=todayWords()[idx]}
async function login(){alert('请配置Supabase Auth后使用邮箱登录');}
function speakWord(){speechSynthesis.speak(new SpeechSynthesisUtterance(todayWords()[idx]));}
function markKnown(){idx=(idx+1)%10;showWord();}
function markUnknown(){idx=(idx+1)%10;showWord();}
showWord();