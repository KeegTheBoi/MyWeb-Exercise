const playQuizzesButton = document.querySelector("#play-quizzes-button");
const availableQuizzesPanel = document.querySelector("#available-quizzes-panel");
const availableQuizzesList = document.querySelector("#available-quizzes-list");
const availableQuizzesMessage = document.querySelector("#available-quizzes-message");
const quizPage = document.querySelector("#quiz-page");
const activeQuizTitle = document.querySelector("#active-quiz-title");
const activeQuizStage = document.querySelector("#active-quiz-stage");
const leaveQuizButton = document.querySelector("#leave-quiz-button");

function animateNumber(element, value, suffix = "") {
  const target = Number(value);
  if (!Number.isFinite(target)) {
    element.textContent = `${value}${suffix}`;
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  const start = performance.now();
  const duration = 850;
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

let activeQuizItem = null;
let activeQuizStartButton = null;
let activeQuizStageElement = null;

function showQuizPage(quiz, item, startButton, stage) {
  activeQuizTitle.textContent = quiz.title;
  activeQuizItem = item;
  activeQuizStartButton = startButton;
  activeQuizStageElement = stage;
  stage.hidden = false;
  activeQuizStage.replaceChildren(stage);
  quizPage.hidden = false;
  document.body.classList.add("quiz-mode");
  quizPage.focus();
}

function leaveQuizPage() {
  if (activeQuizItem && activeQuizStageElement) {
    activeQuizStageElement.hidden = true;
    activeQuizItem.appendChild(activeQuizStageElement);
  }
  activeQuizStage.replaceChildren();
  quizPage.hidden = true;
  document.body.classList.remove("quiz-mode");
  activeQuizStartButton?.focus();
  activeQuizItem = null;
  activeQuizStartButton = null;
  activeQuizStageElement = null;
}

leaveQuizButton.addEventListener("click", leaveQuizPage);

function renderAvailableQuizzes(quizzes) {
  availableQuizzesList.replaceChildren();
  if (quizzes.length === 0) {
    availableQuizzesMessage.textContent = "There are no available quizzes yet.";
    return;
  }

  availableQuizzesMessage.textContent = "";
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
    button.textContent = quiz.completed ? "Review result" : "Start quiz";
    if (quiz.completed) button.classList.add("quiz-completed-button");

    const stage = document.createElement("div");
    stage.className = "quiz-play-stage";
    stage.hidden = true;

    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        if (quiz.completed) {
          renderResult(stage, quiz.attempt_result);
          showQuizPage(quiz, item, button, stage);
        } else {
          const response = await window.requestJson(
            `/api/quiz/${encodeURIComponent(quiz._id)}`,
            { credentials: "same-origin" },
          );
          if (response.quiz.completed) {
            quiz.completed = true;
            quiz.attempt_result = response.quiz.attempt_result;
            button.textContent = "Review result";
            button.classList.add("quiz-completed-button");
            renderResult(stage, quiz.attempt_result);
          } else {
            renderQuestion(stage, quiz, response.quiz, button);
          }
          showQuizPage(quiz, item, button, stage);
        }
      } catch (error) {
        availableQuizzesMessage.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
    item.append(details, button, stage);
    availableQuizzesList.appendChild(item);
  });
}

function renderQuestion(stage, quizSummary, quiz, startButton) {
  const answers = [];
  let questionIndex = 0;
  const answerSection = document.createElement("section");
  answerSection.className = "quiz-answer-section";
  answerSection.setAttribute("aria-label", "Answer the questions");

  function showQuestion() {
    const question = quiz.questions[questionIndex];
    const fieldset = document.createElement("fieldset");
    fieldset.className = "quiz-play-question";

    const legend = document.createElement("legend");
    legend.textContent = `Question ${questionIndex + 1} of ${quiz.questions.length}`;
    fieldset.appendChild(legend);

    const prompt = document.createElement("p");
    prompt.textContent = question.question;
    fieldset.appendChild(prompt);

    question.choices.forEach((choice, choiceIndex) => {
      const label = document.createElement("label");
      label.className = "quiz-play-choice";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `quiz-${quiz._id}-question-${questionIndex}`;
      input.value = choice;
      input.required = true;
      input.checked = answers[questionIndex] === choice;
      label.append(input, document.createTextNode(choice));
      fieldset.appendChild(label);
    });

    const actions = document.createElement("div");
    actions.className = "quiz-play-actions";
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    const lastQuestion = questionIndex === quiz.questions.length - 1;
    nextButton.textContent = lastQuestion ? "Submit quiz" : "Next";
    nextButton.addEventListener("click", async () => {
      const selected = fieldset.querySelector('input[type="radio"]:checked');
      if (!selected) {
        fieldset.querySelector('input[type="radio"]').reportValidity();
        return;
      }
      answers[questionIndex] = selected.value;

      if (!lastQuestion) {
        questionIndex += 1;
        showQuestion();
        return;
      }

      nextButton.disabled = true;
      try {
        const response = await window.requestJson(
          `/api/quiz/${encodeURIComponent(quiz._id)}/complete`,
          {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
          },
        );
        quizSummary.completed = true;
        quizSummary.attempt_result = response.result;
        startButton.textContent = "Review result";
        startButton.classList.add("quiz-completed-button");
        renderResult(stage, response.result);
      } catch (error) {
        if (error.status === 409) {
          try {
            const response = await window.requestJson(
              `/api/quiz/${encodeURIComponent(quiz._id)}`,
              { credentials: "same-origin" },
            );
            if (response.quiz.completed && response.quiz.attempt_result) {
              quizSummary.completed = true;
              quizSummary.attempt_result = response.quiz.attempt_result;
              startButton.textContent = "Review result";
              startButton.classList.add("quiz-completed-button");
              renderResult(stage, response.quiz.attempt_result);
              return;
            }
          } catch (refreshError) {
            nextButton.disabled = false;
            const errorMessage = document.createElement("p");
            errorMessage.className = "quiz-play-error";
            errorMessage.setAttribute("role", "alert");
            errorMessage.textContent = refreshError.message;
            fieldset.appendChild(errorMessage);
            return;
          }
        }
        nextButton.disabled = false;
        const errorMessage = document.createElement("p");
        errorMessage.className = "quiz-play-error";
        errorMessage.setAttribute("role", "alert");
        errorMessage.textContent = error.message;
        fieldset.appendChild(errorMessage);
      }
    });
    actions.appendChild(nextButton);
    fieldset.appendChild(actions);
    answerSection.replaceChildren(fieldset);
  }

  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    stage.textContent = "This quiz has no questions yet.";
    return;
  }
  stage.replaceChildren(answerSection);
  showQuestion();
}

function renderResult(stage, result) {
  if (!result) {
    stage.textContent = "The saved result is unavailable.";
    return;
  }

  const resultCard = document.createElement("section");
  resultCard.className = "quiz-result-card";
  resultCard.setAttribute("aria-labelledby", "quiz-result-title");

  const heading = document.createElement("h2");
  heading.id = "quiz-result-title";
  heading.textContent = "Quiz completed";
  const scoreSummary = document.createElement("div");
  scoreSummary.className = "quiz-result-summary";
  const ring = document.createElement("div");
  ring.className = "quiz-result-ring";
  ring.style.setProperty("--score", "0%");
  ring.setAttribute("role", "img");
  ring.setAttribute("aria-label", `Score: ${result.percentage}%`);
  const percentage = document.createElement("span");
  percentage.className = "quiz-result-percentage";
  ring.appendChild(percentage);

  const correctCount = document.createElement("p");
  correctCount.className = "quiz-result-correct-count";
  const correctCountValue = document.createElement("span");
  correctCountValue.textContent = "0";
  correctCount.append(
    correctCountValue,
    document.createTextNode(` of ${result.total_questions} correct`),
  );
  const completed = document.createElement("p");
  completed.className = "quiz-result-completed";
  completed.textContent = "This quiz is completed and cannot be taken again.";
  scoreSummary.append(ring, correctCount, completed);
  resultCard.append(heading, scoreSummary);

  requestAnimationFrame(() => {
    ring.style.setProperty("--score", `${result.percentage}%`);
    animateNumber(percentage, result.percentage, "%");
    animateNumber(correctCountValue, result.correct_count);
  });

  const resultsList = document.createElement("ol");
  resultsList.className = "quiz-answer-review";
  result.results.forEach((answerResult) => {
    const answerItem = document.createElement("li");
    const question = document.createElement("strong");
    question.textContent = answerResult.question;
    const selected = document.createElement("p");
    selected.textContent = `Your answer: ${answerResult.selected_answer}`;
    const correct = document.createElement("p");
    correct.textContent = `Correct answer: ${answerResult.correct_answer}`;
    const status = document.createElement("p");
    status.className = answerResult.is_correct ? "answer-correct" : "answer-incorrect";
    status.textContent = answerResult.is_correct ? "Correct" : "Incorrect";
    answerItem.append(question, selected, correct, status);
    resultsList.appendChild(answerItem);
  });
  resultCard.appendChild(resultsList);
  stage.replaceChildren(resultCard);
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
    if (!quizPage.hidden) leaveQuizPage();
    availableQuizzesPanel.hidden = true;
    playQuizzesButton.setAttribute("aria-expanded", "false");
    playQuizzesButton.textContent = "Play";
    availableQuizzesList.replaceChildren();
  }
});
