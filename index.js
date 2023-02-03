const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

require("dotenv").config();
// app.use(express.json());
app.use(cors());

const authRoute = require("./routes/auth");

app.use("/api/auth", authRoute);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "project-client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "project-client", "build", "index.html")
    );
  });
}

mongoose.set("strictQuery", false);

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
