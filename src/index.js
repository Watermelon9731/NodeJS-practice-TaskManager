const express = require("express");
require("./db/mongoose");
const path = require("path");
const hbs = require("hbs");
const bcript = require("bcryptjs");
const app = express();

const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// Local port
const localPort = 5000;

// Setup path file hbs
const publicDirectoryPath = path.join(__dirname, "../public/");
const viewsDirectoryPath = path.join(__dirname, "../templates/views");
const partialsDirectoryPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

app.use(express.json());
app.use(express.static(publicDirectoryPath));
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(localPort, () => {
  console.log(`Server started on port ${localPort}`);
});
