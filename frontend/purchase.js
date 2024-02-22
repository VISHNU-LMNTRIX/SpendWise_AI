// Retrieve Items from local storage or initialize an empty array
let purchases = JSON.parse(localStorage.getItem("purchases")) || [];
const purchaseInput = document.getElementById("purchaseInput");
const purchaseList = document.getElementById("purchaseList");
const purchaseCount = document.getElementById("purchaseCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
let prompt = document.getElementById("prompt");
let askButton = document.getElementById("askButton");
let results = document.getElementById("results");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addItem);
    purchaseInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents default Enter key behavior
        addItem();
      }
    });
    deleteButton.addEventListener("click", deleteAllItems);
    displayItems();
});

function addItem() {
    const newItem = purchaseInput.value.trim();
    if (newItem !== "") {
      purchases.push({ text: newItem, disabled: false });
      saveToLocalStorage();
      purchaseInput.value = "";
      displayItems();
    }
}

function displayItems() {
    purchaseList.innerHTML = "";
    purchases.forEach((item, index) => {
      const p = document.createElement("p");
      p.innerHTML = `
        <div class="purchase-container">
          <input type="checkbox" class="purchase-checkbox" id="input-${index}" ${
        item.disabled ? "checked" : ""
      }>
          <p id="purchase-${index}" class="${
        item.disabled ? "disabled" : ""
      }" onclick="editItem(${index})">${item.text}</p>
        </div>
      `;
      p.querySelector(".purchase-checkbox").addEventListener("change", () =>
        toggleItem(index)
      );
      purchaseList.appendChild(p);
    });
    purchaseCount.textContent = purchases.length;
}

function editItem(index) {
    const purchaseItem = document.getElementById(`purchases-${index}`);
    const existingText = purchases[index].text;
    const inputElement = document.createElement("input");
  
    inputElement.value = existingText;
    purchaseItem.replaceWith(inputElement);
    inputElement.focus();
  
    inputElement.addEventListener("blur", function () {
      const updatedText = inputElement.value.trim();
      if (updatedText) {
        purchases[index].text = updatedText;
        saveToLocalStorage();
      }
      displayItems();
    });
}
  
function toggleItem(index) {
    purchases[index].disabled = !purchases[index].disabled;
    saveToLocalStorage();
    displayItems();
}
  
function deleteAllItems() {
    purchases = [];
    saveToLocalStorage();
    displayItems();
}
  
function saveToLocalStorage() {
    localStorage.setItem("purchases", JSON.stringify(purchases));
}


askButton.addEventListener("click",async()=>{
    // Filter items with disabled === false
    let filteredItems = purchases.filter(item => !item.disabled);

    // Extract the text values
    let textValues = filteredItems.map(item => item.text);

    // Concatenate the text values into a single string
    let contentString = textValues.join(', ');

    let promptValue = prompt.value;

    let promptString = "Here is a list of items to be purchased:\n" + contentString + ". It contains the item to be purchased and may contain the quantity of the items to be purchased. Now Answer me this question:\n " + promptValue;

    let question = promptString;
    prompt.value = "";
    let responseDiv = document.createElement("div");
    responseDiv.classList.add("response");
    let questionText = `<p>You: ${promptValue}</p>`;
    responseDiv.innerHTML+=questionText;
    responseDiv.innerHTML+="<p>AI : Let me think...</p>";
    results.appendChild(responseDiv);

    try{
        let res = await fetch("http://localhost:5000/text",{
            method: "POST",
            headers: {'content-type':'application/json'},
            body: JSON.stringify({prompt:question})
        });
        let responseData = await res.json();
        responseDiv.innerHTML = `${questionText}<p>AI : ${responseData.data}</p>`
    }
    catch(error){
        responseDiv.innerHTML = `${questionText}<p>AI : I can't answer that question right now.</p>`;
    }
})
