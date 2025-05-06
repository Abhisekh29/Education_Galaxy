document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      alert(data.message);
  
      if (res.ok) {
        // Redirect based on role
        if (data.role === 'student') {
          localStorage.setItem('studentId', data.student._id);
          localStorage.setItem('studentName', data.student.name);
          window.location.href = '/pages/student/dashboard.html';
        } else if (data.role === 'teacher') {
          window.location.href = '/pages/teacher/dashboard.html';
        }
      }
  
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login failed. Please try again.');
    }
  });
  