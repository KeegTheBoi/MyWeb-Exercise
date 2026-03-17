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
    quoteParagraph.innerText = data.quote;
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

// ---------- UPDATE LIST ----------
function updateList(quotes) {
  responseList.innerHTML = "";

  quotes.forEach((quote) => {
    const li = document.createElement("li");
    li.textContent = quote;
    responseList.appendChild(li);
  });
}
