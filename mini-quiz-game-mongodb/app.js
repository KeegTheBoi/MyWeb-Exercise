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
setupEntityUI({
  client: quiz_client,
  listId: "quizList",
  createBtnId: "createQuizBtn",
  updateBtnId: "updateQuizBtn",
  cancelBtnId: "cancelQuizBtn",
  fields: [
    { name: "title", input: document.getElementById("quizTitleInput") },
    {
      name: "correctAnswer",
      input: document.getElementById("quizCorrectInput"),
    },
    {
      name: "choices",
      input: document.getElementById("quizChoicesInput"),
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

// --------- User entity ---------
setupEntityUI({
  client: user_client,
  listId: "userList",
  createBtnId: "createUserBtn",
  updateBtnId: "updateUserBtn",
  cancelBtnId: "cancelUserBtn",
  fields: [
    { name: "username", input: document.getElementById("usernameInput") },
    { name: "email", input: document.getElementById("emailInput") },
    { name: "score", input: { value: "" }, parser: () => 0 },
  ],
  formatItem: (u) =>
    `Username: ${u.username}\nEmail: ${u.email}\nScore: ${u.score}`,
});
