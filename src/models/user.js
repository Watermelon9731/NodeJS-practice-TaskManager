const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = require("../../constants/privateKey");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password can not contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a postive number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const that = this;
  const token = jwt.sign({ _id: that._id.toString() }, PRIVATE_KEY.JWT);
  that.tokens = that.tokens.concat({ token });
  await that.save();
  return token;
};

userSchema.methods.getPublicProfile = function () {
  const that = this;
  const userObject = that.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("There is no such email");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Wrong password");
    }

    return user;
  } catch (err) {
    throw new Error("Unable to login");
  }
};

userSchema.pre("save", async function (next) {
  try {
    const that = this;
    if (that.isModified("password")) {
      that.password = await bcrypt.hash(that.password, 8);
    }
    next();
  } catch (err) {
    console.log(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
