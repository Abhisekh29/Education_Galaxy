// courseController.js
const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, videos, quizzes } = req.body;

    // Simple validation
    if (!title || !description || !videos || videos.length === 0) {
      return res.status(400).json({ message: 'Title, description, and at least one video are required.' });
    }

    const course = new Course({
      title,
      description,
      videos,
      quizzes,
    });

    await course.save();

    res.status(201).json({ message: 'Course created successfully!', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;  // Get the course ID from the URL params
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
