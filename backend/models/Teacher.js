const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  expertise: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Added isAdmin field
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
