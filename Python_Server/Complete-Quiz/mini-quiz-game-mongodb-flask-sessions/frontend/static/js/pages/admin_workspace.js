const quizWorkspacePanel = document.querySelector("#quiz-workspace-panel");
const usersWorkspacePanel = document.querySelector("#users-workspace-panel");
const showQuizzesButton = document.querySelector("#show-quizzes-button");
const showUsersButton = document.querySelector("#show-users-button");

function showWorkspacePanel(panel, button) {
  const isQuizPanel = panel === quizWorkspacePanel;
  quizWorkspacePanel.hidden = !isQuizPanel;
  usersWorkspacePanel.hidden = isQuizPanel;

  showQuizzesButton.classList.toggle("is-active", isQuizPanel);
  showUsersButton.classList.toggle("is-active", !isQuizPanel);
  showQuizzesButton.removeAttribute("aria-current");
  showUsersButton.removeAttribute("aria-current");
  button.setAttribute("aria-current", "page");
}

showQuizzesButton.addEventListener("click", () => {
  showWorkspacePanel(quizWorkspacePanel, showQuizzesButton);
});
showUsersButton.addEventListener("click", () => {
  showWorkspacePanel(usersWorkspacePanel, showUsersButton);
});
