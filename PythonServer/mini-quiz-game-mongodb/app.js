// App-specific logic using the generic CrudClient
// This file handles UI interactions and uses the CrudClient for API calls

const API_BASE = "http://localhost:5000/api";
const QUIZ_ENTITY_NAME = "quiz"; // Change this for different entities
const USER_ENTITY_NAME = "user"; // Change this for different entities

const quiz_client = new CrudClient(API_BASE, QUIZ_ENTITY_NAME);

//const user_client = new CrudClient(API_BASE, USER_ENTITY_NAME);

//#region Quiz management View Display
// DOM references
const titleInput = document.getElementById("titleInput");
const createBtn = document.getElementById("createBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");
const itemList = document.getElementById("itemList");
//Added for multiple answers
const answerInput = document.getElementById("answerInput");
//Added to give the correct answer a different input field
const correctAnswerInput = document.getElementById("correctAnswerInput");

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

getChoicesFromInput = (input) => {
  return input
    .trim()
    .split(",")
    .map((choice) => choice.trim());
};

function cleanseText() {
  titleInput.value = "";
  correctAnswerInput.value = "";
  answerInput.value = "";
}

async function loadItems() {
  try {
    const items = await quiz_client.readAll();
    displayQuiz(items);
  } catch (error) {
    alert("Failed to load items");
  }
}

function displayQuiz(quizzes) {
  itemList.innerHTML = "";
  quizzes.forEach((quiz_entry) => {
    const li = document.createElement("li");

    //Edit here for the mood entry display format, adjust as needed based on your data structure
    li.textContent = `[${quiz_entry.date}]\n\n (${quiz_entry.title})\n[${quiz_entry.choices.join(", ")}] \nCorrect Answer: ${quiz_entry.correctAnswer}`; // Assuming 'content' field, adjust as needed

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(quiz_entry));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => deleteItem(quiz_entry._id));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  });
}

async function createItem() {
  const title = titleInput.value.trim();

  if (!title) return alert("Content cannot be empty");

  try {
    await quiz_client.create({
      title: title,
      date: getCurrentDate(),
      correctAnswer: correctAnswerInput.value.trim(),
      choices: getChoicesFromInput(answerInput.value),
    }); // Adjust fields as needed
    titleInput.value = "";
    console.log("working");
    loadItems();
  } catch (error) {
    alert("Failed to create item" + error);
  }
}

function startEdit(item) {
  titleInput.value = item.title || ""; // This is editing based on the 'title' field, adjust if your data structure is different
  correctAnswerInput.value = item.correctAnswer || "";
  answerInput.value = item.choices ? item.choices.join(", ") : "";
  editingId = item._id;
  createBtn.style.display = "none";
  updateBtn.style.display = "inline";
  cancelBtn.style.display = "inline";
}

async function updateItem() {
  const note = titleInput.value.trim();
  if (!note) return alert("Content cannot be empty");

  try {
    await quiz_client.update(editingId, {
      note: note,
      date: getCurrentDate(),
      correctAnswer: correctAnswerInput.value.trim(),
      choices: answerInput.value
        .trim()
        .split(",")
        .map((choice) => choice.trim()),
    }); // Adjust fields
    cancelEdit();
    loadItems();
  } catch (error) {
    alert("Failed to update item");
  }
}

function cancelEdit() {
  cleanseText();
  editingId = null;
  createBtn.style.display = "inline";
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
}

async function deleteItem(id) {
  if (!confirm("Are you sure?")) return;

  try {
    await quiz_client.delete(id);
    loadItems();
  } catch (error) {
    alert("Failed to delete item");
  }
}
//#endregion
