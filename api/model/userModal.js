const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const chalk = require("chalk");

let userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username field should be filled!"],
    unique: [true, "Username is a unique field!"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "Email field is a unique field!"],
    required: [true, "Email field should be filled!"],
    validate: {
      validator: function (email) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        );
      },
      message: (props) => `${props.value} is not a valid email adress!`,
    },
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password field should be filled!"],
    select: false,
    minLength: [8, "Password should contain at least 8 character!"],
  },
  photo: { type: String, default: "unknown.png" },
  isBanned: { type: Boolean, default: false, select: false },
});

userSchema.pre("save", function (next) {
  console.log(this);
  console.log(this.password && (this.isModified(this.password) || this.isNew));
  if (this.password && (this.isModified(this.password) || this.isNew)) {
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {
      if (err) {
        console.log(chalk.red("Error"));
        console.log(chalk.red(err.message));
        return next(err.message);
      }

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          console.log(chalk.red("Error"));
          console.log(chalk.red(err.message));
          return next(err.message);
        }
        this.password = hash;
        console.log(this.password);

        return next();
      });
    });
  } else {
    return next();
  }
});

exports.User = mongoose.model("User", userSchema);
