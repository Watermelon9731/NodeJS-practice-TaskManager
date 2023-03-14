const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

const USER_PASS = require('../constants/userPassword')

const localPort = 5000;
const uri = `mongodb+srv://tdchithinh:${USER_PASS.MONGODB}@watermeloncluster.vwhilci.mongodb.net/?retryWrites=true&w=majority`;
const databaseName = "task-manager";
const client = new MongoClient(uri);
const db = client.db(databaseName);

async function run() {
  try {
    await client.connect();

    await db.command({ ping: 1 });
    console.log("Connect successfully to server");
    const collection = db.collection("users");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

app.listen(localPort, () => {
  console.log(`Server started on port ${localPort}`);
});
