const Student = require('../models/Student');
const Course = require('../models/Course');

// Fetch all available courses
exports.getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find();  // Fetch all courses
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error fetching available courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

// Get enrolled courses for a student
exports.getEnrolledCourses = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById(studentId).populate('enrolledCourses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ enrolledCourses: student.enrolledCourses });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  const { studentId, courseId } = req.params;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // If not already enrolled
    if (!student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
      await student.save();
    }

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unenroll from a course
exports.unenrollFromCourse = async (req, res) => {
  const { studentId, courseId } = req.params;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.enrolledCourses = student.enrolledCourses.filter(
      (id) => id.toString() !== courseId
    );
    await student.save();

    res.status(200).json({ message: 'Unenrolled successfully' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get course details by ID
exports.getCourseById = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit Quiz
const QuizResult = require('../models/QuizResult');

exports.submitQuizResults = async (req, res) => {
  const { studentId, courseId, quizId } = req.params;
  const { answers } = req.body; // Array of answers: [{questionId, selectedOption}, ...]

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = course.quizzes.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Evaluate the answers
    let score = 0;
    answers.forEach(answer => {
      const question = quiz.questions.id(answer.questionId);
      if (question && answer.selectedOption === question.correctAnswer) {
        score++;
      }
    });

    // Save the quiz result with names/titles
    const quizResult = new QuizResult({
      student: studentId,
      studentName: student.name,
      course: courseId,
      courseTitle: course.title,
      quiz: quizId,
      quizTitle: quiz.title,
      score: score,
      total: quiz.questions.length,
      submittedAt: new Date()
    });

    await quizResult.save();

    res.status(200).json({ message: 'Quiz submitted successfully', score });
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
