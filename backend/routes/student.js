const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all available courses
router.get('/courses', studentController.getAllCourses);

// Get enrolled courses of a student
router.get('/:studentId/enrolled', studentController.getEnrolledCourses);

// Enroll in a course
router.post('/:studentId/enroll/:courseId', studentController.enrollInCourse);

// Unenroll from a course
router.post('/:studentId/unenroll/:courseId', studentController.unenrollFromCourse);

// Get course by ID
router.get('/course/:courseId', studentController.getCourseById);

// Submit quiz results
router.post('/:studentId/course/:courseId/quiz/:quizId/submit', studentController.submitQuizResults);
// router.post('/student/:studentId/course/:courseId/quiz/:quizId/submit', studentController.submitQuizResults);


module.exports = router;
