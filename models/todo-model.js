import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    checked: { type: Boolean, required: true, default: false },
    userId: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
TodoSchema.virtual("user", {
  localField: "userId",
  foreignField: "_id",
  ref: "user",
  justOne: true,
});

export const TodoModel =
  mongoose.models.todo || mongoose.model("todo", TodoSchema);
