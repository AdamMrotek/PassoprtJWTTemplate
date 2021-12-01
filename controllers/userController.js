const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.users_login = (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "Incorrect username" });
      bcrypt.compare(req.body.password, user.password).then((isMatched) => {
        if (isMatched) {
          const payload = { id: user.id, username: user.username };
          jwt.sign(
            payload,
            process.env.SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({ success: true, token: "Bearer " + token, payload });
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
};

exports.users_signup = (req, res) => {
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
    });
  });
};

exports.users_current = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/");
    return res.render("index", { user: user });
  })(req, res, next);
};
