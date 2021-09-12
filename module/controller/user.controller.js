const userModel = require("../../models/modelFunc/user.func");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { updateInformation } = require("../../models/modelFunc/teacher.func");
const { updateStuInformation } = require("../../models/modelFunc/student.func");

/**
 * Add User
 */
module.exports.addUser = (req, res) => {
  let userData = req.body.userData;
  if (userData.roleId && !Number.isNaN(userData.roleId)) {
    userModel
      .addUser(userData)
      .then((succ) => {
        res.send({ status: true, save: true, userInfo: succ });
      })
      .catch((err) => {
        res.send({ status: false, err: err });
      });
  }
};

/**
 * Retrive all users with pagination or sorting
 */
module.exports.allUsers = async (req, res) => {
  let userPerPageLimit = Number(req.params.limit);
  const pageNum = Number(req.params.pageNo);
  const sortingTechniqueFromUser = Number(req.params.sort);
  let limit = 2;
  let page = 0;
  let sortingTechnique = 0;
  if (
    userPerPageLimit &&
    !Number.isNaN(userPerPageLimit) &&
    userPerPageLimit > 2
  ) {
    limit = userPerPageLimit;
  }
  if (pageNum && !Number.isNaN(pageNum) && pageNum > 0) {
    page = pageNum;
  }
  if (
    sortingTechniqueFromUser &&
    !Number.isNaN(sortingTechniqueFromUser) &&
    sortingTechniqueFromUser >= 0
  ) {
    sortingTechnique = sortingTechniqueFromUser;
  }
  try {
    let users = await userModel.allUsers(limit, page, sortingTechnique);
    res.send({ status: true, found: users });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * Delete User
 */

module.exports.deleteUser = async (req, res) => {
  try {
    let deletedUser = await userModel.deleteUser(req.params.userId);
    res.send({ status: true, delete: true });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * Update User basic information as well as Meta information
 */
module.exports.updateUserInfo = async (req, res) => {
  const userData = req.body.userData;
  const userRole = req.body.userData.metaInfo.role;
  const userMetaData = req.body.userData.metaInfo;
  const basicInfo = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  };
  try {
    let basicUpdate = await userModel.updateUser(basicInfo, req.params.userId);
    let advanceUpdate;
    switch (true) {
      case userRole == req.userRole && req.userRole == "Teacher":
        advanceUpdate = await updateInformation(
          userMetaData,
          req.params.userId
        );
        break;
      case userRole == req.userRole && req.userRole == "Student":
        console.log("Inside Stu");
        advanceUpdate = await updateStuInformation(
          userMetaData,
          req.params.userId
        );
        break;
    }
    res.send({ status: true, save: true, data: advanceUpdate });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * Login User
 */
module.exports.loginUser = (req, res) => {
  const userData = req.body.userData;
  if (userData.password.length < 6) {
    res.send({ status: false, Password: "Password Length too short" });
  }
  userModel
    .loginUser(userData)
    .then((succ) => {
      if (succ.Role.name == userData.role) {
        const user = succ;
        const userId = user.id;
        const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET_KEY, {
          expiresIn: "60m",
        });
        res.send({ status: true, token: token });
      }
      res.send({ status: false, role: "undefined" });
    })
    .catch((err) => {
      res.send({ status: false, err: err });
    });
};
