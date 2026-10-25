
const quizTitleInput = document.createElement("input");
quizTitleInput.id = "quiz-title-input";
quizTitleInput.type = "text";
quizTitleInput.maxLength = 120;
quizTitleInput.required = true;
quizTitleInput.placeholder = "e.g. Science basics";

const quizDescriptionInput = document.createElement("textarea");
quizDescriptionInput.id = "quiz-description-input";
quizDescriptionInput.maxLength = 500;
quizDescriptionInput.rows = 3;
quizDescriptionInput.required = true;
quizDescriptionInput.placeholder = "What is this quiz about?";

const quizClient = new CrudClient("/api", "quiz");

new CrudUIManager({
  client: quizClient,
  div: document.querySelector("#quiz-crud-controls"),
  fields: [
    {
      name: "title",
      label: "Quiz title",
      input: quizTitleInput,
    },
    {
      name: "description",
      label: "Description",
      input: quizDescriptionInput,
    },
  ],
  formatItem: (quiz) => `${quiz.title} — ${quiz.description}`,
});
