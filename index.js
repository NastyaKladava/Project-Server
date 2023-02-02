const express = require("express");
// const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

require("dotenv").config();
// app.use(express.json());
app.use(cors());

const authRoute = require("./routes/auth");

mongoose.set("strictQuery", false);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/auth", authRoute);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log(`App has been started on PORT ${PORT}`));
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}

start();
