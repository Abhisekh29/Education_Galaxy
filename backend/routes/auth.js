const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Register Student
router.post('/register/student', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if student already exists
  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    return res.status(400).send({ message: 'Student already exists!' });
  }

  const newStudent = new Student({ name, email, password });
  await newStudent.save();
  res.send({ message: 'Student registered successfully!' });
});

// Register Teacher (Only one allowed)
router.post('/register/teacher', async (req, res) => {
  const { name, email, password, expertise } = req.body;

  // Check if any teacher already exists
  const existingTeachers = await Teacher.find();
  if (existingTeachers.length > 0) {
    return res.status(403).send({ message: 'A teacher (admin) already exists!' });
  }

  const newTeacher = new Teacher({ name, email, password, expertise, isAdmin: true });
  await newTeacher.save();
  res.send({ message: 'Admin teacher account created successfully!' });
});

// Login (shared)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Try student login
  const student = await Student.findOne({ email, password });
  if (student) {
    return res.send({ role: 'student', message: 'Login successful', 
      student: {
      _id: student._id,
      name: student.name,
      email: student.email
    }});
  }

  // Try teacher login
  const teacher = await Teacher.findOne({ email, password });
  if (teacher) {
    return res.send({ role: 'teacher', isAdmin: teacher.isAdmin, message: 'Login successful' });
  }

  res.status(401).send({ message: 'Invalid credentials' });
});

module.exports = router;
