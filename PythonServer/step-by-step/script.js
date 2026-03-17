// ---------- DOM REFERENCES ----------
const loadBtn = document.getElementById("loadBtn");
const submitBtn = document.getElementById("submitBtn");
const showListBtn = document.getElementById("showListBtn");

const quoteParagraph = document.getElementById("quoteParagraph");
const quoteInput = document.getElementById("quoteInput");
const responseList = document.getElementById("responseList");

// ---------- API BASE ----------
const API_BASE = "http://localhost:5000/api";

// ---------- EVENT LISTENERS ----------
loadBtn.addEventListener("click", () =>
  fetchAndUpdate(
    "/random_quote",
    (data) => (quoteParagraph.innerText = data.quote),
  ),
);
showListBtn.addEventListener("click", () =>
  fetchAndUpdate("/all_quotes", (data) => updateList(data.quotes)),
);
submitBtn.addEventListener("click", submitQuote);

// ---------- GENERIC FETCH HELPER ----------
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    alert("Server error. Check console.");
  }
}

// ---------- HELPER: fetch and call callback ----------
async function fetchAndUpdate(endpoint, callback, options = {}) {
  const data = await apiRequest(endpoint, options);
  if (data) callback(data);
}

// ---------- SUBMIT QUOTE ----------
async function submitQuote() {
  const quote = quoteInput.value.trim();
  if (!quote) return alert("Quote cannot be empty");

  await fetchAndUpdate("/submit_quote", (data) => updateList(data.quotes), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quote }),
  });

  quoteInput.value = "";
}

// ---------- DELETE / EDIT QUOTE ----------
async function modifyQuote(endpoint, method, payload = null) {
  const options = { method };
  if (payload) options.body = JSON.stringify(payload);
  options.headers = { "Content-Type": "application/json" };

  return await fetchAndUpdate(
    endpoint,
    (data) => updateList(data.quotes),
    options,
  );
}

function deleteQuote(quoteId) {
  modifyQuote(`/delete_quote/${quoteId}`, "DELETE");
}

function editQuote(quoteId) {
  const newQuote = prompt("Enter the new quote:");
  if (!newQuote) return alert("Quote cannot be empty");

  modifyQuote(`/edit_quote/${quoteId}`, "PUT", { quote: newQuote });
}

// ---------- CREATE BUTTONS ----------
function createButton(text, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.addEventListener("click", onClick);
  return btn;
}

// ---------- UPDATE LIST ----------
function updateList(quotes) {
  responseList.innerHTML = "";

  quotes.forEach((item) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${item.index}: ${item.quote}`;

    const actions = document.createElement("div");

    actions.appendChild(createButton("Edit", () => editQuote(item.index)));
    actions.appendChild(createButton("Delete", () => deleteQuote(item.index)));

    li.appendChild(span);
    li.appendChild(actions);
    responseList.appendChild(li);
  });
}
