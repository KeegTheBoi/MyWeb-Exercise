//Binds the load button to the getData function
document.getElementById("loadBtn").addEventListener("click", getData);

//Fetches data from backend trough the API endpoint and updates the paragraph text with the response
function getData() {
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("outPara").innerText =
        data.message + " (" + data.status + ")";
    })
    .catch((error) => console.error("Error:", error));
}
