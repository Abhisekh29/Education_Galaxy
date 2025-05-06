const studentId = localStorage.getItem('studentId');
const studentName = localStorage.getItem('studentName');

if (!studentId) {
  alert('Student not logged in');
  window.location.href = '/pages/auth/login.html';
}

const studentNameElement = document.getElementById('studentName');
studentNameElement.textContent = studentName || 'Loading...';

const availableCoursesContainer = document.getElementById('availableCourses');
const enrolledCoursesContainer = document.getElementById('enrolledCourses');

// Fetch all available courses
async function fetchAvailableCourses() {
  try {
    const response = await fetch(`/api/student/courses`);
    const data = await response.json();
    const availableCourses = data.courses;
    renderAvailableCourses(availableCourses);
  } catch (error) {
    console.error('Error fetching available courses:', error);
  }
}

// Render available courses
function renderAvailableCourses(courses) {
  availableCoursesContainer.innerHTML = '';
  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <button class="btn-light" onclick="enrollInCourse('${course._id}')">Enroll</button>
    `;
    availableCoursesContainer.appendChild(courseCard);
  });
}

// Fetch enrolled courses
async function fetchEnrolledCourses() {
  try {
    const response = await fetch(`/api/student/${studentId}/enrolled`);
    const data = await response.json();
    const enrolledCourses = data.enrolledCourses;
    renderEnrolledCourses(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
  }
}

// Render enrolled courses
function renderEnrolledCourses(courses) {
  enrolledCoursesContainer.innerHTML = '';
  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <button class="btn-light" onclick="window.location.href='/pages/student/course-detail.html?courseId=${course._id}'">View Course</button>
      <button class="btn-dark" onclick="unenrollFromCourse('${course._id}')">Unenroll</button>
    `;
    enrolledCoursesContainer.appendChild(courseCard);
  });
}


// Enroll in a course
async function enrollInCourse(courseId) {
  try {
    const response = await fetch(`/api/student/${studentId}/enroll/${courseId}`, {
      method: 'POST',
    });
    const data = await response.json();
    alert(data.message);
    fetchAvailableCourses();  // Refresh available courses
    fetchEnrolledCourses();  // Refresh enrolled courses
  } catch (error) {
    console.error('Error enrolling in course:', error);
  }
}

// Unenroll from a course
async function unenrollFromCourse(courseId) {
  try {
    const response = await fetch(`/api/student/${studentId}/unenroll/${courseId}`, {
      method: 'POST',
    });
    const data = await response.json();
    alert(data.message);
    fetchEnrolledCourses();  // Refresh enrolled courses
  } catch (error) {
    console.error('Error unenrolling from course:', error);
  }
}

// Initial fetch for courses
fetchAvailableCourses();
fetchEnrolledCourses();
