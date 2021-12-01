const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function signupValidation(data) {
  let errors = {};
  console.log(data);
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  console.log(isEmpty(data.passord2));
  console.log(data);

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "Name must be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.username)) {
    errors.username = "Name is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invaild";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password2 = "Confirm password is required";
  }

  console.log(errors);
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
