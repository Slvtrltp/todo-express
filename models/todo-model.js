import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  checked: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
});

export const TodoModel =
  mongoose.models.todo || mongoose.model("todo", TodoSchema);
