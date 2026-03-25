// -------- GENERIC CRUD UI HANDLER --------
class CrudUIManager {
  constructor({ client, div, fields, formatItem }) {
    this.client = client;
    this.fields = fields; // [{name, input, parser?, formatter?}]
    this.editingId = null;
    this.formatItem = formatItem || ((item) => JSON.stringify(item));
    this.div = div; //upper div
    this.formElements = this.createCrudForm(div.className); //all the elements related to the form (buttons, list, etc.)
    this.listElement = this.formElements.listElement; //the element where items are listed
    this.init();
  }

  createCrudForm(className) {
    return {
      createBtn: this.updateWrapper("button", {
        textContent: "Create",
        className: `${className}-create-btn}`,
      }),
      updateBtn: this.updateWrapper("button", {
        textContent: "Update",
        className: `${className}-update-btn`,
        style: "display:none",
      }),
      cancelBtn: this.updateWrapper("button", {
        textContent: "Cancel",
        className: `${className}-cancel-btn`,
        style: "display:none",
      }),
      listElement: this.updateWrapper("ul", `${className}-list`),
    };
  }

  updateWrapper(tag, props) {
    const child = Object.assign(document.createElement(tag), props);
    this.div.appendChild(child);
    return child;
  }

  //#region INIT
  init() {
    document.addEventListener("DOMContentLoaded", () => this.loadItems());

    this.formElements.createBtn.addEventListener("click", () =>
      this.createItem(),
    );
    this.formElements.updateBtn.addEventListener("click", () =>
      this.updateItem(),
    );
    this.formElements.cancelBtn.addEventListener("click", () =>
      this.cancelEdit(),
    );
  }
  //#endregion

  //#region DATA COLLECTION (CUSTOMIZABLE PER FIELD)
  collectData() {
    const data = {};

    this.fields.forEach((field) => {
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
  //#endregion

  //#region LOAD & DISPLAY
  async loadItems() {
    try {
      console.log("Loading items...");
      const items = await this.client.readAll();
      this.renderList(items);
    } catch {
      alert("Failed to load items");
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
    const data = this.collectData();

    try {
      await this.client.create(data);
      this.resetForm();
      this.loadItems();
    } catch {
      alert("Failed to create item");
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
    const data = this.collectData();

    try {
      await this.client.update(this.editingId, data);
      this.cancelEdit();
      this.loadItems();
    } catch {
      alert("Failed to update item");
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
    } catch {
      alert("Failed to delete item");
    }
  }
  //#endregion

  //#region HELPERS
  resetForm() {
    this.fields.forEach((field) => {
      field.input.value = "";
    });
  }
  //#endregion
}
