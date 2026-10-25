const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const loginSubmit = document.querySelector("#login-submit");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "";
  loginSubmit.disabled = true;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        email: loginForm.elements.email.value,
        password: loginForm.elements.password.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to log in.");
    }

    await window.setAuthState(data.user);
    window.location.assign("/users.html");
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    loginSubmit.disabled = false;
  }
});
