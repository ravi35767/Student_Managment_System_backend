const db = require("../index");

/**
 * Add User Information
 * @param object UserData
 * @returns new User
 */
module.exports.addUser = async (UserData) => {
  try {
    var User = await db.User.create(UserData);
  } catch (err) {
    console.log(err);
  }
  return User;
};

/**
 * Retrive All Users with pagination and sorting
 * @param int limit
 * @param int page
 * @param int sortingTechniquw
 * @returns users
 */

module.exports.allUsers = async (limit, page, sortingTechnique) => {
  const perPageUserLimit = limit;
  let technique = ["id", "ASC"];
  if (sortingTechnique == 0) {
    technique = ["id", "ASC"];
  } else if (sortingTechnique == 1) {
    technique = ["id", "DESC"];
  } else if (sortingTechnique == 2) {
    technique = ["name", "ASC"];
  } else if (sortingTechnique == 3) {
    technique = ["name", "DESC"];
  }
  try {
    var allUsers = await db.User.findAndCountAll({
      limit: perPageUserLimit,
      offset: page * limit, // Skip Two records
      order: [technique],
      include: db.Role,
    });
  } catch (err) {
    console.log(err);
  }
  if (allUsers.count > 1) {
    const totalPage = Math.ceil(allUsers.count / perPageUserLimit);
    return { allUsers, totalPage };
  }
  return allUsers;
};

/**
 * Delete User
 * @param int user id
 * @returns delUser
 */

module.exports.deleteUser = async (UserId) => {
  try {
    var delUser = await db.User.destroy({
      where: {
        id: UserId,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return delUser;
};

/**
 * update User
 * @param object basicInfo
 * @param object user id
 * @returns updatedUser
 */

module.exports.updateUser = async (basicInfo, id) => {
  try {
    var updatedUser = await db.User.update(basicInfo, {
      where: {
        id: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return updatedUser;
};

/**
 * Login User
 * @param object UserInfo
 * @returns loginUser
 */

module.exports.loginUser = async (UserInfo) => {
  try {
    var loginUser = await db.User.findOne({
      where: {
        email: UserInfo.email,
        password: UserInfo.password,
      },
      include: db.Role,
    });
  } catch (err) {
    console.log(err);
  }
  return loginUser;
};

/**
 * Return Single User
 * @param object User
 * @returns loginUser
 */

module.exports.findSingleUser = async (User) => {
  try {
    var singleUser = await db.User.findOne({
      where: {
        id: User.id,
      },
      include: db.Role,
    });
  } catch (err) {
    console.log(err);
  }
  return singleUser;
};
