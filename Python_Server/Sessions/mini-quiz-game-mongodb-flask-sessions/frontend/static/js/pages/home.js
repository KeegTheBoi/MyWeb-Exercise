const playQuizzesButton = document.querySelector("#play-quizzes-button");
const availableQuizzesPanel = document.querySelector("#available-quizzes-panel");
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

playQuizzesButton.addEventListener("click", async () => {
  const isExpanded = playQuizzesButton.getAttribute("aria-expanded") === "true";
  availableQuizzesPanel.hidden = isExpanded;
  playQuizzesButton.setAttribute("aria-expanded", String(!isExpanded));

  if (isExpanded) {
    playQuizzesButton.textContent = "Play";
    return;
  }

  playQuizzesButton.textContent = "Hide quizzes";
  try {
    await loadAvailableQuizzes();
  } catch (error) {
    availableQuizzesMessage.textContent = error.message;
  }
});

window.addEventListener("authstatechange", (event) => {
  playQuizzesButton.hidden = !event.detail.user;
  if (!event.detail.user) {
    availableQuizzesPanel.hidden = true;
    playQuizzesButton.setAttribute("aria-expanded", "false");
    playQuizzesButton.textContent = "Play";
    availableQuizzesList.replaceChildren();
  }
});
