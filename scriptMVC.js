const TABS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED"
}
const model = {
  //todo {checkedd:boolen, value:string, id:string}
  todoList:{
    allTask: [],
    activeTask: [],
    completedTask: []
  },
  activeTab: TABS.ALL
}

function createId() {
  return new Date().toISOString();
}

function getTodoList(activeTab) {
  if(activeTab === "ALL"){
    return model.todoList.allTask;
  }else if(activeTab === "ACTIVE"){
    return model.todoList.activeTask;
  }else if(activeTab === "COMPLETED"){
    return model.todoList.completedTask;
  }
}

// controllers

function addNewTask() {
  const value = getAddInputValue();
  const checked = false;
  const newId = createId();
  const active = true;
  const modify = false;
  const newTodo = {
    checked: checked,
    value: value,
    id: newId,
    active: active,
    modify: modify
  };

  model.todoList.allTask.push(newTodo);
  updateCompletedTaskList();
  updateActiveTaskList();
  updateView(model.activeTab);
  clearInputValue();
  taskLeft();
}
function updateCompletedTaskList(){
  model.todoList.completedTask = model.todoList.allTask.filter(function(todo){
    return todo.active !== true;
  })
}
function updateActiveTaskList(){
  model.todoList.activeTask = model.todoList.allTask.filter(function(todo){
    return todo.active === true;
  })
}
function deleteAllTasks() {
  model.todoList.allTask = [];
  updateCompletedTaskList();
  updateActiveTaskList();
  updateView(model.activeTab);
  taskLeft();
}

function deleteTaskById(id) {
  const filteredList = model.todoList.allTask.filter(function (todo) {
    return todo.id !== id;
  });
  model.todoList.allTask = filteredList;
  updateCompletedTaskList();
  updateActiveTaskList();
  updateView(model.activeTab);
  taskLeft();
}
function toggleTaskById(id) {
  const newList = model.todoList.allTask.map(function (todo) {
    if (todo.id === id) {
      if (todo.checked === false){
        todo.checked = !todo.checked;
        todo.active = !todo.active;
        return todo;
      }else{
        todo.checked = !todo.checked;
        todo.active = !todo.active;
        return todo;
      }
    } else {
      return todo;
    }
  });
  model.todoList.allTask = newList;
  updateCompletedTaskList();
  updateActiveTaskList();
  updateView(model.activeTab);
  taskLeft();
}
function checkAllTask(){
  const checkedTask = model.todoList.allTask.filter(function(todo){
    return todo.checked === true;
  });
  const nonCheckedTask = model.todoList.allTask.filter(function(todo) {
    return todo.checked === false;
  });
  if (nonCheckedTask.length != 0){
    const checkedAllList = model.todoList.allTask.map(function (todo){
    if (!todo.checked){
      todo.checked = true;
      todo.active = false;
      return todo;
    }else{
      return todo;
      }
    });
  model.todoList.allTask = checkedAllList;
  updateCompletedTaskList();
  updateActiveTaskList();
  updateView(mdoel.activeTab);
  taskLeft();
  }else{
    const checkedAllList = model.todoList.allTask.map(function (todo){
      todo.checked = false;
      todo.active = true;
      return todo;
    });
    model.todoList.allTask = checkedAllList;
    updateCompletedTaskList();
    updateActiveTaskList();
    updateView(model.activeTab);
    taskLeft();
    }
}
function modifyTheTask(id){
  const listNodes = document.querySelectorAll("li");
  let targetNode;
  for (let i = 0; i < listNodes.length; i ++){
    if (listNodes[i].id === id){
      targetNode = listNodes[i];
    }
  }
  // console.log(targetNode.childNodes);
  targetNode.childNodes[2].removeAttribute("type");
  targetNode.childNodes[2].value = targetNode.childNodes[1].innerHTML;
  targetNode.childNodes[1].style = "display:none";
  targetNode.childNodes[0].disabled = true;
}
function enterTheTask(id){
  const listNodes = document.querySelectorAll("li");
  let targetNode;
  for (let i = 0; i < listNodes.length; i ++){
    if (listNodes[i].id === id){
      targetNode = listNodes[i];
    }
  }
  const input = targetNode.childNodes[2];
  input.addEventListener("keyup", function(event){
    if (event.key === "Enter"){
      if (input.value !== ""){
        targetNode.childNodes[1].innerHTML = input.value;
        const newList = model.todoList.allTask.map(function(todo){
          if (todo.id === id){
            todo.value = input.value;
            return todo;
          }else{
            return todo;
          }
        });
        updateCompletedTaskList();
        updateActiveTaskList();
        targetNode.childNodes[1].removeAttribute("style");
        input.setAttribute("type", "hidden");
        targetNode.childNodes[0].disabled = false;
      }
    }
  })
}
function dispalyTheTask(activeTab){
  updateList(activeTab);
}
// views

function getListContainer() {
  return document.querySelector(".list-container");
}

function createTaskNode(value, checked, id, active, modify) {
  const li = document.createElement("li");
  if (active){
    li.setAttribute("class", "active");
  }
  li.id = id;

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.checked = checked; // DOM API to set checked status

  const span = document.createElement("span");
  if (checked) {
    span.classList.add("checked");
  }
  span.innerHTML = value;


  const modifyBar = document.createElement("input");
  modifyBar.setAttribute("class", "listInput");
  modifyBar.setAttribute("placeholder", "Modify the Task!");
  modifyBar.setAttribute("type", "hidden");


  const pencil = document.createElement("i");
  pencil.setAttribute("class", "fa fa-pencil");
  pencil.setAttribute("id", "pencilIcon");

  const div = document.createElement("div");
  div.innerHTML = "&#10005;";
  div.classList.add("delete-icon");

  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(modifyBar);
  li.appendChild(pencil);
  li.appendChild(div);
  return li;
}

function updateList(activeTab) {
  const listContainer = getListContainer();
  localStorage.setItem("allTask", JSON.stringify(model.todoList.allTask));
  localStorage.setItem("activeTab", model.activeTab);
  listContainer.innerHTML = "";

  const todoList = getTodoList(activeTab);
  todoList.forEach(function (todo) {
    if (todo){
      const liNode = createTaskNode(todo.value, todo.checked, todo.id, todo.active, todo.modify);
      listContainer.appendChild(liNode);
    }
  });
}

function updateView(activeTab) {
  updateList(activeTab);
}

function getAddInputValue() {
  const input = document.querySelector(".text-input");
  const inputValue = input.value;
  return inputValue;
}
function clearInputValue(){
  const input = document.querySelector(".text-input");
  input.value = "";
}
function handleContainerClick(e) {
  const target = e.target;
  if (target.classList.contains("delete-icon")) {
    // target is the delete icon div
    const li = target.parentNode;
    const taskId = li.id;
    deleteTaskById(taskId);
    return;
  }
  if (target.getAttribute("id") === "pencilIcon"){
    const li = target.parentNode;
    const taskId = li.id;
    modifyTheTask(taskId);
    enterTheTask(taskId);
    return;

  }
  if (
    target.tagName === "INPUT" &&
    target.getAttribute("type") === "checkbox"
  ) {
    const li = target.parentNode;
    const taskId = li.id;
    toggleTaskById(taskId);
    return;
  }
}
function taskLeft(){
  const taskLeft = document.querySelector(".itemLeft");
  const uncheckedTask = model.todoList.allTask.filter(function (todo){
    return todo.checked === false;
  });
  const displayTaskLeft = `${uncheckedTask.length} items left`;
  taskLeft.innerHTML = displayTaskLeft;
}
function enterNewTask(){
  const input = document.querySelector(".text-input");
  input.addEventListener("keyup", function(event){
    if(event.key === "Enter" && input.value !== ""){
      event.preventDefault();
      document.getElementById("addButton").click();
    }
  });
}
function displayTask(e){
  const target = e.target;
  if (target.classList.contains("allTask")){
    model.activeTab = "ALL";
    updateView(model.activeTab);
    // dispalyAllTask();
  }
  if (target.classList.contains("incompleteTask")){
    model.activeTab = "ACTIVE";
    updateView(model.activeTab);
  }
  if(target.classList.contains("completedTask")){
    model.activeTab = "COMPLETED";
    updateView(model.activeTab);
  }
}
function loadEvents() {
  model.todoList.allTask = JSON.parse(localStorage.getItem("allTask"));
  model.activeTab = localStorage.getItem("activeTab");
  updateView(model.activeTab);
  const addButton = document.querySelector("#addButton");
  const clearAllButton = document.querySelector("#clearButton");
  const listContainer = getListContainer();
  const checkAll = document.querySelector("#checkAllButton");
  const footer = document.querySelector("footer");
  footer.addEventListener("click", displayTask);
  checkAll.addEventListener("click", checkAllTask);
  addButton.addEventListener("click", addNewTask);
  clearAllButton.addEventListener("click", deleteAllTasks);
  listContainer.addEventListener("click", handleContainerClick);
}
enterNewTask();
loadEvents();
