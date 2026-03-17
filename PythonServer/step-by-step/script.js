// ---------- DOM REFERENCES ----------
const loadBtn = document.getElementById("loadBtn");
const submitBtn = document.getElementById("submitBtn");
const showListBtn = document.getElementById("showListBtn");

const quoteParagraph = document.getElementById("quoteParagraph");
const quoteInput = document.getElementById("quoteInput");
const responseList = document.getElementById("responseList");

// ---------- EVENT LISTENERS ----------
loadBtn.addEventListener("click", getRandomQuote);
submitBtn.addEventListener("click", submitQuote);
showListBtn.addEventListener("click", showAllQuotes);

// ---------- API BASE ----------
const API_BASE = "http://localhost:5000/api";

// ---------- GENERIC FETCH HELPER ----------
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    alert("Server error. Check console.");
  }
}

// ---------- GET RANDOM QUOTE ----------
async function getRandomQuote() {
  const data = await apiRequest("/random_quote");
  if (data) {
    quoteParagraph.innerText = data.quote; // Get the quote text from the response
  }
}

// ---------- SHOW ALL QUOTES ----------
async function showAllQuotes() {
  const data = await apiRequest("/all_quotes");

  if (data) {
    updateList(data.quotes);
  }
}

// ---------- SUBMIT QUOTE ----------
async function submitQuote() {
  const quote = quoteInput.value.trim();

  if (!quote) {
    alert("Quote cannot be empty");
    return;
  }

  const data = await apiRequest("/submit_quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote }),
  });

  quoteInput.value = "";
  updateList(data.quotes);
}

//------------- DELETE QUOTE -------------
async function deleteQuote(quoteId) {
  const data = await apiRequest(`/delete_quote/${quoteId}`, {
    method: "DELETE",
  });

  if (data) {
    console.log("Quote deleted:", quoteId);
    updateList(data.quotes);
  }
}

function addDeleteButton(li, quoteId) {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteQuote(quoteId));
  li.appendChild(deleteBtn);
}

function addEditButton(li, quoteId) {
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editQuote(quoteId));
  li.appendChild(editBtn);
}

//------------- EDIT QUOTE -------------
async function editQuote(quoteId) {
  const newQuote = prompt("Enter the new quote:");
  if (!newQuote) {
    alert("Quote cannot be empty");
    return;
  }

  const data = await apiRequest(`/edit_quote/${quoteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote: newQuote }),
  });

  if (data) {
    console.log("Quote edited:", quoteId);
    updateList(data.quotes);
  }
}

// ---------- UPDATE LIST ----------
function updateList(quotesDict) {
  responseList.innerHTML = "";

  quotesDict.forEach((item) => {
    const li = document.createElement("li");
    const itemSpan = document.createElement("span");
    itemSpan.textContent = item.index + ": " + item.quote; // Preserve the quote text in the list item
    li.appendChild(itemSpan);
    addDeleteButton(li, item.index); // Pass the quote ID to the delete button
    addEditButton(li, item.index); // Pass the quote ID to the edit button
    responseList.appendChild(li);
  });
}
