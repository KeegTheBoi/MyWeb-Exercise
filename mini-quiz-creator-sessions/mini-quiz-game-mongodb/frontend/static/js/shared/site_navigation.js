const navigation = document.querySelector("#site-navigation");

let currentUser = null;

function renderNavigation() {
  const logo = document.createElement("a");
  logo.href = "/";
  logo.className = "logo";
  logo.textContent = "Super Quiz";

  const links = document.createElement("ul");
  links.className = "nav-links";

  const addLink = (label, href, className = "") => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (className) link.className = className;
    item.appendChild(link);
    links.appendChild(item);
  };

  addLink("Home", "/");
  if (currentUser) {
    addLink("My account", "/users.html");
    if (currentUser.is_admin) {
      addLink("Quiz Creation", "/quiz_creation.html");
    }

    const logoutItem = document.createElement("li");
    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "nav-action";
    logoutButton.textContent = "Log out";
    logoutButton.addEventListener("click", logOut);
    logoutItem.appendChild(logoutButton);
    links.appendChild(logoutItem);
  } else {
    addLink("Register", "/register.html");
    addLink("Login", "/login.html", "login-btn");
  }

  navigation.replaceChildren(logo, links);
  navigation.classList.add("is-ready");
  navigation.setAttribute("aria-busy", "false");
}

async function setAuthState(user) {
  currentUser = user;
  renderNavigation();
  window.dispatchEvent(
    new CustomEvent("authstatechange", { detail: { user: currentUser } }),
  );
}

function renderNavigationError() {
  const logo = document.createElement("a");
  logo.href = "/";
  logo.className = "logo";
  logo.textContent = "Super Quiz";

  const message = document.createElement("span");
  message.className = "nav-error";
  message.setAttribute("role", "alert");
  message.textContent = "Unable to load navigation. Refresh to try again.";

  navigation.replaceChildren(logo, message);
  navigation.classList.add("is-ready");
  navigation.setAttribute("aria-busy", "false");
}

async function refreshAuthState() {
  const response = await fetch("/api/session", {
    credentials: "same-origin",
  });
  if (response.status === 401) {
    await setAuthState(null);
    return null;
  }
  if (!response.ok) {
    throw new Error("Unable to load the current login state.");
  }

  const data = await response.json();
  await setAuthState(data.user);
  return data.user;
}

async function logOut() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unable to log out. Please try again.");
    }
    await setAuthState(null);
    window.location.assign("/");
  } catch (error) {
    window.alert(error.message);
  }
}

window.setAuthState = setAuthState;

refreshAuthState().catch((error) => {
  window.console.error(error);
  renderNavigationError();
});
