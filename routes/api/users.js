const express = require("express");
const passport = require("passport");
const router = express.Router();

/* GET home page. */

router.get("/", function (req, res, next) {
  res.send("Get Route for Users");
});

// router.get("/current", function (req, res, next) {
//   res.json({ msg: "GET Profile" });
// });

module.exports = router;
