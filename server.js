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
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api/register", register);

//DB
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//Static folder set
app.use(express.static("/client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
