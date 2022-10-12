const { verifyToken } = require("../helper/jwtHelper");
const { User } = require("../model/userModal");
const NotFoundError = require("../errors/notFoundError");
const BanError = require("../errors/banError");

const validateUser = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    console.log(token);
    let userId = await verifyToken(token);

    let user = await User.findById(userId).exec();

    if (!user) {
      return next(new NotFoundError("User is not found!"));
    }
    if (!user.isBanned) {
      req.user = user;
      return next();
    } else {
      return next(new BanError());
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = validateUser;
