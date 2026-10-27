
const USER_ENTITY_NAME = "user";
const user_client = new CrudClient("/api", USER_ENTITY_NAME);

function createFieldFromTemplate({
  className,
  placeholder,
  type = "text",
  autocomplete,
  pattern,
  minLength,
  maxLength = 254,
}) {
  const template = document.querySelector("#crud-item-template");
  const clone = template.content.cloneNode(true);

  const input = clone.querySelector("input");

  input.className = className;
  input.id = className;
  input.placeholder = placeholder;
  input.type = type;
  input.autocomplete = autocomplete || "";
  input.required = true;
  if (pattern) input.pattern = pattern;
  if (minLength) input.minLength = minLength;
  input.maxLength = maxLength;

  return { wrapper: clone, input };
}

function extractDivFromTemplate(htmlTag) {
  return document.querySelector(htmlTag);
}

const passwordPolicy = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,128}";

new RegistrationFormManager({
  client: user_client,
  div: extractDivFromTemplate(".user-container"),
  fields: [
    {
      name: "email",
      label: "Email",
      ...createFieldFromTemplate({
        className: "user-email-input",
        placeholder: "Enter email",
        type: "email",
        autocomplete: "email",
      }),
    },
    {
      name: "password",
      label: "Password",
      ...createFieldFromTemplate({
        className: "user-password-input",
        placeholder: "Enter password",
        type: "password",
        autocomplete: "new-password",
        pattern: passwordPolicy,
        minLength: 8,
        maxLength: 128,
      }),
    },
    {
      name: "passwordConfirmation",
      label: "Confirm password",
      ...createFieldFromTemplate({
        className: "user-password-confirmation-input",
        placeholder: "Confirm password",
        type: "password",
        autocomplete: "new-password",
        maxLength: 128,
      }),
    },
  ],
});
