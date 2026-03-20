// App-specific logic using the generic CrudClient
// This file handles UI interactions and uses the CrudClient for API calls

const API_BASE = "http://localhost:5000/api";
const ENTITY_NAME = "mood"; // Change this for different entities

const client = new CrudClient(API_BASE, ENTITY_NAME);

// DOM references
const itemInput = document.getElementById("itemInput");
const createBtn = document.getElementById("createBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");
const itemList = document.getElementById("itemList");
//Added for mood selection
const selectedMoodList = document.getElementById("moodSelector");

let editingId = null;

// Load and display all items on page load
document.addEventListener("DOMContentLoaded", loadItems);

// Event listeners
createBtn.addEventListener("click", createItem);
updateBtn.addEventListener("click", updateItem);
cancelBtn.addEventListener("click", cancelEdit);

// Functions

//Current date showed as only date without time, but you can adjust it to include time if needed
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // Only date in YYYY-MM-DD format
}

function getSelectedMood() {
  const selectedMood = selectedMoodList.value; // Get the selected mood from the dropdown
  if (!selectedMood) return alert("Please select a mood");
  return selectedMood;
}

async function loadItems() {
  try {
    const items = await client.readAll();
    displayItems(items);
  } catch (error) {
    alert("Failed to load items");
  }
}

function displayItems(moods) {
  itemList.innerHTML = "";
  moods.forEach((mood_entry) => {
    const li = document.createElement("li");

    //Edit here for the mood entry display format, adjust as needed based on your data structure
    li.textContent = `[${mood_entry.date}] (${mood_entry.mood}) → ${mood_entry.note}`; // Assuming 'content' field, adjust as needed

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(mood_entry));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteItem(mood_entry.id));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  });
}

async function createItem() {
  const note = itemInput.value.trim();

  if (!note) return alert("Content cannot be empty");

  try {
    await client.create({
      note: note,
      date: getCurrentDate(),
      mood: getSelectedMood(),
    }); // Adjust fields as needed
    itemInput.value = "";
    loadItems();
  } catch (error) {
    alert("Failed to create item");
  }
}

function startEdit(item) {
  itemInput.value = item.note || ""; // This is editing based on the 'note' field, adjust if your data structure is different
  editingId = item.id;
  createBtn.style.display = "none";
  updateBtn.style.display = "inline";
  cancelBtn.style.display = "inline";
}

async function updateItem() {
  const note = itemInput.value.trim();
  if (!note) return alert("Content cannot be empty");

  try {
    await client.update(editingId, {
      note: note,
      date: getCurrentDate(),
      mood: getSelectedMood(),
    }); // Adjust fields
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
