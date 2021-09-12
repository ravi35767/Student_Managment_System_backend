const studentMetaModel = require("../../models/modelFunc/student.func");
const {
  singleRegistration,
} = require("../../models/modelFunc/courseRegistration.func");

/**
 * Add Meta Information
 * Student information should be pass as a object named as studentInformation
 */
module.exports.addInformation = async (req, res) => {
  try {
    let studentInformation = req.body.studentInformation;
    studentInformation.joinDate = new Date();
    let studentMetaInformation = await studentMetaModel.addInformation(
      studentInformation
    );
    res.send({ status: true, save: true, studentInfo: studentMetaInformation });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * List Of student Meta Information along with their basic information with pagination and sorting
 */

module.exports.studentsMetaInformation = async (req, res) => {
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
    let informations = await studentMetaModel.studentMetaInformation(
      limit,
      page,
      sortingTechnique
    );
    res.send({ status: true, found: informations });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * Delete Student meta information
 */

module.exports.deleteInformation = async (req, res) => {
  try {
    let deletedInformation = await studentMetaModel.deleteInformation(
      req.params.userId
    );
    res.send({ status: true, delete: true });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * Return Single Student Meta information
 */

module.exports.singleStudentInfo = async (req, res) => {
  try {
    let information = await studentMetaModel.studentInformation(
      req.params.userId
    );
    res.send({ status: true, information: information });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};
/**
 * Check Course Status and Registration Status
 * @param int courseid
 * @returns object courseStatus, registrationStatus
 */

const checkCourseStatus = async (courseid) => {
  let courseStatus = false;
  let registrationStatus = false;
  let todayTime = new Date();
  let todayTimeInSec = Math.ceil(todayTime.getTime() / 1000);
  try {
    let courseDetails = await singleRegistration(courseid);
    let registrationTime = courseDetails.RegistrationTimeLimit;
    let registrationLimitInSec = Math.ceil(registrationTime.getTime() / 1000);
    if (courseDetails.status && courseDetails.status) {
      courseStatus = true;
    }
    if (registrationLimitInSec && todayTimeInSec > registrationLimitInSec) {
      registrationStatus = true;
    }
  } catch (error) {
    console.log(error);
  }
  return { courseStatus, registrationStatus };
};

/**
 * Check via this course is already assigned or not
 * @param int studentid
 * @param int courseId
 * @returns boolean present
 */
const alreadyAsssigned = async (studentid, courseId) => {
  let present = false;
  try {
    let student = await studentMetaModel.enrolledCourses(studentid);
    for (let i = 0; i < student.Course.length; i++) {
      if (student.Course[i].id == courseId) {
        present = true;
        return present;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return present;
};

/**
 * Assign Course to student
 */
module.exports.assignCourse = async (req, res) => {
  const studentid = req.params.studentId;
  const courseid = req.params.courseId;
  const appilcable = await checkCourseStatus(courseid);
  const checkAlreadyApply = alreadyAsssigned(studentid, courseid);
  if (!appilcable.courseStatus) {
    res.send({ status: false, error: "Course is inactive now" });
  }
  if (appilcable.registrationStatus) {
    res.send({ status: false, error: "Registration time is over now" });
  }
  if (checkAlreadyApply) {
    res.send({ status: false, error: "You already Apply of this course " });
  }
  try {
    let assignedCourse = await studentMetaModel.assignCourse(
      studentid,
      courseid
    );
    res.send({ status: true, assiged: true });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};

/**
 * List of enrolled Courses
 */
module.exports.enrolledCourses = async (req, res) => {
  try {
    let enrolledCourses = await studentMetaModel.enrolledCourses(
      req.params.userId
    );
    res.send({ status: true, enrolledCourses: enrolledCourses });
  } catch (error) {
    res.send({ status: false, err: error });
  }
};
