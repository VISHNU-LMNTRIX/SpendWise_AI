// Retrieve expenses from local storage or initialize an empty array
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const productInput = document.getElementById("productInput");
const priceInput = document.getElementById("priceInput");
const expenseList = document.getElementById("expenseList");
const expenseCount = document.getElementById("expenseCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
let prompt = document.getElementById("prompt");
let askButton = document.getElementById("askButton");
let results = document.getElementById("results");
const options = { month: 'short', day: 'numeric' };

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addExpense);
    priceInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents default Enter key behavior
        addExpense();
      }
    });
    deleteButton.addEventListener("click", deleteAllExpenses);
    displayExpenses();
});

function addExpense() {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', options);
    const newExpense = dateString + " : " + productInput.value.trim() + " - " + priceInput.value.trim() + "Rs";
    if (newExpense !== "") {
      expenses.push({ text: newExpense });
      saveToLocalStorage();
      productInput.value = "";
      priceInput.value = "";
      displayExpenses();
    }
}

function displayExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach((item, index) => {
      const p = document.createElement("p");
      p.innerHTML = `
        <div class="expense-container">
          <p id="expenses-${index}" onclick="editExpense(${index})">${item.text}</p>
        </div>
      `;
      expenseList.appendChild(p);
    });
    expenseCount.textContent = expenses.length;
}

function editExpense(index) {
    const expenseItem = document.getElementById(`expenses-${index}`);
    const existingText = expenses[index].text;
    const inputElement = document.createElement("input");
  
    inputElement.value = existingText;
    expenseItem.replaceWith(inputElement);
    inputElement.focus();
  
    inputElement.addEventListener("blur", function () {
      const updatedText = inputElement.value.trim();
      if (updatedText) {
        expenses[index].text = updatedText;
        saveToLocalStorage();
      }
      displayExpenses();
    });
}
  
function deleteAllExpenses() {
    expenses = [];
    saveToLocalStorage();
    displayExpenses();
}
  
function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


askButton.addEventListener("click",async()=>{
    let contentString = expenses.map(item => item.text).join(', ');

    let promptValue = prompt.value;

    let promptString = "Here is a list of expenses incurred:\n" + contentString + ". It contains the items purchased and contains the price of each item purchased. Now Answer me this question:\n " + promptValue;

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
