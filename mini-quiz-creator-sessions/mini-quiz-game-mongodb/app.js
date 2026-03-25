// App-specific logic using the generic CrudClient
// This file handles UI interactions and uses the CrudClient for API calls

const API_BASE = "http://localhost:5000/api";
const QUIZ_ENTITY_NAME = "quiz"; // Change this for different entities
const USER_ENTITY_NAME = "user"; // Change this for different entities

const quiz_client = new CrudClient(API_BASE, QUIZ_ENTITY_NAME);

const user_client = new CrudClient(API_BASE, USER_ENTITY_NAME);

//#region Quiz management View Display

// Helper to create a generic UI manager for any entity

// --------- Quiz entity ---------
new CrudUIManager({
  client: quiz_client,
  div: document.querySelector(".quiz-container"),
  fields: [
    {
      name: "title",
      input: Object.assign(document.createElement("input"), {
        className: "quiz-title-input",
        placeholder: "Enter your quiz question here",
        type: "text",
      }),
    },
    {
      name: "correctAnswer",
      input: Object.assign(document.createElement("input"), {
        className: "quiz-correct-answer-input",
        placeholder: "Enter the correct answer",
        type: "text",
      }),
    },
    {
      name: "choices",
      input: Object.assign(document.createElement("input"), {
        className: "quiz-choices-input",
        placeholder: "Enter choices separated by commas",
        type: "text",
      }),

      parser: (val) => val.split(",").map((s) => s.trim()),
      formatter: (val) => (val ? val.join(", ") : ""),
    },
    {
      name: "date",
      input: { value: "" },
      parser: () => new Date().toISOString().slice(0, 10),
    },
  ],
  formatItem: (q) =>
    `[${q.date}] (${q.title}) \nChoices: [${q.choices.join(", ")}] \nCorrect: ${q.correctAnswer}`,
});

new CrudUIManager({
  client: user_client,
  div: document.querySelector(".user-container"),
  fields: [
    {
      name: "username",
      input: Object.assign(document.createElement("input"), {
        className: "user-username-input",
        placeholder: "Enter your username",
        type: "text",
      }),
    },
    {
      name: "email",
      input: Object.assign(document.createElement("input"), {
        className: "user-email-input",
        placeholder: "Enter your email",
        type: "text",
      }),
    },
    {
      name: "score",
      input: Object.assign(document.createElement("input"), {
        className: "user-score-input",
        placeholder: "Enter your score",
        type: "number",
      }),
      parser: (val) => parseFloat(val) || 0,
    },
  ],
  formatItem: (u) =>
    `Username: ${u.username}\nEmail: ${u.email}\nScore: ${u.score}`,
});
