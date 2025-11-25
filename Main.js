// ====== Վերիյաբլներ ======
const startGameBtn = document.getElementById("startGame");
const usernameInput = document.getElementById("username");
const ageSelect = document.getElementById("age");
const genderSelect = document.getElementById("gender");

const gameSection = document.getElementById("game");
const questionText = document.getElementById("question-text");
const answerBtns = document.querySelectorAll(".answer-btn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const starsEl = document.getElementById("stars");
const toggleMusicBtn = document.getElementById("toggleMusic");
const changeBGBtn = document.getElementById("changeBG");
const leaderboardList = document.getElementById("leaderboard-list");

let score = 0;
let stars = 0;
let timer;
let timeLeft = 45;
let currentQuestion = 0;
let questions = [];

// ====== Երաժշտություն ======
let musicPlaying = false;
let audio = new Audio("sounds/background.mp3"); // կտեղադրես sounds/ ֆոլդերում

toggleMusicBtn.onclick = () => {
    if (musicPlaying) {
        audio.pause();
        musicPlaying = false;
    } else {
        audio.play();
        musicPlaying = true;
    }
}

// ====== Ֆոնի փոփոխություն ======
const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];
changeBGBtn.onclick = () => {
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

// ====== Հարցերի տվյալներ ======
const allQuestions = {
    "7-14": [
        {
            question: "Ո՞ր կենդանին է արագ է վազում",
            answers: ["Արջ", "Արքայագայլ", "Ձի", "Ձագ"],
            correct: 2
        },
        {
            question: "Հայաստանի մայրաքաղաքը",
            answers: ["Երևան", "Գյումրի", "Վանաձոր", "Սևան"],
            correct: 0
        }
        // Կարող ես ավելացնել ավելի շատ հարցեր
    ],
    "14-18": [
        {
            question: "Ո՞ր տարում հիմնադրվեց Երևանը",
            answers: ["782", "800", "1001", "1200"],
            correct: 0
        },
        {
            question: "Ի՞նչ է էկոլոգիան",
            answers: ["Բնական միջավայրի ուսումնասիրություն", "Քիմիա", "Ֆիզիկա", "Գեոլոգիա"],
            correct: 0
        }
        // Կարող ես ավելացնել ավելի շատ հարցեր
    ]
};

// ====== Սկսել խաղը ======
startGameBtn.onclick = () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Խնդրում ենք գրել անունը:");
        return;
    }
    const ageGroup = ageSelect.value;
    questions = [...allQuestions[ageGroup]]; // պատահականից կարելի է shuffle անել
    gameSection.style.display = "block";
    document.getElementById("user-info").style.display = "none";
    startQuestion();
}

// ====== Սկսել հարց ======
function startQuestion() {
    if (currentQuestion >= questions.length) {
        alert("Խաղը ավարտված է, Ձեր միավորները: " + score);
        updateLeaderboard();
        return;
    }

    const q = questions[currentQuestion];
    questionText.textContent = q.question;
    answerBtns.forEach((btn, index) => {
        btn.textContent = q.answers[index];
        btn.className = "answer-btn"; // մաքրել ճիշտ/սխալ դասերը
        btn.disabled = false;
        btn.onclick = () => checkAnswer(index);
    });

    timeLeft = 45;
    timerEl.textContent = `${timeLeft} վայրկյան`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `${timeLeft} վայրկյան`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            stars--; // սխալից -1 աստղ
            starsEl.textContent = stars;
            currentQuestion++;
            startQuestion();
        }
    }, 1000);
}

// ====== Ստուգել պատասխանը ======
function checkAnswer(index) {
    clearInterval(timer);
    const q = questions[currentQuestion];
    if (index === q.correct) {
        answerBtns[index].classList.add("correct");
        score += 10;
        stars++;
    } else {
        answerBtns[index].classList.add("wrong");
        answerBtns[q.correct].classList.add("correct"); // ճիշտ պատասխանը ցույց տալ
        stars--;
    }
    scoreEl.textContent = score;
    starsEl.textContent = stars;

    // Disable all buttons
    answerBtns.forEach(btn => btn.disabled = true);

    // հաջորդ հարց 2 վայրկյան հետո
    setTimeout(() => {
        currentQuestion++;
        startQuestion();
    }, 2000);
}

// ====== Leaderboard (տեղական storage) ======
function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("iqarenaLeaderboard") || "[]");
    leaderboard.push({username: usernameInput.value, score: score, stars: stars});
    leaderboard.sort((a,b) => b.score - a.score);
    localStorage.setItem("iqarenaLeaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("iqarenaLeaderboard") || "[]");
    leaderboardList.innerHTML = "";
    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.username} - Միավորներ: ${entry.score} / Աստղեր: ${entry.stars}`;
        leaderboardList.appendChild(li);
    });
    document.getElementById("leaderboard").style.display = "block";
}
