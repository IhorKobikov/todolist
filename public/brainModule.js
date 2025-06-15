const input = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

let tasks = [];

fetchTasks();

addButton.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  const newTask = { text, done: false };
  fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  }).then(() => fetchTasks());
  input.value = "";
});

function fetchTasks() {
  fetch("/api/tasks")
    .then((res) => res.json())
    .then((data) => {
      tasks = data;
      render();
    });
}

function render() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("completed");
    li.textContent = task.text;

    li.addEventListener("click", () => {
      task.done = !task.done;
      fetch(`/api/tasks/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).then(() => fetchTasks());
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Erase";
    delBtn.className = "deleteButton";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fetch(`/api/tasks/${index}`, { method: "DELETE" }).then(() =>
        fetchTasks()
      );
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}
