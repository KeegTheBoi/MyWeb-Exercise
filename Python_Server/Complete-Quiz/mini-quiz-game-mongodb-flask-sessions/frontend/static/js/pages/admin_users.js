const adminUsersList = document.querySelector("#admin-users-list");
const adminUsersMessage = document.querySelector("#admin-users-message");
let signedInAdminEmail = null;

function appendActionButton(item, text, action, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  if (className) button.className = className;
  button.addEventListener("click", action);
  item.appendChild(button);
}

function renderAdminUsers(users) {
  adminUsersList.replaceChildren();

  users.forEach((user) => {
    const item = document.createElement("li");
    item.className = "admin-user-item";

    const details = document.createElement("div");
    details.className = "admin-user-details";
    const email = document.createElement("strong");
    email.textContent = user.email;
    const role = document.createElement("span");
    role.textContent = user.is_admin ? "Admin" : "Regular user";
    details.append(email, role);
    item.appendChild(details);

    if (user.email === signedInAdminEmail) {
      const selfLabel = document.createElement("span");
      selfLabel.className = "admin-user-note";
      selfLabel.textContent = "Current account";
      item.appendChild(selfLabel);
    } else {
      appendActionButton(
        item,
        user.is_admin ? "Remove admin role" : "Make admin",
        () => updateUserRole(user, !user.is_admin),
      );
      if (!user.is_admin) {
        appendActionButton(
          item,
          "Delete account",
          () => deleteRegularUser(user),
          "danger-button",
        );
      }
    }

    adminUsersList.appendChild(item);
  });
}

async function loadAdminUsers() {
  adminUsersMessage.textContent = "Loading users...";
  try {
    const response = await window.requestJson("/api/admin/users", {
      credentials: "same-origin",
    });
    renderAdminUsers(response.users);
    adminUsersMessage.textContent = "";
  } catch (error) {
    adminUsersMessage.textContent = error.message;
  }
}

async function updateUserRole(user, isAdmin) {
  try {
    await window.requestJson(`/api/admin/users/${encodeURIComponent(user._id)}/role`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_admin: isAdmin }),
    });
    adminUsersMessage.textContent = `${user.email} role updated.`;
    await loadAdminUsers();
  } catch (error) {
    adminUsersMessage.textContent = error.message;
  }
}

async function deleteRegularUser(user) {
  if (!window.confirm(`Delete the account for ${user.email}?`)) return;

  try {
    await window.requestJson(`/api/admin/users/${encodeURIComponent(user._id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    adminUsersMessage.textContent = `${user.email} account deleted.`;
    await loadAdminUsers();
  } catch (error) {
    adminUsersMessage.textContent = error.message;
  }
}

window.requestJson("/api/session", { credentials: "same-origin" })
  .then((response) => {
    signedInAdminEmail = response.user.email;
    return loadAdminUsers();
  })
  .catch((error) => {
    adminUsersMessage.textContent = error.message;
  });
