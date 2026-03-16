document.getElementById("loadBtn").addEventListener("click", getData);

function getData() {
  fetch("http://localhost:5000/api/data")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("outPara").innerText =
        data.message + " (" + data.status + ")";
    })
    .catch((error) => console.error("Error:", error));
}
