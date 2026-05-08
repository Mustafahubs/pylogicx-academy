/**
 * Pylogicx Academy — Interactive Quiz + Score Submission
 *
 * SETUP: Paste your Google Apps Script Web App URL below.
 * Leave it empty ("") and the submit button simply won't appear.
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDTicfSPtJP7HKhUgzYXxXdYDgk3CLTrmSWPP6HrG6YNztlyg0djkmQs8aAcZVkwAiuw/exec";   // ← paste your Web App URL here

// ── Page-level state ────────────────────────────────────────────────────────
let quizState = {
  total:     0,
  answered:  0,
  correct:   0,
  week:      "",
};

// ── Entry point ─────────────────────────────────────────────────────────────
function initQuizzes() {
  // Reset state on every (re-)load
  quizState = {
    total:    0,
    answered: 0,
    correct:  0,
    week:     getWeekFromPage(),
  };

  // Remove leftover submission panel from a previous instant-nav load
  const old = document.getElementById("quiz-submit-panel");
  if (old) old.remove();

  const questions = document.querySelectorAll(".admonition.question");
  quizState.total = questions.length;
  if (!quizState.total) return;

  questions.forEach(function (question) {
    const items = question.querySelectorAll(".task-list-item");
    if (!items.length) return;

    let correctIndex = -1;
    let answered     = false;

    // ── Find and hide the pre-checked correct answer ───────────────────────
    items.forEach(function (item, index) {
      const cb = item.querySelector('input[type="checkbox"]');
      if (!cb) return;
      if (cb.checked) {
        correctIndex = index;
        cb.checked   = false;
      }
      cb.removeAttribute("disabled");
    });

    if (correctIndex === -1) return;

    // ── Click handler for each option ──────────────────────────────────────
    items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        // Clicking the correct answer again resets the question
        if (answered && item.classList.contains("quiz-correct")) {
          resetQuestion(items, function () { answered = false; });
          return;
        }
        if (answered) return; // locked after a wrong pick

        // Uncheck everything
        items.forEach(function (i) {
          const cb = i.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = false;
          i.classList.remove("quiz-correct", "quiz-incorrect", "quiz-reveal");
        });

        const cb = item.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = true;

        const isCorrect = index === correctIndex;

        if (isCorrect) {
          item.classList.add("quiz-correct");
        } else {
          item.classList.add("quiz-incorrect");
          items[correctIndex].classList.add("quiz-correct", "quiz-reveal");
        }

        answered = true;
        recordAnswer(isCorrect);
      });
    });
  });
}

// ── Score tracking ───────────────────────────────────────────────────────────
function recordAnswer(isCorrect) {
  quizState.answered++;
  if (isCorrect) quizState.correct++;

  if (quizState.answered === quizState.total) {
    // Small delay so the last answer's colour renders first
    setTimeout(showSubmissionPanel, 400);
  }
}

// ── Submission panel ─────────────────────────────────────────────────────────
function showSubmissionPanel() {
  const score = quizState.correct;
  const total = quizState.total;
  const pct   = Math.round((score / total) * 100);

  const grade =
    pct >= 80 ? "Pass 🎉" :
    pct >= 60 ? "Needs Review ⚠️" :
                "Keep Practising 📚";

  const panel = document.createElement("div");
  panel.id        = "quiz-submit-panel";
  panel.className = `quiz-submit-panel grade-${gradeClass(pct)}`;
  panel.innerHTML = `
    <div class="quiz-score-summary">
      <span class="quiz-score-number">${score} / ${total}</span>
      <span class="quiz-score-pct">${pct}%</span>
      <span class="quiz-grade-label">${grade}</span>
    </div>

    ${APPS_SCRIPT_URL ? `
    <p class="quiz-submit-instruction">
      Enter your details below and click <strong>Submit</strong> so your teacher can record your result.
    </p>
    <div class="quiz-form">
      <input id="quiz-student-name"  type="text"  placeholder="Your full name"    autocomplete="name" />
      <input id="quiz-student-email" type="email" placeholder="Your email address" autocomplete="email" />
      <button id="quiz-submit-btn">Submit Score</button>
    </div>
    <div id="quiz-submit-status"></div>
    ` : `<p class="quiz-submit-instruction">Quiz complete — well done!</p>`}
  `;

  // Insert after the last question block
  const allQuestions = document.querySelectorAll(".admonition.question");
  allQuestions[allQuestions.length - 1].after(panel);

  if (APPS_SCRIPT_URL) {
    document.getElementById("quiz-submit-btn")
      .addEventListener("click", submitScore);
  }

  // Scroll to panel
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function submitScore() {
  const nameEl   = document.getElementById("quiz-student-name");
  const emailEl  = document.getElementById("quiz-student-email");
  const btn      = document.getElementById("quiz-submit-btn");
  const statusEl = document.getElementById("quiz-submit-status");

  const name  = nameEl.value.trim();
  const email = emailEl.value.trim();

  if (!name) {
    statusEl.textContent = "⚠️ Please enter your full name.";
    nameEl.focus();
    return;
  }
  if (!email || !email.includes("@")) {
    statusEl.textContent = "⚠️ Please enter a valid email address.";
    emailEl.focus();
    return;
  }

  btn.disabled        = true;
  statusEl.textContent = "Submitting…";

  const payload = {
    student_name:  name,
    student_email: email,
    week:          quizState.week,
    score:         quizState.correct,
    total:         quizState.total,
    percentage:    Math.round((quizState.correct / quizState.total) * 100),
  };

  // URLSearchParams → sent as application/x-www-form-urlencoded
  // This is the only Content-Type that works reliably with no-cors + Apps Script
  const body = new URLSearchParams();
  body.append("payload", JSON.stringify(payload));

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode:   "no-cors",   // response is opaque — .then() fires on network success
    body:   body,
  })
  .then(function () {
    statusEl.innerHTML =
      "✅ <strong>Score submitted!</strong> Your teacher has been notified.";
    btn.style.display = "none";
    nameEl.disabled   = true;
    emailEl.disabled  = true;
  })
  .catch(function () {
    statusEl.textContent =
      "❌ Submission failed — please tell your teacher your score manually.";
    btn.disabled = false;
  });
}

// ── Utilities ────────────────────────────────────────────────────────────────
function resetQuestion(items, onReset) {
  items.forEach(function (item) {
    const cb = item.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = false;
    item.classList.remove("quiz-correct", "quiz-incorrect", "quiz-reveal");
  });
  if (onReset) onReset();
}

function gradeClass(pct) {
  if (pct >= 80) return "pass";
  if (pct >= 60) return "review";
  return "fail";
}

function getWeekFromPage() {
  const match = window.location.pathname.match(/week(\d+)/i);
  return match ? `Week ${parseInt(match[1], 10)}` : document.title;
}

// ── Init hooks ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", initQuizzes);

// Material for MkDocs instant navigation
if (typeof document$ !== "undefined") {
  document$.subscribe(initQuizzes);
}
