//Binds the load button to the getData function
document.getElementById("loadBtn").addEventListener("click", getData);

//Fetches data from backend trough the API endpoint and updates the paragraph text with the response
function getData() {
  fetch("http://localhost:5000/api/quotes")
    .then((response) => response.json())
    .then((data) => {
      data.quotes.forEach((quote) => {
        const listItem = document.createElement("li");
        listItem.textContent = quote;
        document.getElementById("myList").appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error:", error));
}
