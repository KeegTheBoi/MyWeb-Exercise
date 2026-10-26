
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

const quizAvailabilityInput = document.createElement("select");
quizAvailabilityInput.id = "quiz-availability-input";
quizAvailabilityInput.required = true;
quizAvailabilityInput.add(new Option("Choose availability", ""));
quizAvailabilityInput.add(new Option("Available to users", "true"));
quizAvailabilityInput.add(new Option("Hidden from users", "false"));

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
    {
      name: "is_available",
      label: "Availability",
      input: quizAvailabilityInput,
      parser: (value) => value === "true",
      formatter: (value) => String(value === true),
      resetValue: "true",
    },
  ],
  formatItem: (quiz) =>
    `${quiz.title} — ${quiz.description} (${quiz.is_available ? "available" : "hidden"})`,
});
