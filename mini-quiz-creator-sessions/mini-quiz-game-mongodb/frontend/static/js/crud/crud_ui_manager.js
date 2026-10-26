// -------- GENERIC CRUD UI HANDLER --------
class CrudUIManager {
  constructor({ client, div, fields, formatItem, createOnly = false }) {
    this.client = client;
    this.fields = fields; // [{name, input, parser?, formatter?}]
    this.editingId = null;
    this.formatItem = formatItem || ((item) => JSON.stringify(item));
    this.createOnly = createOnly;
    this.div = div; //upper div
    this.formElements = this.createCrudForm(div.className); //all the elements related to the form (buttons, list, etc.)
    this.listElement = this.formElements.listElement; //the element where items are listed
    this.init();
  }

  createCrudForm(className) {
    this.fields.forEach((field) => {
      const label = this.updateWrapper("label", {
        htmlFor: field.input.id,
        textContent: field.label || field.name,
      });
      this.div.appendChild(label);
      this.div.appendChild(field.input);
    });

    if (this.createOnly) {
      return {
        createBtn: this.updateWrapper("button", {
          textContent: "Create",
          className: `${className}-create-btn`,
        }),
      };
    }

    const formElements = {
      createBtn: this.updateWrapper("button", {
        textContent: "Create",
        className: `${className}-create-btn`,
      }),
      updateBtn: this.updateWrapper("button", {
        textContent: "Update",
        className: `${className}-update-btn`,
        type: "button",
      }),
      cancelBtn: this.updateWrapper("button", {
        textContent: "Cancel",
        className: `${className}-cancel-btn`,
        type: "button",
      }),
      listElement: this.updateWrapper("ul", {
        className: `${className}-list`,
      }),
    };
    return formElements;
  }

  updateWrapper(tag, props) {
    const child = Object.assign(document.createElement(tag), props);
    this.div.appendChild(child);
    return child;
  }

  //#region INIT
  init() {
    if (!this.createOnly) {
      document.addEventListener("DOMContentLoaded", () => this.loadItems());
    }

    if (this.formElements.form) {
      this.formElements.form.addEventListener("submit", (event) => {
        event.preventDefault();
        this.createItem();
      });
    } else {
      this.formElements.createBtn.addEventListener("click", () =>
        this.createItem(),
      );
    }
    if (this.createOnly) return;

    this.formElements.updateBtn.addEventListener("click", () =>
      this.updateItem(),
    );
    this.formElements.cancelBtn.addEventListener("click", () =>
      this.cancelEdit(),
    );

    this.formElements.updateBtn.style.display = "none";
    this.formElements.cancelBtn.style.display = "none";
  }
  //#endregion

  //#region DATA COLLECTION (CUSTOMIZABLE PER FIELD)
  collectData() {
    const data = {};

    this.fields.forEach((field) => {
      this.ensureFieldIsCorrectlyDefined(field);

      let value = field.input.value;

      // CUSTOM PARSER HOOK (modify per field if needed)
      if (field.parser) {
        value = field.parser(value);
      } else {
        value = value.trim();
      }

      data[field.name] = value;
    });

    return data;
  }

  ensureFieldIsCorrectlyDefined(field) {
    if (!field.name) {
      throw new Error("Each field must have a 'name' property");
    }
    if (field.input.value === undefined) {
      throw new Error(
        `Field '${field.name}' input element must have a 'value' property`,
      );
    }
  }
  //#endregion

  //#region LOAD & DISPLAY
  async loadItems() {
    if (this.createOnly) return;

    try {
      const items = await this.client.readAll();
      console.log("Items loaded:", items);
      this.renderList(items);
    } catch (error) {
      alert(error.message || "Failed to load items");
    }
  }

  renderList(items) {
    this.listElement.innerHTML = "";

    items.forEach((item) => {
      const li = document.createElement("li");

      // CUSTOM FORMATTER HOOK
      li.textContent = this.formatItem(item);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => this.startEdit(item);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => this.deleteItem(item._id);

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      this.listElement.appendChild(li);
    });
  }
  //#endregion

  //#region CREATE
  async createItem() {
    if (!this.validateFields()) return;
    const data = this.collectData();

    try {
      await this.client.create(data);
      this.resetForm();
      if (!this.createOnly) this.loadItems();
    } catch (error) {
      alert(error.message || "Failed to create item");
    }
  }
  //#endregion

  //#region EDIT
  startEdit(item) {
    this.fields.forEach((field) => {
      const value = item[field.name];

      // CUSTOM FORMATTER (for arrays etc.)
      field.input.value = field.formatter
        ? field.formatter(value)
        : value || "";
    });

    this.editingId = item._id;

    this.formElements.createBtn.style.display = "none";
    this.formElements.updateBtn.style.display = "inline";
    this.formElements.cancelBtn.style.display = "inline";
  }

  async updateItem() {
    if (!this.validateFields()) return;
    const data = this.collectData();

    try {
      await this.client.update(this.editingId, data);
      this.cancelEdit();
      this.loadItems();
    } catch (error) {
      alert(error.message || "Failed to update item");
    }
  }

  cancelEdit() {
    this.resetForm();
    this.editingId = null;

    this.formElements.createBtn.style.display = "inline";
    this.formElements.updateBtn.style.display = "none";
    this.formElements.cancelBtn.style.display = "none";
  }
  //#endregion

  //#region DELETE
  async deleteItem(id) {
    if (!confirm("Are you sure?")) return;

    try {
      await this.client.delete(id);
      this.loadItems();
    } catch (error) {
      alert(error.message || "Failed to delete item");
    }
  }
  //#endregion

  //#region HELPERS
  validateFields() {
    return this.fields.every((field) => {
      if (field.input.checkValidity()) return true;
      field.input.reportValidity();
      return false;
    });
  }

  resetForm() {
    this.fields.forEach((field) => {
      field.input.value = field.resetValue ?? "";
    });
  }
  //#endregion
}

class RegistrationFormManager extends CrudUIManager {
  constructor(options) {
    super({ ...options, createOnly: true });
  }

  createCrudForm(className) {
    const form = document.createElement("form");
    form.className = `${className}-registration-form`;

    this.fields.forEach((field) => {
      const label = document.createElement("label");
      label.htmlFor = field.input.id;
      label.textContent = field.label;

      form.appendChild(label);
      form.appendChild(field.input);
    });

    const createBtn = document.createElement("button");
    createBtn.type = "submit";
    createBtn.textContent = "Register";
    createBtn.className = `${className}-create-btn`;
    form.appendChild(createBtn);
    this.div.appendChild(form);

    return { form, createBtn };
  }

  collectData() {
    const email = this.fields.find((field) => field.name === "email");
    const password = this.fields.find((field) => field.name === "password");
    return {
      email: email.input.value.trim(),
      password: password.input.value,
    };
  }

  async createItem() {
    const password = this.fields.find((field) => field.name === "password");
    const confirmation = this.fields.find(
      (field) => field.name === "passwordConfirmation",
    );

    confirmation.input.setCustomValidity(
      password.input.value === confirmation.input.value
        ? ""
        : "Le password non corrispondono.",
    );

    if (!this.formElements.form.reportValidity()) return;

    try {
      await this.client.apiRequest("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.collectData()),
      });
      this.resetForm();
      alert("Registrazione completata.");
    } catch (error) {
      alert(error.message || "Registrazione non riuscita.");
    }
  }

  startEdit() {
    throw new Error("La registrazione non supporta la modifica degli utenti.");
  }

  async updateItem() {
    throw new Error("La registrazione non supporta la modifica degli utenti.");
  }

  async deleteItem() {
    throw new Error("La registrazione non supporta la gestione degli utenti.");
  }
}
