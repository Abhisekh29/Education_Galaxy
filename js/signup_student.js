document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3001/api/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await res.json();
      alert(data.message);
  
      if (res.ok) {
        window.location.href = 'login.html';
      }
  
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Something went wrong during signup!');
    }
  });
  