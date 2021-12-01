const express = require("express");
const router = express.Router();
const users_controller = require("../../controllers/userController.js");

router.get("/", function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/sign-up", (req, res) => res.render("sign-up-form"));

router.post("/sign-up", users_controller.users_signup);

router.post("/log-in", users_controller.users_login);

router.get("/current", users_controller.users_current);

module.exports = router;
