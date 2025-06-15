import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "tasks.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/tasks", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "read error" });
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/api/tasks", (req, res) => {
  const task = req.body;
  fs.readFile(dataPath, "utf8", (err, data) => {
    const tasks = data ? JSON.parse(data) : [];
    tasks.push(task);
    fs.writeFile(dataPath, JSON.stringify(tasks, null, 2), () => {
      res.json({ status: "ok" });
    });
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updated = req.body;
  fs.readFile(dataPath, "utf8", (err, data) => {
    let tasks = JSON.parse(data);
    tasks[id] = updated;
    fs.writeFile(dataPath, JSON.stringify(tasks, null, 2), () => {
      res.json({ status: "updated" });
    });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(dataPath, "utf8", (err, data) => {
    let tasks = JSON.parse(data);
    tasks.splice(id, 1);
    fs.writeFile(dataPath, JSON.stringify(tasks, null, 2), () => {
      res.json({ status: "deleted" });
    });
  });
});

app.listen(port, () => {
  console.log(`Server spell activated on http://localhost:${port}`);
});
