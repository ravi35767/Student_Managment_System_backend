const db = require("../index");
/**
 * Add Meta Information
 * @param object studentData
 * @returns meta information
 */

module.exports.addInformation = async (studentData) => {
  try {
    var information = await db.Students.create(studentData);
  } catch (err) {
    console.log(err);
  }
  return information;
};

/**
 * Retrive All Meta Informations with pagination and sorting
 * @param int limit
 * @param int page
 * @param int sortingTechniquw
 * @returns informations
 */

module.exports.studentMetaInformation = async (
  limit,
  page,
  sortingTechnique
) => {
  const informationLimit = limit;
  let technique = ["id", "ASC"];
  if (sortingTechnique == 0) {
    technique = ["id", "ASC"];
  } else if (sortingTechnique == 1) {
    technique = ["id", "DESC"];
  } else if (sortingTechnique == 2) {
    technique = ["class", "ASC"];
  } else if (sortingTechnique == 3) {
    technique = ["class", "DESC"];
  }
  try {
    var allInformation = await db.Students.findAndCountAll({
      limit: informationLimit,
      offset: page * limit, // Skip Two records
      order: [technique],
      include: db.User,
    });
  } catch (err) {
    console.log(err);
  }
  if (allInformation.count > 1) {
    const totalPage = Math.ceil(allInformation.count / perPageUserLimit);
    return { allInformation, totalPage };
  }
  return allInformation;
};

/**
 * Delete Meta information
 * @param int user id
 * @returns deletedInformation
 */
module.exports.deleteInformation = async (id) => {
  try {
    var deleteInformation = await db.Students.destroy({
      where: {
        user_id: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return deleteInformation;
};

/**
 * Return Single student information
 * @param int user id
 * @returns student information
 */

module.exports.studentInformation = async (id) => {
  try {
    var Student = await db.Students.findOne({
      where: {
        user_id: id,
      },
      include: db.User,
    });
  } catch (err) {
    console.log(err);
  }
  return Student;
};

/**
 * Update student meta information
 * @param int user id
 * @param object studentInfo
 * @returns updatedInformation
 */

module.exports.updateStuInformation = async (studentInfo, id) => {
  try {
    var updatedInformation = await db.Students.update(studentInfo, {
      where: {
        user_id: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return updatedInformation;
};

/**
 * Return Student Enrolled Courses
 * @param int user id
 * @returns student with enrolledCourses
 */

module.exports.enrolledCourses = async (studentid) => {
  try {
    var student = await db.Students.findOne({
      where: {
        user_id: studentid,
      },
      include: [
        {
          model: db.Course,
          as: "Course",
        },
        {
          model: db.User,
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
  return student;
};

/**
 * Assign course to student
 * @param int user id
 * @param int course id
 * @returns true
 */

module.exports.assignCourse = async (studentid, courseid) => {
  let courseId = [courseid];
  try {
    var student = await db.Students.findOne({
      where: {
        user_id: studentid,
      },
    });
  } catch (err) {
    console.log(err);
  }
  student.addCourse(courseId);
  return true;
};
