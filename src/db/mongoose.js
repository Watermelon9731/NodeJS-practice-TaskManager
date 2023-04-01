const mongoose = require("mongoose");
const USER_PASS = require("../../constants/userPassword");
const dbName = "taskManager";
const uriMongo = `mongodb+srv://tdchithinh:${USER_PASS.MONGODB}@watermeloncluster.vwhilci.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const uriLocal = "mongodb:///127.0.0.1:27017/task-manager";

mongoose.connect(uriMongo);
