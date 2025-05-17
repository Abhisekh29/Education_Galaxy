// document.addEventListener('DOMContentLoaded', () => {
//     const teacherNameSpan = document.getElementById('teacher-name');
//     const coursesContainer = document.getElementById('courses-container');
  
//     // Example: Load teacher name and courses from local storage (or fetch from backend)
//     const teacherName = localStorage.getItem('teacherName') || 'Teacher';
//     teacherNameSpan.textContent = teacherName;
  
//     // Fetch courses (mock for now)
//     const courses = JSON.parse(localStorage.getItem('teacherCourses')) || [];
  
//     function renderCourses() {
//       coursesContainer.innerHTML = '';
  
//       if (courses.length === 0) {
//         coursesContainer.innerHTML = '<p>No courses yet. Click "Create Course" to add one.</p>';
//         return;
//       }
  
//       courses.forEach(course => {
//         const card = document.createElement('div');
//         card.className = 'course-card';
  
//         card.innerHTML = `
//           <h3>${course.name}</h3>
//           <p>${course.description}</p>
//           <div class="course-actions">
//             <a href="#">View Course</a>
//             <a href="#">Manage</a>
//           </div>
//         `;
//         coursesContainer.appendChild(card);
//       });
//     }
  
//     renderCourses();
  
//     // Temporary course creation (mock)
//     document.getElementById('create-course-btn').addEventListener('click', () => {
//       const name = prompt('Course Name:');
//       const description = prompt('Course Description:');
  
//       if (name && description) {
//         courses.push({ name, description });
//         localStorage.setItem('teacherCourses', JSON.stringify(courses));
//         renderCourses();
//       }
//     });
//   });

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.visibility = 'visible';
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.visibility = 'hidden';
  }, 3000);
}

async function deleteCourse(courseId) {
  try {
    const response = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      showToast('Course deleted successfully ✅');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      showToast('Failed to delete course ❌');
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    showToast('Error deleting course ❌');
  }
}

async function viewCourse(courseId) {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    if (!response.ok) throw new Error('Error fetching course');
    const data = await response.json();
    const course = data.course;

    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDescription').textContent = course.description;

    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = '';
    course.videos.forEach((video, index) => {
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '20px';

      const number = document.createElement('h3');
      number.textContent = `Video ${index + 1}:`;
      wrapper.appendChild(number);

      const title = document.createElement('h3');
      title.textContent = video.title;
      title.style.marginBottom = '10px';
      wrapper.appendChild(title);

      const iframe = document.createElement('iframe');
      iframe.setAttribute('width', '420');
      iframe.setAttribute('height', '240');
      iframe.setAttribute('src', video.url);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.style.marginBottom = '15px';
      wrapper.appendChild(iframe);

      videoContainer.appendChild(wrapper);
    });

    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';
    if (course.quizzes.length > 0) {
      course.quizzes.forEach((quiz, index) => {
        const div = document.createElement('div');
        div.style.marginBottom = '30px';
        div.innerHTML = `
          <h3>Quiz ${index + 1}: ${quiz.title}</h3>
          <p>${quiz.description}</p>
          <ul>
            ${quiz.questions.map((q, qIndex) => `
              <li>
                <h3>${q.question}</h3>
                <ul>
                  ${q.options.map((opt, optIdx) => `
                    <li>${opt} ${optIdx === q.correctAnswer ? '(Correct)' : ''}</li>
                  `).join('')}
                </ul>
              </li>
            `).join('')}
          </ul>
        `;
        quizContainer.appendChild(div);
      });
    } else {
      quizContainer.innerHTML = '<p>No quizzes available for this course.</p>';
    }

    document.getElementById('courseModal').style.display = 'block';
  } catch (error) {
    console.error('Error fetching course:', error);
    alert('Failed to fetch course details');
  }
}

function closeModal(event) {
  const modal = document.getElementById('courseModal');
  if (event.target === modal || event.target.classList.contains('close')) {
    modal.style.display = 'none';
  }
}

document.getElementById('courseModal').addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', () => {
  const teacherNameSpan = document.getElementById('teacherName');
  const coursesContainer = document.querySelector('.courses-container');
  const teacherName = "Mr. Abhisekh Roy";
  teacherNameSpan.textContent = teacherName;

  fetchCourses();
  loadCourseOptions();

  async function fetchCourses() {
    try {
      const response = await fetch('/api/courses/all');
      if (!response.ok) throw new Error('Error fetching courses');
      const data = await response.json();
      renderCourses(data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      coursesContainer.innerHTML = '<p>Failed to load courses. Please try again later.</p>';
    }
  }

  function renderCourses(courses) {
    coursesContainer.innerHTML = '';
    if (courses.length === 0) {
      coursesContainer.innerHTML = '<p>No courses yet. Click "Create Course" to add one.</p>';
      return;
    }

    courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-actions">
          <button class="btn-light" onclick="viewCourse('${course._id}')">View Course</button>
          <button class="btn-dark" onclick="deleteCourse('${course._id}')">Delete</button>
        </div>
      `;
      coursesContainer.appendChild(card);
    });
  }
});

async function loadCourseOptions() {
  try {
    const response = await fetch('/api/courses/all');
    const data = await response.json();
    const courses = data.courses;

    const courseSelect = document.getElementById('filterCourse');
    courseSelect.innerHTML = '<option value="">Select a Course</option>';
    courses.forEach(course => {
      const option = document.createElement('option');
      option.value = course._id;
      option.textContent = course.title;
      courseSelect.appendChild(option);
    });

    courseSelect.addEventListener('change', async () => {
      const selectedCourseId = courseSelect.value;
      const quizSelect = document.getElementById('filterQuiz');
      quizSelect.innerHTML = '';

      if (!selectedCourseId) {
        quizSelect.disabled = true;
        quizSelect.innerHTML = '<option value="">Select Course First</option>';
        return;
      }

      const courseRes = await fetch(`/api/student/course/${selectedCourseId}`);
      const courseData = await courseRes.json();

      if (courseData.quizzes && courseData.quizzes.length > 0) {
        quizSelect.disabled = false;
        quizSelect.innerHTML = '<option value="">All Quizzes</option>';
        courseData.quizzes.forEach(quiz => {
          const option = document.createElement('option');
          option.value = quiz._id;
          option.textContent = quiz.title;
          quizSelect.appendChild(option);
        });
      } else {
        quizSelect.disabled = true;
        quizSelect.innerHTML = '<option value="">No quizzes found</option>';
      }
    });
  } catch (error) {
    console.error('Error loading courses for dropdown:', error);
  }
}

// Make loadQuizResults globally accessible
window.loadQuizResults = async function () {
  const courseId = document.getElementById('filterCourse').value;
  const quizId = document.getElementById('filterQuiz').value;

  let endpoint = '';
  if (quizId) {
    endpoint = `/api/teacher/quiz/${quizId}/results`;
  } else if (courseId) {
    endpoint = `/api/teacher/course/${courseId}/quiz-results`;
  } else {
    alert('Please select at least a course to view results.');
    return;
  }

  try {
    const response = await fetch(endpoint);
    const results = await response.json();

    const container = document.getElementById('quizResultsTable');
    if (!results.length) {
      container.innerHTML = '<p>No submissions found.</p>';
      return;
    }

    let html = `<table>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Course</th>
          <th>Quiz</th>
          <th>Score</th>
          <th>Submitted At</th>
        </tr>
      </thead>
      <tbody>`;

    results.forEach(result => {
      html += `<tr>
        <td>${result.studentName}</td>
        <td>${result.courseTitle}</td>
        <td>${result.quizTitle}</td>
        <td>${result.score} / ${result.total}</td>
        <td>${new Date(result.submittedAt).toLocaleString()}</td>
      </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading quiz results:', error);
    alert('Failed to load quiz results.');
  }
};

