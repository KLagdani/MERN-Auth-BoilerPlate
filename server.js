require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const register = require("./routes/register-route");

//ENV
const port = process.env.PORT || 80;

//Express
const app = express();
app.use(bodyParser.json());

//DB
var db = process.env.MongoURI;
if (process.env.NODE_ENV === "production") {
  console.log("Running in prod");
  db = db.concat("prod");
} else if (process.env.NODE_ENV === "test") {
  console.log("Running in test");
  db = db.concat("test");
} else {
  console.log("Running in dev");
  db = db.concat("dev");
}

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//Routes
app.use("/api/register", register);

//Static folder set
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { app };
