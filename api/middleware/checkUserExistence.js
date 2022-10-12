const { User } = require("../model/userModal");
const NotFoundError = require("../errors/notFoundError");
const BanError = require("../errors/banError");

const checkUserExistence = async (req, res, next) => {
  let participants = req.body.participants;
  if (!participants) {
    let error = new Error("ChatRoom should have participants!");
    error.statusCode = 400;
    return next(error);
  }

  let participantIds = [];
  let participantUserNames = [];

  await Promise.all(
    participants.map(async (participantUserName) => {
      let user = await User.findOne(
        { username: participantUserName },
        "isBanned"
      ).exec();
      if (!user) {
        return next(
          new NotFoundError("One or more of the users are not found!")
        );
      } else if (user.isBanned) {
        return next(new BanError());
      }
      participantIds.push(user._id);
      participantUserNames.push(participantUserName);
    })
  );

  req.participantIds = participantIds;
  req.participantUserNames = participantUserNames;

  console.log(req.participantIds);
  console.log(req.participantUserNames);

  return next();
};

module.exports = checkUserExistence;
