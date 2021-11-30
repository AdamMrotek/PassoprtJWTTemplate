const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  //   email: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true },
});
// Virtual for author's URL
UserSchema.virtual("url").get(function () {
  return "/user/" + this._id;
});
module.exports = mongoose.model("User", UserSchema);
