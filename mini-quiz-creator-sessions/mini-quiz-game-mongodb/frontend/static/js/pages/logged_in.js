const signedInEmail = document.querySelector("#signed-in-email");
const signedInScore = document.querySelector("#signed-in-score");
const quizzesCompleted = document.querySelector("#quizzes-completed");
const accountRole = document.querySelector("#account-role");
const accountMessage = document.querySelector("#account-message");

async function loadCurrentSession() {
  const data = await window.requestJson("/api/session", {
    credentials: "same-origin",
  });
  if (!data.user) {
    window.location.assign("/login.html");
    return;
  }

  signedInEmail.textContent = data.user.email;
  signedInScore.textContent = data.user.score;
  quizzesCompleted.textContent = data.user.quiz_completed;
  accountRole.textContent = data.user.is_admin ? "Admin" : "Player";
}

loadCurrentSession().catch((error) => {
  if (error.status === 401) {
    window.location.assign("/login.html");
    return;
  }
  accountMessage.textContent = error.message;
});
