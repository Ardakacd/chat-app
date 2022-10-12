const express = require("express");
const router = express.Router();
const { User } = require("../model/userModal");
const Message = require("../model/messageModal");
const MongoSaveError = require("../errors/mongoSaveError");
const validateUser = require("../middleware/userValidation");

router.use(validateUser);

router.post("/", async (req, res, next) => {
  delete req.body.id;
  delete req.body._id;

  try {
    req.body.sender = [req.user.username, req.user.photo];
    const message = new Message(req.body);

    message.save(function (err) {
      if (err) {
        console.log(err);

        if (err.name == "ValidationError") {
          err.message = err.message.replace("Message validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      return res.status(204).json();
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (req.user.username !== req.body.sender) {
      let error = new Error("You cannot delete others messages!");
      error.statusCode = 403;
      return next(error);
    }

    await Message.deleteOne({ _id: req.params.id });

    res.status(204).json();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
