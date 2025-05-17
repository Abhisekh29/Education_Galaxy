const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Get all quiz submissions for a course
router.get('/course/:courseId/quiz-results', teacherController.getQuizSubmissionsByCourse);

// Get all quiz submissions for a specific quiz
router.get('/quiz/:quizId/results', teacherController.getQuizSubmissionsByQuiz);

module.exports = router;
