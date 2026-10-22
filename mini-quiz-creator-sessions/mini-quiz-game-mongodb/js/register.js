
const API_URL_LOCALHOST = "http://localhost:5000/api";//Works only local
const API_URL_PORT_FOWARD = "https://frzs4jpf-5000.eun1.devtunnels.ms/api";

const USER_ENTITY_NAME = "user"; // Change this for different entities


const user_client = new CrudClient(API_URL_PORT_FOWARD, USER_ENTITY_NAME);

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

// --------- User entity ---------
new CrudUIManager({
  client: user_client,
  div: extractDivFromTemplate(".user-container"),
  createOnly: true,
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
