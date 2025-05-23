// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// });

// module.exports = mongoose.model('Student', studentSchema);


const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Student', studentSchema);
