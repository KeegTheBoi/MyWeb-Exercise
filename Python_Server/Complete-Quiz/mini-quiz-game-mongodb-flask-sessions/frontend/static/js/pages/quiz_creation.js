const quizControls = document.querySelector("#quiz-crud-controls");
const quizClient = new CrudClient("/api", "quiz");
const quizForm = document.createElement("form");
quizForm.className = "quiz-editor-form";

function createField(labelText, input) {
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = labelText;
  quizForm.append(label, input);
}

const quizTitleInput = document.createElement("input");
quizTitleInput.id = "quiz-title-input";
quizTitleInput.type = "text";
quizTitleInput.maxLength = 120;
quizTitleInput.required = true;
quizTitleInput.placeholder = "e.g. Science basics";
createField("Quiz title", quizTitleInput);

const quizDescriptionInput = document.createElement("textarea");
quizDescriptionInput.id = "quiz-description-input";
quizDescriptionInput.maxLength = 500;
quizDescriptionInput.rows = 3;
quizDescriptionInput.required = true;
quizDescriptionInput.placeholder = "What is this quiz about?";
createField("Description", quizDescriptionInput);

const quizAvailabilityInput = document.createElement("select");
quizAvailabilityInput.id = "quiz-availability-input";
quizAvailabilityInput.required = true;
quizAvailabilityInput.add(new Option("Choose availability", ""));
quizAvailabilityInput.add(new Option("Available to users", "true"));
quizAvailabilityInput.add(new Option("Hidden from users", "false"));
createField("Availability", quizAvailabilityInput);

const questionsSection = document.createElement("section");
questionsSection.className = "quiz-questions-section";

const questionsHeading = document.createElement("h3");
questionsHeading.id = "quiz-questions-heading";
questionsHeading.textContent = "Questions";
questionsSection.setAttribute("aria-labelledby", questionsHeading.id);
questionsSection.appendChild(questionsHeading);

const questionList = document.createElement("div");
questionList.className = "quiz-question-list";
questionsSection.appendChild(questionList);

const addQuestionButton = document.createElement("button");
addQuestionButton.type = "button";
addQuestionButton.textContent = "Add question";
addQuestionButton.addEventListener("click", () => addQuestion());
questionsSection.appendChild(addQuestionButton);
quizForm.appendChild(questionsSection);

const formActions = document.createElement("div");
formActions.className = "quiz-form-actions";

const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Create quiz";

const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Cancel edit";
cancelButton.hidden = true;
cancelButton.addEventListener("click", resetForm);

formActions.append(submitButton, cancelButton);
quizForm.appendChild(formActions);

const statusMessage = document.createElement("p");
statusMessage.setAttribute("role", "status");
statusMessage.setAttribute("aria-live", "polite");

const quizListHeading = document.createElement("h3");
quizListHeading.className = "quiz-list-heading";
quizListHeading.textContent = "Existing quizzes";

const quizList = document.createElement("ul");
quizList.className = "quiz-crud-controls-list";

quizControls.append(quizForm, statusMessage, quizListHeading, quizList);

let activeQuizId = null;
let questionSequence = 0;

function setStatus(message) {
  statusMessage.textContent = message;
}

function renumberQuestions() {
  questionList.querySelectorAll(".quiz-question").forEach((card, index) => {
    card.querySelector("legend").textContent = `Question ${index + 1}`;
  });
}

function updateChoiceButtons(card) {
  const choices = card.querySelectorAll(".quiz-choice-row");
  choices.forEach((choice) => {
    choice.querySelector(".remove-choice-button").disabled = choices.length <= 2;
  });
}

function addChoice(card, value = "", isAnswer = false) {
  const choices = card.querySelector(".quiz-question-choices");
  const choiceIndex = choices.children.length + 1;
  const row = document.createElement("div");
  row.className = "quiz-choice-row";

  const answerLabel = document.createElement("label");
  answerLabel.className = "quiz-choice-correct";
  const answerInput = document.createElement("input");
  answerInput.type = "radio";
  answerInput.name = card.dataset.answerGroup;
  answerInput.required = true;
  answerInput.checked = isAnswer;
  answerLabel.append(answerInput, document.createTextNode("Correct answer"));

  const choiceInput = document.createElement("input");
  choiceInput.type = "text";
  choiceInput.className = "quiz-choice-text";
  choiceInput.maxLength = 200;
  choiceInput.required = true;
  choiceInput.value = value;
  choiceInput.setAttribute("aria-label", `Choice ${choiceIndex}`);
  choiceInput.placeholder = `Choice ${choiceIndex}`;

  const removeChoiceButton = document.createElement("button");
  removeChoiceButton.type = "button";
  removeChoiceButton.className = "remove-choice-button";
  removeChoiceButton.textContent = "Remove choice";
  removeChoiceButton.addEventListener("click", () => {
    row.remove();
    updateChoiceButtons(card);
  });

  row.append(answerLabel, choiceInput, removeChoiceButton);
  choices.appendChild(row);
  updateChoiceButtons(card);
}

function addQuestion(questionData = {}) {
  const card = document.createElement("fieldset");
  card.className = "quiz-question";
  card.dataset.answerGroup = `quiz-question-answer-${questionSequence++}`;

  const legend = document.createElement("legend");
  card.appendChild(legend);

  const questionLabel = document.createElement("label");
  const questionInput = document.createElement("textarea");
  questionInput.className = "quiz-question-text";
  questionInput.maxLength = 500;
  questionInput.rows = 2;
  questionInput.required = true;
  questionInput.value = questionData.question || "";
  questionInput.id = `quiz-question-text-${questionSequence}`;
  questionInput.placeholder = "Enter the question";
  questionLabel.htmlFor = questionInput.id;
  questionLabel.textContent = "Question text";
  card.append(questionLabel, questionInput);

  const choices = document.createElement("div");
  choices.className = "quiz-question-choices";
  card.appendChild(choices);

  const choiceValues = Array.isArray(questionData.choices)
    ? questionData.choices
    : ["", ""];
  choiceValues.forEach((choice) => {
    addChoice(card, choice, choice === questionData.answer);
  });
  if (choiceValues.length < 2) {
    for (let index = choiceValues.length; index < 2; index += 1) {
      addChoice(card);
    }
  }

  const questionActions = document.createElement("div");
  questionActions.className = "quiz-question-actions";

  const addChoiceButton = document.createElement("button");
  addChoiceButton.type = "button";
  addChoiceButton.textContent = "Add choice";
  addChoiceButton.addEventListener("click", () => addChoice(card));

  const removeQuestionButton = document.createElement("button");
  removeQuestionButton.type = "button";
  removeQuestionButton.textContent = "Remove question";
  removeQuestionButton.addEventListener("click", () => {
    card.remove();
    renumberQuestions();
  });

  questionActions.append(addChoiceButton, removeQuestionButton);
  card.appendChild(questionActions);
  questionList.appendChild(card);
  renumberQuestions();
}

function collectQuestions() {
  return [...questionList.querySelectorAll(".quiz-question")].map((card) => {
    const choices = [...card.querySelectorAll(".quiz-choice-row")];
    const selectedAnswer = card.querySelector('input[type="radio"]:checked');
    const selectedRow = selectedAnswer?.closest(".quiz-choice-row");

    return {
      question: card.querySelector(".quiz-question-text").value.trim(),
      choices: choices.map((row) =>
        row.querySelector(".quiz-choice-text").value.trim(),
      ),
      answer: selectedRow?.querySelector(".quiz-choice-text").value.trim() || "",
    };
  });
}

function resetForm() {
  quizForm.reset();
  quizTitleInput.value = "";
  quizDescriptionInput.value = "";
  quizAvailabilityInput.value = "true";
  questionList.replaceChildren();
  addQuestion();
  activeQuizId = null;
  submitButton.textContent = "Create quiz";
  cancelButton.hidden = true;
  setStatus("");
}

function startEdit(quiz) {
  activeQuizId = quiz._id;
  quizTitleInput.value = quiz.title || "";
  quizDescriptionInput.value = quiz.description || "";
  quizAvailabilityInput.value = String(quiz.is_available === true);
  questionList.replaceChildren();
  (quiz.questions || []).forEach((question) => addQuestion(question));
  submitButton.textContent = "Update quiz";
  cancelButton.hidden = false;
  setStatus(`Editing "${quiz.title}".`);
  quizTitleInput.focus();
}

function renderQuizzes(quizzes) {
  quizList.replaceChildren();

  if (quizzes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No quizzes have been created yet.";
    quizList.appendChild(emptyMessage);
    return;
  }

  quizzes.forEach((quiz) => {
    const item = document.createElement("li");
    item.className = "quiz-list-item";
    const details = document.createElement("span");
    const questionCount = Array.isArray(quiz.questions)
      ? quiz.questions.length
      : 0;
    details.textContent = `${quiz.title} — ${quiz.description} (${questionCount} ${
      questionCount === 1 ? "question" : "questions"
    }, ${quiz.is_available ? "available" : "hidden"})`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEdit(quiz));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteQuiz(quiz));

    item.append(details, editButton, deleteButton);
    quizList.appendChild(item);
  });
}

async function loadQuizzes() {
  try {
    renderQuizzes(await quizClient.readAll());
  } catch (error) {
    setStatus(error.message || "Failed to load quizzes.");
  }
}

async function deleteQuiz(quiz) {
  if (!window.confirm(`Delete "${quiz.title}"?`)) return;

  try {
    await quizClient.delete(quiz._id);
    if (activeQuizId === quiz._id) resetForm();
    setStatus(`Deleted "${quiz.title}".`);
    await loadQuizzes();
  } catch (error) {
    setStatus(error.message || "Failed to delete quiz.");
  }
}

quizForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (questionList.children.length === 0) {
    setStatus("Add at least one question before saving the quiz.");
    addQuestionButton.focus();
    return;
  }
  if (!quizForm.reportValidity()) return;

  const quiz = {
    title: quizTitleInput.value.trim(),
    description: quizDescriptionInput.value.trim(),
    is_available: quizAvailabilityInput.value === "true",
    questions: collectQuestions(),
  };

  try {
    const successMessage = activeQuizId ? "Quiz updated." : "Quiz created.";
    if (activeQuizId) {
      await quizClient.update(activeQuizId, quiz);
    } else {
      await quizClient.create(quiz);
    }
    resetForm();
    setStatus(successMessage);
    await loadQuizzes();
  } catch (error) {
    setStatus(error.message || "Failed to save quiz.");
  }
});

resetForm();
loadQuizzes();
