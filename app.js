const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const dotenv = require("dotenv");
const usersRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const postsRouter = require("./routes/api/posts");
const jwt = require("jsonwebtoken");

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

// app.use(session({ secret: "cat", resave: false, saveUninitialized: true }));

// app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  console.log(req.user ? req.user : null);
  res.render("index", { user: req.user });
});
app.use("/profile", profileRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", (req, res, next) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "user exists" });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => res.json(user))
        .catch((err) => console.log(err));

      // res.redirect("/");
    });
    // if err, do something
    // otherwise, store hashedPassword in DB
  });
});

app.post("/log-in", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "Incorrect username" });
      bcrypt.compare(req.body.password, user.password).then((isMatched) => {
        console.log("maching passwords");
        if (isMatched) {
          console.log(`we are sending a token : `);
          const payload = { id: user.id, username: user.username };
          jwt.sign(
            payload,
            process.env.SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              return res.json({
                success: true,
                token: "Bearer " + token,
                payload,
              });
            }
          );
        } else {
          res
            .status(400)
            .json({ message: "Incorrect password", body: req.body });
        }
      });
    })
    .catch((err) => console.log(err));
});

app.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "success", user: req.user });
  }
);

app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(3000, () => console.log("app listening on port 3000!"));
