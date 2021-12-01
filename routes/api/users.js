const express = require("express");
const passport = require("passport");
const router = express.Router();

/* GET home page. */

router.get("/", function (req, res, next) {
  res.send("Get Route for Users");
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    res.json({ msg: "you are authentic" });
  })
);

module.exports = router;
