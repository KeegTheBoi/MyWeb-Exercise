const signedInEmail = document.querySelector("#signed-in-email");
const signedInScore = document.querySelector("#signed-in-score");
const quizzesCompleted = document.querySelector("#quizzes-completed");
const accountRole = document.querySelector("#account-role");
const accountMessage = document.querySelector("#account-message");

function animateNumber(element, value) {
  const target = Number(value);
  if (!Number.isFinite(target)) {
    element.textContent = String(value);
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = String(target);
    return;
  }

  const start = performance.now();
  const duration = 850;
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

async function loadCurrentSession() {
  const data = await window.requestJson("/api/session", {
    credentials: "same-origin",
  });
  if (!data.user) {
    window.location.assign("/login.html");
    return;
  }

  signedInEmail.textContent = data.user.email;
  animateNumber(signedInScore, data.user.score);
  animateNumber(quizzesCompleted, data.user.quiz_completed);
  accountRole.textContent = data.user.is_admin ? "Admin" : "Player";
}

loadCurrentSession().catch((error) => {
  if (error.status === 401) {
    window.location.assign("/login.html");
    return;
  }
  accountMessage.textContent = error.message;
});
