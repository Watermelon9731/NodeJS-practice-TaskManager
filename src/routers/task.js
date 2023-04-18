const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

router.get("/tasks/all", auth, async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(404).send({ message: "There are no tasks" });
    }
    res.status(200).send(tasks);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    if (!tasks) {
      return res.status(404).send({ message: "Empty" });
    }
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid update" });
  }

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach((detail) => {
      task[detail] = req.body[detail];
    });

    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
