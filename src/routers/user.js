const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();

    await user.save();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user: user.getPublicProfile(), token });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ message: "You has been logout from this device" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/logout-all", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: "You has been logout from all device login" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send("Can not found");
  }

  try {
    updates.forEach((detail) => (req.user[detail] = req.body[detail]));

    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.patch("/users/id", async (req, res) => {
  if (!req.query.user) {
    return res.status(404).send("Can not found");
  }
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const user = await User.findById(req.query.user);

    updates.forEach((detail) => {
      user[detail] = req.body[detail];
    });

    await user.save();

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/users/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send({ message: "You had been remove", user: req.user });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/id", async (req, res) => {
  try {
    if (!req.query.user) {
      return res.status(404).send("Can not found");
    }
    const user = await User.findByIdAndDelete(req.query.user);
    if (!user) {
      return res.status(404).send("Can not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
