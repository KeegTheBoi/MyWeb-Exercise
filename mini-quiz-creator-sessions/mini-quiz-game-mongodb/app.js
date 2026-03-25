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

function createFieldFromTemplate({
  className,
  placeholder,
  parser,
  formatter,
}) {
  const template = document.querySelector("#crud-item-template");
  const clone = template.content.cloneNode(true);

  const input = clone.querySelector("input");

  input.className = className;
  input.placeholder = placeholder;

  return { wrapper: clone, input, parser, formatter };
}

function extractDivFromTemplate(htmlTag) {
  return document.querySelector(htmlTag);
}

new CrudUIManager({
  client: quiz_client,
  div: extractDivFromTemplate(".quiz-container"),
  fields: [
    {
      name: "title",
      ...createFieldFromTemplate({
        className: "quiz-title-input",
        placeholder: "Enter your quiz question here",
      }),
    },
    {
      name: "choices",
      ...createFieldFromTemplate({
        className: "quiz-choices-input",
        placeholder: "Enter choices separated by commas",
        parser: (val) => val.split(",").map((s) => s.trim()),
        formatter: (val) => (val ? val.join(", ") : ""),
      }),
    },
    {
      name: "correctAnswer",
      ...createFieldFromTemplate({
        className: "quiz-correct-answer-input",
        placeholder: "Enter the correct answer",
      }),
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
new CrudUIManager({
  client: user_client,
  div: extractDivFromTemplate(".user-container"),
  fields: [
    {
      name: "username",
      ...createFieldFromTemplate({
        className: "user-name-input",
        placeholder: "Enter username",
      }),
    },
    {
      name: "email",
      ...createFieldFromTemplate({
        className: "user-email-input",
        placeholder: "Enter email",
      }),
    },
    { name: "score", input: { value: "" }, parser: () => 0 },
  ],
  formatItem: (u) =>
    `User: ${u.username} \nMail:(${u.email}) \n- Score: ${u.score}`,
});
