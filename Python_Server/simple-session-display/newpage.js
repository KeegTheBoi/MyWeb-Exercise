const routes = {
  homeBtn: "index.html",
};

//Binds the navigation buttons to their respective pages
function navigationSetup() {
  Object.keys(routes).forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location = routes[btnId];
      });
    }
  });
}

let innerValue = "";

function setInnerValue(value) {
  innerValue = value;
}

function concatInnerValue(newValue) {
  innerValue += newValue;
}

function getInnerValue() {
  return innerValue;
}

function setLocalStorageValue() {
  setInnerValue(localStorage.getItem("globalValue") || ""); // Get the value from localStorage and set it to innerValue
  localStorage.setItem(
    "globalValue",
    " ← (index.html data) + This is a global variable from newpage.js",
  );
}

function modifyGlobalValue() {
  setLocalStorageValue();
  concatInnerValue(localStorage.getItem("globalValue")); // means we are concatenating the value from index.html with the new value from newpage.js
}

document.addEventListener("DOMContentLoaded", () => {
  navigationSetup();
  modifyGlobalValue();
  document.getElementById("contentPara").innerText = getInnerValue();
});
