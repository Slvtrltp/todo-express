import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const fileData = fs.readFileSync("./data.json", "utf-8");

let todos = JSON.parse(fileData);

const updateDataFile = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

app.get("/", (req, res) => {
  return res.send(todos);
});

app.post("/", (req, res) => {
  const body = req.body;
  const name = body.name;
  const newTodo = {
    id: todos[todos.length - 1].id + 1,
    name: name,
    checked: !true,
  };

  todos.push(newTodo);
  updateDataFile();
  return res.send(newTodo);
});
app.get("/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id == id);
  if (!todo) {
    return res.status(404).send({ message: "Not found" });
  }
  updateDataFile();
  return res.send(todo);
});
app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "Not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  updateDataFile();
  return res.send(deletingItem);
});

app.put("/:id", (req, res) => {
  const id = req.params.id;

  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "Not found" });
  }
  const { name, checked } = req.body;
  if (!name || checked !== undefined) {
    return res
      .status(404)
      .send({ message: "Body must have atleast name or checked" });
  }
  const updatedTodo = {
    ...updatingItem,
    ...(name && { name }),
    ...(checked !== undefined && { checked }),
  };
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return updatedTodo;
    }
    return todo;
  });
  updateDataFile();
  return res.send(updatedTodo);
});

// app.put("/:id", (req, res) => {
//   const id = req.params.id;
// });

app.listen(5000, () => {
  console.log("App is running on http://localhost:5000");
});
