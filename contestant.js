let questions = JSON.parse(localStorage.getItem("questions")) || [];
questions = shuffleArray(questions).slice(0, 10);

let current = 0;
let score = 0;
let timer;
let countdown = 10;

function startQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }

  const q = questions[current];
  document.getElementById("questionBox").innerText = q.question;

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  const shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      clearInterval(timer);
      if (opt === q.correct) score++;
      current++;
      startQuestion();
    };
    optionsBox.appendChild(btn);
  });

  countdown = 10;
  document.getElementById("timer").innerText = countdown;
  timer = setInterval(() => {
    countdown--;
    document.getElementById("timer").innerText = countdown;
    if (countdown === 0) {
      clearInterval(timer);
      current++;
      startQuestion();
    }
  }, 1000);

  document.getElementById("progress").innerText = `السؤال ${current + 1} من ${questions.length}`;
}

function showResult() {
  // إخفاء محتوى الأسئلة والموقت
  document.getElementById("questionBox").style.display = "none";
  document.getElementById("optionsBox").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("progress").style.display = "none";

  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = `<div class="result-box" style="font-size: 24px; color: #ff7700; text-align: center; margin-top: 40px;">
    انتهت الأسئلة! نتيجتك: ${score} من ${questions.length}
  </div>`;

  // تحديث بيانات المتسابق في قائمة المشاركين (participants) في localStorage
  let contestantData = JSON.parse(localStorage.getItem('currentContestant'));
  if (contestantData) {
    contestantData.score = score;
    contestantData.time = contestantData.time || new Date().toLocaleString();

    let allParticipants = JSON.parse(localStorage.getItem('contestantResults')) || [];
    // تحديث إذا موجود مسبقاً أو إضافة جديد
    const index = allParticipants.findIndex(p => p.name === contestantData.name && p.phone === contestantData.phone);
    if (index !== -1) {
      allParticipants[index] = contestantData;
    } else {
      allParticipants.push(contestantData);
    }
    localStorage.setItem('contestantResults', JSON.stringify(allParticipants));
  }

  // عرض النتيجة 5 ثواني ثم العودة للصفحة الرئيسية
  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startQuestion();
