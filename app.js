const express = require("express");
const cors = require("cors");
const pixabayRouter = require("./src/routers/pixabay");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  // allow access control from client
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(pixabayRouter); // using pixabayRouter

app.get("/", (req, res) => {
  res.send({ message: "working" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
