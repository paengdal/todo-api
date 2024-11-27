import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt과 updatedAt을 생성하고 관리
  }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
