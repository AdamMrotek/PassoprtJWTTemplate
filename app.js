const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const usersRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const postsRouter = require("./routes/api/posts");
const jwt = require("jsonwebtoken");

//enviroment values
dotenv.config();

//connecting to db
const mongoDB = process.env.MONGOLAB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(passport.initialize());
require("./config/passport")(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.body);
  next();
});

//Routes
app.get("/", (req, res) => {
  res.redirect("/users");
});

app.use("/profile", profileRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
