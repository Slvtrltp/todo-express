import express from "express";

const app = express();
app.use(express.json());

let todos = [{ id: 1, name: "sereh", checked: true }];

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
  return res.send(newTodo);
});
app.get("/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((item) => item.id == id);
  if (!todo) {
    return res.status(404).send({ message: "Not found" });
  }
  return res.send(todo);
});
app.delete("/:id", (req, res)=> {
    
})
app.listen(5000, () => {
  console.log("App is running on http://localhost:5000");
});

