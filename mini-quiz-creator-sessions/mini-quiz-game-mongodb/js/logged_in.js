const signedInEmail = document.querySelector("#signed-in-email");
const signedInScore = document.querySelector("#signed-in-score");
const quizzesCompleted = document.querySelector("#quizzes-completed");
const accountRole = document.querySelector("#account-role");
const accountMessage = document.querySelector("#account-message");

async function loadCurrentSession() {
  const response = await fetch("/api/session", {
    credentials: "same-origin",
  });
  const data = await response.json();

  if (!response.ok) {
    window.location.assign("/login.html");
    return;
  }

  signedInEmail.textContent = data.user.email;
  signedInScore.textContent = data.user.score;
  quizzesCompleted.textContent = data.user.quiz_completed;
  accountRole.textContent = data.user.is_admin ? "Admin" : "Player";
}

loadCurrentSession().catch((error) => {
  accountMessage.textContent = error.message;
});
