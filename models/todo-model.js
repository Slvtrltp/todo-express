import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  checked: { type: Boolean, default: false },
});

export const TodoModel =
  mongoose.models.todo || mongoose.model("todo", TodoSchema);
