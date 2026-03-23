let isLogin = false;

function toggleForm() {
  isLogin = !isLogin;

  document.getElementById("title").innerText = isLogin ? "Login" : "Register";
  document.querySelector("button").innerText = isLogin ? "Login" : "Register";
  document.querySelector(".toggle").innerText = isLogin
    ? "Don't have an account? Register"
    : "Already have an account? Login";
}

function handleAuth() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  if (isLogin) loginUser(username, password);
  else registerUser(username, password);
}

function registerUser(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.username === username)) {
    alert("User exists");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered!");
}

function loginUser(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Invalid login");
    return;
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
}

function goTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

let currentUser = localStorage.getItem("currentUser");

if (!currentUser && location.pathname !== "/index.html") {
  window.location.href = "index.html";
}

if (document.getElementById("user")) {
  document.getElementById("user").innerText = currentUser;
}

function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input) return;

  let todos = JSON.parse(localStorage.getItem(currentUser + "_todos")) || [];

  todos.push(input.value);
  localStorage.setItem(currentUser + "_todos", JSON.stringify(todos));

  input.value = "";
  loadTodos();
}

function loadTodos() {
  const list = document.getElementById("todoList");
  if (!list) return;

  list.innerHTML = "";

  let todos = JSON.parse(localStorage.getItem(currentUser + "_todos")) || [];

  todos.forEach((t, i) => {
    list.innerHTML += `<li>${t} <button onclick="deleteTodo(${i})">X</button></li>`;
  });
}

function deleteTodo(i) {
  let todos = JSON.parse(localStorage.getItem(currentUser + "_todos")) || [];
  todos.splice(i, 1);
  localStorage.setItem(currentUser + "_todos", JSON.stringify(todos));
  loadTodos();
}

loadTodos();

function generateSubjects() {
  const n = document.getElementById("numSubjects").value;
  const container = document.getElementById("subjectsContainer");

  container.innerHTML = "";

  for (let i = 0; i < n; i++) {
    container.innerHTML += `
      <div>
        <input placeholder="Subject Name">
        <input type="number" placeholder="Credit (0 if no credit)">
        <input type="number" placeholder="Marks">
      </div>
    `;
  }
}

function calculateGPA() {
  const rows = document.getElementById("subjectsContainer").children;

  let totalCredits = 0;
  let weightedMarks = 0;

  for (let row of rows) {
    const inputs = row.getElementsByTagName("input");

    const credit = parseFloat(inputs[1].value);
    const marks = parseFloat(inputs[2].value);

    if (credit > 0) {
      totalCredits += credit;
      weightedMarks += marks * credit;
    }
  }

  const gpa = (weightedMarks / totalCredits).toFixed(2);

  document.getElementById("result").innerText =
    "Your Credit Score: " + gpa;
}