// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();
// const connectDB = require('./config/db');

// const authRoutes = require('./routes/auth');      // already existing
// const courseRoutes = require('./routes/courseRoutes');  // NEW line

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use('/api', authRoutes);        // /api/signup, /api/login etc
// app.use('/api/courses', courseRoutes);  // /api/courses/create, /api/courses/all etc

// // Test route
// app.get('/', (req, res) => {
//   res.send('Education Galaxy backend is running!');
// });

// // Start Server
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on http://localhost:${process.env.PORT}`);
// });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const app = express();

// Connect to MongoDB
connectDB();

// Serve static files from the root directory (which is outside the 'backend' folder)
app.use(express.static(__dirname + '/../'));  // '..' goes one level up to the root folder

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);           // Authentication routes
app.use('/api/courses', courseRoutes); // Course-related routes
app.use('/api/student', studentRoutes); // Student routes
app.use('/api/teacher', teacherRoutes);  // Teacher routes


// Test route
app.get('/', (req, res) => {
  res.send('Education Galaxy backend is running!');
});

// Start the Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

