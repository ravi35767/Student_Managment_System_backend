const express = require("express");
const { grantAccess } = require("../jwt/verification");
const router = express.Router();
const controller = require("../controller/user.controller");
/**
 * Login User
 */
router.post("/login", controller.loginUser);
/**
 * Add User
 * This API is only access for admin
 */
router.post("/add", grantAccess(["admin"]), controller.addUser);
/**
 * Add User
 *  @params int limit, int pageNo, int sort
 * Note!
 * If you don't pass any of these parameters it will select default one
 * Sorting Technique
 * 0 = ASC by Id
 * 1 = DESC by Id
 * 2 = ASC by education
 * 3 = DESC by education
 * This API is only access for admin
 */
router.get(
  "/:limit?/:pageNo?/:sort?",
  grantAccess(["admin"]),
  controller.allUsers
);

/**
 * Delete User
 * user id pass as URL paramter
 * This API is only accessable for admin
 */
router.delete("/:userId", grantAccess(["admin"]), controller.deleteUser);
/**
 * update User
 * user id pass as URL paramter
 * This API is only accessable for admin
 */
router.put(
  "/:userId",
  grantAccess(["admin", "Teacher", "Student"]),
  controller.updateUserInfo
);

module.exports = router;
