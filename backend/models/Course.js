const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  videos: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true }, // Embedded YouTube link
    },
  ],
  quizzes: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      questions: [
        {
          question: { type: String, required: true },
          options: { type: [String], required: true }, // Array of 4 options
          correctAnswer: { type: Number }, // (0,1,2,3) index of correct option
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
