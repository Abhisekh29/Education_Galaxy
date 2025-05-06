const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Route to create a new course
router.post('/create', courseController.createCourse);

// Route to fetch all courses
router.get('/all', courseController.getAllCourses);

// DELETE route to remove a course by ID
router.delete('/:id', courseController.deleteCourse);

// Route to get a single course by ID
router.get('/:id', courseController.getCourseById);

module.exports = router;
