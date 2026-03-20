// -------- GENERIC CRUD UI HANDLER --------
class CrudUIManager {
  constructor({ client, fields, listElement, formElements, formatItem }) {
    this.client = client;
    this.fields = fields; // [{name, input, parser?, formatter?}]
    this.listElement = listElement;
    this.formElements = formElements; // {createBtn, updateBtn, cancelBtn}
    this.editingId = null;
    this.formatItem = formatItem || ((item) => JSON.stringify(item));

    this.init();
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
