let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];

const questionsCopy = [...questions];
const shuffledQuestions = questionsCopy.sort(() => 0.5 - Math.random()).slice(0, 10); // 10 random questions

function showQuestion() {
    const question = shuffledQuestions[currentQuestion];
    document.getElementById("question").innerText = question.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    question.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.innerText = answer;
        btn.classList.add("answer-btn");
        btn.addEventListener("click", () => selectAnswer(answer));
        answersDiv.appendChild(btn);
    });

    document.getElementById("next-btn").style.display = "none";
}

function selectAnswer(answer) {
    const question = shuffledQuestions[currentQuestion];
    const buttons = document.querySelectorAll(".answer-btn");

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === question.correct) {
            btn.classList.add("correct");
        } else if (btn.innerText === answer) {
            btn.classList.add("wrong");
        }
    });

    if (answer === question.correct) {
        score++;
    }

    selectedAnswers.push({ question: question.question, answer, correct: question.correct });

    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < shuffledQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById("quiz-container").innerHTML = `
        <h2>تم إنهاء الاختبار</h2>
        <p>علامتك: ${score} من ${shuffledQuestions.length}</p>
    `;

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const uniId = document.getElementById("universityId").value;

    if (name && phone && uniId) {
        sendDataToSheet(name, phone, uniId, score);
    } else {
        alert("يرجى إدخال جميع المعلومات المطلوبة قبل بدء الاختبار.");
    }
}

function sendDataToSheet(name, phone, uniId, score) {
    fetch("https://script.google.com/macros/s/AKfycbz0MhM5kTUFGBXRoq3IgvJPD6ZrXqSlWVJOrizizC7R5WNxkeLxW0erL-dh9WlvRRoQ/exec", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            phone: phone,
            uniId: uniId,
            score: score
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
    .then(result => {
        console.log("تم إرسال البيانات بنجاح:", result);
    })
    .catch(error => {
        console.error("حدث خطأ أثناء الإرسال:", error);
    });
}

document.getElementById("start-btn").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const uniId = document.getElementById("universityId").value;

    if (name && phone && uniId) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";
        showQuestion();
    } else {
        alert("يرجى ملء جميع الحقول للمتابعة.");
    }
});

document.getElementById("next-btn").addEventListener("click", nextQuestion);
