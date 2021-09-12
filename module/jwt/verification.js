const jwt = require("jsonwebtoken");
const { findSingleUser } = require("../../models/modelFunc/user.func");
module.exports.grantAccess = (roles) => {
  return (auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.send({ status: false, err: "Unable to access it" });
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      const userId = verified.id;
      const user = { id: userId };
      const loggedInUser = findSingleUser(user).then((userInformation) => {
        req.userRole = userInformation.Role.name;
        let userRole = userInformation.Role.name;
        if (roles.includes(userRole)) {
          next();
          return;
        }
        res.send({ status: false, err: "You are not eligible for access it" });
      });
    } catch (err) {
      res.send({ status: false, err: "Invalid Token Try again" });
    }
  });
};
