const express = require("express");
const router = express.Router();
const ChatRoom = require("../model/chatRoomModal");
const MongoSaveError = require("../errors/mongoSaveError");
const { successResponse } = require("../helper/responseHelper");
const NotFoundError = require("../errors/notFoundError");
const validateUser = require("../middleware/userValidation");
const checkUserExistence = require("../middleware/checkUserExistence");
const multer = require("multer");
var path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "images")); // where to store it
  },
  filename: function (req, file, cb) {
    console.log(file);
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      var err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.code = "filetype"; // to check on file type
      err.statusCode = 400;
      return cb(err);
    } else {
      var day = new Date();
      var d = day.getDay();
      var h = day.getHours();
      var fileNamee = d + "_" + h + "_" + file.originalname;
      console.log("filename produced is: " + fileNamee);
      cb(null, fileNamee);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20971520 }, // Max file size: 20MB
});

router.use(validateUser);

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user._id;

    const rooms = await ChatRoom.find(
      { participants: userId },
      "name isPersonal photo"
    )
      .populate({ path: "participants", select: "username photo" })
      .exec();

    res.status(200).json(
      successResponse({
        data: { rooms },
        result: rooms.length,
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const roomId = req.params.id;

    const room = await ChatRoom.find({ _id: roomId })
      .populate({ path: "messages", select: "content sender createdAt" })
      .populate({ path: "participants", select: "username photo" })
      .exec();

    if (!room) {
      return next(NotFoundError("Room is not found!"));
    }

    res.status(200).json(
      successResponse({
        data: { room },
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", checkUserExistence, async (req, res, next) => {
  delete req.body.id;
  delete req.body._id;
  try {
    if (req.body.isPersonal) {
      let ownerName = req.user.username;
      let otherName = req.participantUserNames[0];

      console.log(req.user.username);
      console.log(req.participantUserNames);

      let creatorPart = ownerName.charAt(0).toUpperCase() + ownerName.slice(1);
      let otherPart = otherName.charAt(0).toUpperCase() + otherName.slice(1);
      req.body.name = `${creatorPart}-${otherPart}`;
    }
    req.body.owner = req.user.username;
    req.participantIds.push(req.user._id);
    req.body.participants = req.participantIds;
    console.log(req.body.participants);
    let room = new ChatRoom(req.body);

    room.save(function (err) {
      if (err) {
        console.log(err);
        if (err.name == "ValidationError") {
          err.message = err.message.replace("ChatRoom validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      res.status(201).json(
        successResponse({
          data: { room },
          message: "New chat room is created!",
        })
      );
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", upload.single("profile"), async (req, res, next) => {
  delete req.body.id;
  try {
    let room = await ChatRoom.findById(req.params.id);
    if (!room) {
      return next(new NotFoundError("Room is not found!"));
    }
    if (room.owner !== req.user.username) {
      let error = new Error("You are not the owner of this chat!");
      error.statusCode = 403;
      return next(error);
    }

    if (req.file?.filename) {
      room.photo = req.file?.filename;
    }
    if (req.body.addParticipant) {
      req.body.addParticipant.forEach((participant) => {
        room.participants.push(participant);
      });
      delete req.body["addParticipant"];
    } else if (req.body.removeParticipant) {
      room.participants.pull(req.body.removeParticipant);
      delete req.body["removeParticipant"];
    }
    Object.keys(req.body).forEach((key) => {
      if (key in room) {
        room[key] = req.body[key];
      }
    });

    room.save(function (err) {
      if (err) {
        console.log(err);
        if (err.name == "ValidationError") {
          err.message = err.message.replace("ChatRoom validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }

      res.status(200).json(
        successResponse({
          data: { room },
          message: "Successfully updated",
        })
      );
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/exit/:id", async (req, res, next) => {
  console.log("Gelfi");
  try {
    let room = await ChatRoom.findById(req.params.id);
    if (!room) {
      return next(new NotFoundError("Room is not found!"));
    }
    let userId = req.user._id;
    if (room.participants.includes(userId)) {
      room.participants.pull(userId);
    } else {
      let error = new Error("You are not the member of this group!");
      error.statusCode = 400;
      return next(error);
    }

    room.save(function (err) {
      if (err) {
        console.log(err);
        if (err.name == "ValidationError") {
          err.message = err.message.replace("ChatRoom validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }

      res.status(200).json(
        successResponse({
          message: "Successfully exited the room",
        })
      );
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let room = await ChatRoom.findOne({ _id: req.params.id }).exec();

    if (!room) {
      return next(new NotFoundError("ChatRoom not found!"));
    }

    if (room.owner !== req.user.username) {
      let error = new Error("You are not the owner of this chat!");
      error.statusCode = 403;
      return next(error);
    }

    await ChatRoom.deleteOne({ _id: req.params.id });

    res.status(204).json();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
