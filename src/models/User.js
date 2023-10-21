const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//check Database models
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    minLength: [10, "Email at least 10"],
  },

  userName: {
    type: String,
    required: [true, "Username required"],
    minLength: [3, "Username at least 3"],
  },

  password: {
    type: String,
    required: [true, "Password required"],
    minLength: [4, "Password at least 4"],
  },
});

//validation for username or email (optional)
userSchema.path("email").validate(async (email) => {
  const emailCount = await mongoose.models.User.countDocuments({ email });
  return !emailCount;
}, "Email already exists");

//chech if passowrd == repeatPassword
userSchema.virtual("repeatPassword").set(function (value) {
  if (this.password !== value) {
    throw new Error("Password missmatch!");
  }
});

//hashin password
userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
