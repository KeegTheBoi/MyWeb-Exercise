//Binds the load button to the getData function
document.getElementById("loadBtn").addEventListener("click", getData);

const routes = {
  homeBtn: "index.html",
  newPageBtn: "newpage.html",
};

function setUpLocalStorageValue(storeValue) {
  localStorage.setItem("globalValue", storeValue);
  setInnerValue(localStorage.getItem("globalValue"));
}

let innerValue = "";

function setInnerValue(value) {
  innerValue = value;
}

function getInnerValue() {
  return innerValue;
}

function navigationSetup() {
  //Binds the navigation buttons to their respective pages
  Object.keys(routes).forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location = routes[btnId];
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  navigationSetup();
  setUpLocalStorageValue("This is a global variable from index.js");
  document.getElementById("outPara").innerText = getInnerValue();
});

//Fetches data from backend trough the API endpoint and updates the paragraph text with the response
function getData() {
  fetch("http://localhost:5000/api/quote")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("outPara").innerText = data.quote;
      setUpLocalStorageValue(data.quote);
    })
    .catch((error) => console.error("Error:", error));
}
