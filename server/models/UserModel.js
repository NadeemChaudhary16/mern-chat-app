const mongoose = require("mongoose");
const { genSalt, hash } = require("bcrypt");
const Schema=mongoose.Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    profileSetup: {
      type: Boolean,
      required: false,
    },
    color: {
      type: Number,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
