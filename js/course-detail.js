// const courseId = new URLSearchParams(window.location.search).get('courseId');
// const courseDetailContainer = document.getElementById('courseDetailContainer');

// if (!courseId) {
//   alert('Course not found');
//   window.location.href = '/pages/student/student-dashboard.html';
// }

// // Fetch course details
// async function fetchCourseDetails() {
//   try {
//     const response = await fetch(`/api/student/course/${courseId}`);
//     const course = await response.json();
//     renderCourseDetails(course);
//   } catch (error) {
//     console.error('Error fetching course details:', error);
//   }
// }

// // Render course details
// function renderCourseDetails(course) {
//   console.log('Fetched course:', course);
//   courseDetailContainer.innerHTML = `
//     <h2>${course.title}</h2>
//     <p>${course.description}</p>

//     <h3>Course Content</h3>
//     <div class="course-videos">
//       ${course.videos.map(video => `
//         <div class="video-card">
//           <h4>${video.title}</h4>
//           <iframe 
//             src="${video.url}" 
//             frameborder="0" 
//             allowfullscreen>
//           </iframe>
//         </div>
//       `).join('')}
//     </div>

//     <h3>Quizzes</h3>
//     <div class="course-quizzes">
//       ${course.quizzes.map(quiz => `
//         <div class="quiz-card">
//           <h4>${quiz.title}</h4>
//           <p>${quiz.description}</p>
//           <button onclick="takeQuiz('${quiz._id}')">Take Quiz</button>
//         </div>
//       `).join('')}
//     </div>
//   `;
// }



// // Function to open the modal and display the quiz
// function takeQuiz(quizId) {
//   // Get the quiz data (you can modify this part to fetch quiz details from the backend)
//   const quiz = course.quizzes.find(q => q._id === quizId);
  
//   if (!quiz) {
//     alert('Quiz not found');
//     return;
//   }

//   // Create modal HTML dynamically
//   const modalContent = `
//     <div id="quizModal" class="modal">
//       <div class="modal-content">
//         <h2>${quiz.title}</h2>
//         <p>${quiz.description}</p>
        
//         <form id="quizForm">
//           ${quiz.questions.map((question, index) => `
//             <div class="question">
//               <p>${question.question}</p>
//               ${question.options.map((option, optionIndex) => `
//                 <label>
//                   <input type="radio" name="question${index}" value="${optionIndex}">
//                   ${option}
//                 </label>
//               `).join('')}
//             </div>
//           `).join('')}
          
//           <button type="submit">Submit Quiz</button>
//         </form>
        
//         <button onclick="closeModal()">Close</button>
//       </div>
//     </div>
//   `;

//   document.body.insertAdjacentHTML('beforeend', modalContent);
//   document.getElementById('quizForm').addEventListener('submit', (event) => handleQuizSubmit(event, quizId));
// }

// // Function to handle the quiz submission
// async function handleQuizSubmit(event, quizId) {
//   event.preventDefault();
  
//   const answers = [];
  
//   // Collect answers
//   const form = event.target;
//   const formData = new FormData(form);
  
//   formData.forEach((value, key) => {
//     const questionIndex = key.replace('question', '');
//     answers.push({
//       questionId: course.quizzes[quizId].questions[questionIndex]._id,
//       selectedOption: parseInt(value)
//     });
//   });

//   // Send answers to the backend for evaluation
//   try {
//     const response = await fetch(`/api/student/${studentId}/course/${courseId}/quiz/${quizId}/submit`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ answers })
//     });

//     const result = await response.json();
//     alert(`Quiz submitted! You scored: ${result.score}`);
//     closeModal();
//   } catch (error) {
//     console.error('Error submitting quiz:', error);
//   }
// }

// // Function to close the modal
// function closeModal() {
//   const modal = document.getElementById('quizModal');
//   modal.remove();
// }

// // Fetch and display course details
// fetchCourseDetails();



let course = null;  // Declare a global variable to store the course data

const courseId = new URLSearchParams(window.location.search).get('courseId');
const courseDetailContainer = document.getElementById('courseDetailContainer');
// Assuming you have stored studentId in localStorage after login
const studentId = localStorage.getItem('studentId');


if (!courseId) {
  alert('Course not found');
  window.location.href = '/pages/student/student-dashboard.html';
}

// Fetch course details
async function fetchCourseDetails() {
  try {
    const response = await fetch(`/api/student/course/${courseId}`);
    course = await response.json();  // Store the fetched course data in the global variable
    renderCourseDetails(course);
  } catch (error) {
    console.error('Error fetching course details:', error);
  }
}

// Render course details
function renderCourseDetails(courseData) {
  console.log('Fetched course:', courseData);
  courseDetailContainer.innerHTML = `
    <h2>${courseData.title}</h2>
    <p>${courseData.description}</p>

    <h3>Course Content</h3>
    <div class="course-videos">
      ${courseData.videos.map(video => `
        <div class="video-card">
          <h4>${video.title}</h4>
          <iframe 
            src="${video.url}" 
            frameborder="0" 
            allowfullscreen>
          </iframe>
        </div>
      `).join('')}
    </div>

    <h3>Quizzes</h3>
    <div class="course-quizzes">
      ${courseData.quizzes.map(quiz => `
        <div class="quiz-card">
          <h4>${quiz.title}</h4>
          <p>${quiz.description}</p>
          <button onclick="takeQuiz('${quiz._id}')">Take Quiz</button>
        </div>
      `).join('')}
    </div>
  `;
}

// Function to handle taking the quiz
function takeQuiz(quizId) {
  // Find the quiz from the stored course data
  const quiz = course.quizzes.find(q => q._id === quizId);
  
  if (!quiz) {
    alert('Quiz not found');
    return;
  }

  // Create modal HTML dynamically
  const modalContent = `
    <div id="quizModal" class="modal">
      <div class="modal-content">
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
        
        <form id="quizForm">
          ${quiz.questions.map((question, index) => `
            <div class="question">
              <p>${question.question}</p>
              ${question.options.map((option, optionIndex) => `
                <label>
                  <input type="radio" name="question${index}" value="${optionIndex}">
                  ${option}
                </label>
              `).join('')}
            </div>
          `).join('')}
          
          <button type="submit">Submit Quiz</button>
        </form>
        
        <button class="modal-close-btn" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalContent);
  document.getElementById('quizForm').addEventListener('submit', (event) => handleQuizSubmit(event, quizId));
}

// Function to handle the quiz submission
async function handleQuizSubmit(event, quizId) {
  event.preventDefault();

  // Find the quiz by its ID from the course data
  const quiz = course.quizzes.find(q => q._id === quizId); // Find quiz by _id
  
  if (!quiz) {
    alert('Quiz not found');
    return;
  }

  const answers = [];

  // Collect answers
  const form = event.target;
  const formData = new FormData(form);
  
  formData.forEach((value, key) => {
    const questionIndex = key.replace('question', '');
    // Get the question by its index
    const question = quiz.questions[questionIndex];
    
    if (question) {
      answers.push({
        questionId: question._id, // Assuming questions have _id
        selectedOption: parseInt(value)
      });
    }
  });

  // Send answers to the backend for evaluation
  try {
    const response = await fetch(`/api/student/${studentId}/course/${courseId}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    
    const result = await response.json();
    alert(`Quiz submitted! You scored: ${result.score}`);
    closeModal();
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
}


// Function to close the modal
function closeModal() {
  const modal = document.getElementById('quizModal');
  modal.remove();
}

// Fetch and display course details
fetchCourseDetails();
