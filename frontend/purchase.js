// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
let prompt = document.getElementById("prompt");
let askButton = document.getElementById("askButton");
let results = document.getElementById("results");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents default Enter key behavior
        addTask();
      }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
      todo.push({ text: newTask, disabled: false });
      saveToLocalStorage();
      todoInput.value = "";
      displayTasks();
    }
}

function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
      const p = document.createElement("p");
      p.innerHTML = `
        <div class="todo-container">
          <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
        item.disabled ? "checked" : ""
      }>
          <p id="todo-${index}" class="${
        item.disabled ? "disabled" : ""
      }" onclick="editTask(${index})">${item.text}</p>
        </div>
      `;
      p.querySelector(".todo-checkbox").addEventListener("change", () =>
        toggleTask(index)
      );
      todoList.appendChild(p);
    });
    todoCount.textContent = todo.length;
}

function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");
  
    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);
    inputElement.focus();
  
    inputElement.addEventListener("blur", function () {
      const updatedText = inputElement.value.trim();
      if (updatedText) {
        todo[index].text = updatedText;
        saveToLocalStorage();
      }
      displayTasks();
    });
}
  
function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}
  
function deleteAllTasks() {
    todo = [];
    saveToLocalStorage();
    displayTasks();
}
  
function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}


askButton.addEventListener("click",async()=>{
    // Filter items with disabled === false
    let filteredItems = todo.filter(item => !item.disabled);

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
