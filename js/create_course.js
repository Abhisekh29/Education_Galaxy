let videoCount = 0;
let quizCount = 0;

// Convert to embeddable YouTube URL
function convertToEmbedUrl(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^\&\?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function addVideo() {
  const title = document.getElementById("video-title").value.trim();
  const url = document.getElementById("video-url").value.trim();

  if (!title || !url) return alert("Please provide both title and URL");

  const embed = convertToEmbedUrl(url);
  if (!embed) return alert("Invalid YouTube URL");

  const videoList = document.getElementById("videos-list");
  const videoDiv = document.createElement("div");
  videoDiv.className = "video-item";
  videoDiv.innerHTML = `
    <h4>${title}</h4>
    <iframe src="${embed}" frameborder="0" allowfullscreen></iframe>
    <button type="button" onclick="this.parentElement.remove()">Delete Video</button>
  `;
  videoList.appendChild(videoDiv);

  document.getElementById("video-title").value = "";
  document.getElementById("video-url").value = "";
}

function addQuiz() {
  const title = document.getElementById("quiz-title").value.trim();
  const desc = document.getElementById("quiz-description").value.trim();

  if (!title || !desc) return alert("Please provide quiz title and description");

  quizCount++;
  const quizList = document.getElementById("quiz-list");
  const quizDiv = document.createElement("div");
  quizDiv.className = "quiz-item";
  quizDiv.id = `quiz-${quizCount}`;
  quizDiv.innerHTML = `
    <h4>${title}</h4>
    <p>${desc}</p>
    <button type="button" onclick="addQuizQuestion(${quizCount})">Add Question</button>
    <button type="button" onclick="document.getElementById('quiz-${quizCount}').remove()">Delete Quiz</button>
    <div id="quiz-questions-${quizCount}"></div>
  `;
  quizList.appendChild(quizDiv);

  document.getElementById("quiz-title").value = "";
  document.getElementById("quiz-description").value = "";
}

function addQuizQuestion(quizId) {
  const question = prompt("Enter your question:");
  if (!question) return;

  const options = [];
  for (let i = 1; i <= 4; i++) {
    const opt = prompt(`Option ${i}:`);
    if (!opt) return alert("All 4 options are required");
    options.push(opt);
  }

  const correct = parseInt(prompt("Correct option number (1-4):"));
  if (![1,2,3,4].includes(correct)) return alert("Invalid correct option");

  const container = document.getElementById(`quiz-questions-${quizId}`);
  const qDiv = document.createElement("div");
  qDiv.className = "quiz-item";
  qDiv.innerHTML = `
    <p><strong>${question}</strong></p>
    <ul>
      ${options.map((opt, i) => `
        <li>
          <input type="radio" name="quiz-${quizId}-q-${container.children.length}" ${i+1 === correct ? "checked" : ""} disabled />
          ${opt}
        </li>
      `).join("")}
    </ul>
    <button type="button" onclick="this.parentElement.remove()">Delete Question</button>
  `;
  container.appendChild(qDiv);
}

function publishCourse() {
  const courseTitle = document.getElementById("course-title").value.trim();
  const courseDescription = document.getElementById("course-description").value.trim();
  
  // Validation for course title and description
  if (!courseTitle || !courseDescription) {
    return alert("Please provide course title and description!");
  }

  // Gather all videos
  const videoElements = document.querySelectorAll("#videos-list .video-item");
  const videos = Array.from(videoElements).map(video => ({
    title: video.querySelector('h4')?.innerText || '',
    url: video.querySelector('iframe')?.src || ''
  })).filter(video => video.title && video.url);

  if (videos.length === 0) {
    return alert("Please add at least one video!");
  }

  // Gather all quizzes
  const quizElements = document.querySelectorAll("#quiz-list > .quiz-item");
  const quizzes = Array.from(quizElements).map(quiz => {
    const quizTitle = quiz.querySelector('h4')?.innerText || '';
    const quizDescription = quiz.querySelector('p')?.innerText || '';
    
    const questionsList = quiz.querySelectorAll('div ul');
    const questions = Array.from(questionsList).map((ul) => {
      const questionText = ul.previousElementSibling?.innerText || '';
      const options = Array.from(ul.querySelectorAll('li')).map(li => li.innerText.trim());
      const correctOption = Array.from(ul.querySelectorAll('input')).findIndex(input => input.checked); // Adjusted to find correct option (index)

      return {
        question: questionText,
        options,
        correctAnswer: correctOption // Backend expects `correctAnswer`
      };
    });

    return { title: quizTitle, description: quizDescription, questions };
  }).filter(quiz => quiz.title && quiz.description); // Skip empty quizzes

  const courseData = {
    title: courseTitle,
    description: courseDescription,
    videos,
    quizzes
  };

  // Send POST request to backend
  fetch('http://localhost:3001/api/courses/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to create course');
    }
    return res.json();
  })
  .then(data => {
    if (data.message) {
      alert('Course created successfully!');
      window.location.href = '/pages/teacher/dashboard.html'; // Redirect after success
    } else {
      alert('Error creating course: ' + data.message);
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('An error occurred while creating the course.');
  });
}
