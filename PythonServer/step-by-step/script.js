//Binds the load button to the getData function
document.getElementById("loadBtn").addEventListener("click", getData);

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
