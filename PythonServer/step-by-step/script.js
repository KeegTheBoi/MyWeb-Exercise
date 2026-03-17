//Binds the load button to the getData function
document.getElementById("loadBtn").addEventListener("click", getData);

document.getElementById("submitBtn").addEventListener("click", submitQuote);

//Fetches data from backend trough the API endpoint and updates the paragraph text with the response
function getData() {
  fetch("http://localhost:5000/api/quote")
    .then((response) => response.json())
    .then((data) => {
      //Get the quote from the response and update the paragraph text
      document.getElementById("quoteParagraph").innerText = data.quote;
    })
    .catch((error) => console.error("Error:", error));
}

function submitQuote() {
  const quoteInput = document.getElementById("quoteInput");
  const quote = quoteInput.value;

  fetch("http://localhost:5000/api/submit_quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        alert(data.message);
      } else {
        console.log("Quote submitted:", data.message);
        quoteInput.value = ""; // Clear the input field
        updateList(data.quotes); // Optionally
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateList(quotes) {
  const responseList = document.getElementById("responseList");
  responseList.innerHTML = ""; // Clear the list

  quotes.forEach((quote) => {
    const listElement = document.createElement("li");
    listElement.innerText = quote;
    responseList.appendChild(listElement);
  });
}
