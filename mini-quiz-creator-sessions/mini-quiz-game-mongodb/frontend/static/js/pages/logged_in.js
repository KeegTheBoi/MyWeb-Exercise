const signedInEmail = document.querySelector("#signed-in-email");
const signedInScore = document.querySelector("#signed-in-score");
const quizzesCompleted = document.querySelector("#quizzes-completed");
const accountRole = document.querySelector("#account-role");
const accountMessage = document.querySelector("#account-message");
const availableQuizzesList = document.querySelector("#available-quizzes-list");
const availableQuizzesMessage = document.querySelector("#available-quizzes-message");

function renderAvailableQuizzes(quizzes) {
  availableQuizzesList.replaceChildren();
  if (quizzes.length === 0) {
    availableQuizzesMessage.textContent = "There are no available quizzes yet.";
    return;
  }

  quizzes.forEach((quiz) => {
    const item = document.createElement("li");
    item.className = "available-quiz-item";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = quiz.title;
    const description = document.createElement("p");
    description.textContent = quiz.description;
    details.append(title, description);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Complete quiz";
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        const response = await window.requestJson(
          `/api/quiz/${encodeURIComponent(quiz._id)}/complete`,
          {
            method: "POST",
            credentials: "same-origin",
          },
        );
        availableQuizzesMessage.textContent = response.message;
      } catch (error) {
        availableQuizzesMessage.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
    item.append(details, button);
    availableQuizzesList.appendChild(item);
  });
}

async function loadAvailableQuizzes() {
  availableQuizzesMessage.textContent = "Loading quizzes...";
  const response = await window.requestJson("/api/all_quizs", {
    credentials: "same-origin",
  });
  renderAvailableQuizzes(response.quizs);
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
  signedInScore.textContent = data.user.score;
  quizzesCompleted.textContent = data.user.quiz_completed;
  accountRole.textContent = data.user.is_admin ? "Admin" : "Player";
  await loadAvailableQuizzes();
}

loadCurrentSession().catch((error) => {
  if (error.status === 401) {
    window.location.assign("/login.html");
    return;
  }
  accountMessage.textContent = error.message;
  availableQuizzesMessage.textContent = error.message;
});
