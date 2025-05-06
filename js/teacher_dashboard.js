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
  }, 3000); // Hide after 3 seconds
}

async function deleteCourse(courseId) {
  try {
    const response = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      showToast('Course deleted successfully ✅');
      setTimeout(() => {
        window.location.reload();  // Refresh after showing toast
      }, 1500); // wait 1.5 seconds before refreshing
    } else {
      showToast('Failed to delete course ❌');
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    showToast('Error deleting course ❌');
  }
}


// Function to display course details in modal
async function viewCourse(courseId) {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    if (!response.ok) {
      throw new Error('Error fetching course');
    }
    const data = await response.json();
    const course = data.course;

    // Populate modal with course details
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDescription').textContent = course.description;

    // Embed videos with numbering and spacing
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = '';  // Clear previous videos
    course.videos.forEach((video, index) => {
      // Create a div for each video with some margin
      const videoWrapper = document.createElement('div');
      videoWrapper.style.marginBottom = '20px'; // Add space between videos

      // Create and add video number
      const videoNumber = document.createElement('h3');
      videoNumber.textContent = `Video ${index + 1}:`; // Number the videos
      videoWrapper.appendChild(videoNumber);

      // Create video title
      const videoTitle = document.createElement('h3');
      videoTitle.textContent = video.title;  // Display the video title
      videoTitle.style.marginBottom = '10px'; // Add some space below the title
      videoWrapper.appendChild(videoTitle);

      // Embed video with smaller size and some margin below
      const videoEmbed = document.createElement('iframe');
      videoEmbed.setAttribute('width', '420');  // Reduced width for smaller player
      videoEmbed.setAttribute('height', '240');  // Reduced height for smaller player
      videoEmbed.setAttribute('src', video.url); // Access the 'url' property
      videoEmbed.setAttribute('frameborder', '0');
      videoEmbed.setAttribute('allowfullscreen', 'true');
      videoEmbed.style.marginBottom = '15px';  // Add space below the video
      videoWrapper.appendChild(videoEmbed);

      // Append the video wrapper to the video container
      videoContainer.appendChild(videoWrapper);
    });

    // Display quizzes
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';  // Clear previous quizzes
    if (course.quizzes.length > 0) {
      course.quizzes.forEach((quiz, index) => {
        const quizElement = document.createElement('div');
        quizElement.style.marginBottom = '30px';  // Add space between quizzes
        quizElement.innerHTML = `
          <h3>Quiz ${index + 1}: ${quiz.title}</h3>
          <p>${quiz.description}</p>
          <ul>
            ${quiz.questions.map((question, qIndex) => {
              return `
                <li>
                  <h3>${question.question}</h3>
                  <ul>
                    ${question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctAnswer;
                      return `
                        <li>
                          ${option} ${isCorrect ? '(Correct)' : ''}
                        </li>
                      `;
                    }).join('')}
                  </ul>
                </li>
              `;
            }).join('')}
          </ul>
        `;
        quizContainer.appendChild(quizElement);
      });
    } else {
      quizContainer.innerHTML = '<p>No quizzes available for this course.</p>';
    }

    // Show modal
    const modal = document.getElementById('courseModal');
    modal.style.display = 'block';
  } catch (error) {
    console.error('Error fetching course:', error);
    alert('Failed to fetch course details');
  }
}


// Close the modal when clicking outside the modal content or on the close button
function closeModal(event) {
  const modal = document.getElementById('courseModal');
  
  // If the click is outside the modal content or on the close button
  if (event.target === modal || event.target.classList.contains('close')) {
    modal.style.display = 'none';
  }
}

// Add event listener to close the modal when clicking outside or on the close button
document.getElementById('courseModal').addEventListener('click', closeModal);


document.addEventListener('DOMContentLoaded', () => {
  const teacherNameSpan = document.getElementById('teacherName');  // Correct ID here
  const coursesContainer = document.querySelector('.courses-container');

  // Fetch teacher name (can be fetched from backend or local storage if needed)
  const teacherName = "Mr. Abhisekh Roy";  // Static name for now
  teacherNameSpan.textContent = teacherName;

  // Fetch courses from the backend API
  async function fetchCourses() {
      try {
          const response = await fetch('/api/courses/all');
          if (!response.ok) {
              throw new Error('Error fetching courses');
          }
          const data = await response.json();
          const courses = data.courses;

          renderCourses(courses);
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

  // Call the fetchCourses function to load the courses when the page loads
  fetchCourses();
});
