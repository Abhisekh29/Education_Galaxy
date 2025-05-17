const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');

// Get all quiz submissions for a course
exports.getQuizSubmissionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const results = await QuizResult.find({ course: courseId })
      .sort({ submittedAt: -1 }); // newest first

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all quiz submissions for a quiz
exports.getQuizSubmissionsByQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const results = await QuizResult.find({ quiz: quizId })
      .sort({ submittedAt: -1 });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
