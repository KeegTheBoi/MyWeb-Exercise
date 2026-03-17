// App-specific logic using the generic CrudClient
// This file handles UI interactions and uses the CrudClient for API calls

const API_BASE = "http://localhost:5000/api";
const ENTITY_NAME = "item"; // Change this for different entities

const client = new CrudClient(API_BASE, ENTITY_NAME);

// DOM references
const itemInput = document.getElementById("itemInput");
const createBtn = document.getElementById("createBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");
const itemList = document.getElementById("itemList");

let editingId = null;

// Load and display all items on page load
document.addEventListener("DOMContentLoaded", loadItems);

// Event listeners
createBtn.addEventListener("click", createItem);
updateBtn.addEventListener("click", updateItem);
cancelBtn.addEventListener("click", cancelEdit);

// Functions
async function loadItems() {
  try {
    const items = await client.readAll();
    displayItems(items);
  } catch (error) {
    alert("Failed to load items");
  }
}

function displayItems(items) {
  itemList.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.id}: ${item.content || JSON.stringify(item)}`; // Assuming 'content' field, adjust as needed

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(item));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteItem(item.id));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  });
}

async function createItem() {
  const content = itemInput.value.trim();
  if (!content) return alert("Content cannot be empty");

  try {
    await client.create({ content }); // Adjust fields as needed
    itemInput.value = "";
    loadItems();
  } catch (error) {
    alert("Failed to create item");
  }
}

function startEdit(item) {
  itemInput.value = item.content || ""; // Adjust field
  editingId = item.id;
  createBtn.style.display = "none";
  updateBtn.style.display = "inline";
  cancelBtn.style.display = "inline";
}

async function updateItem() {
  const content = itemInput.value.trim();
  if (!content) return alert("Content cannot be empty");

  try {
    await client.update(editingId, { content }); // Adjust fields
    cancelEdit();
    loadItems();
  } catch (error) {
    alert("Failed to update item");
  }
}

function cancelEdit() {
  itemInput.value = "";
  editingId = null;
  createBtn.style.display = "inline";
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
}

async function deleteItem(id) {
  if (!confirm("Are you sure?")) return;

  try {
    await client.delete(id);
    loadItems();
  } catch (error) {
    alert("Failed to delete item");
  }
}
