const API_URL = "https://todos-dqmy.onrender.com/todos";

async function fetchTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();

  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${todo.title}</strong>: ${todo.description}
      <button onclick="deleteTodo('${todo._id}')">🗑️</button>
    `;
    todoList.appendChild(li);
  });
}

document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, description })
  });

  document.getElementById("todoForm").reset();
  fetchTodos();
});

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTodos();
}

window.onload = fetchTodos;
