const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  studentName: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  courseTitle: { type: String, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, required: true },
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
