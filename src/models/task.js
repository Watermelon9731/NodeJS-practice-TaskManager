const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: { type: Boolean, default: false },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

taskSchema.pre("save", async function (next) {
  try {
    const that = this;
    next();
  } catch (err) {
    console.log(err);
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
