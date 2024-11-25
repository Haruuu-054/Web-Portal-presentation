//handle student-log in form
// Handle login form submission
document.querySelector('#student-login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the value of UserId and Password
    let student_id = document.getElementById('student_id').value.trim();
    const password = document.getElementById('password').value.trim();

    // Convert student_id to uppercase
    student_id = student_id.toUpperCase();

    try {
        const response = await fetch('http://localhost:5000/api/student-login', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, password })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                // Save user ID to localStorage for later use
                localStorage.setItem('student_id', student_id);
                window.location.href = 'student.html';
            } else {
                document.getElementById('loginResult').textContent = result.message;
            }
        } else {
            document.getElementById('loginResult').textContent = 'Failed to log in. Please try again.';
        }
    } catch (error) {
        document.getElementById('loginResult').textContent = 'An error occurred. Please try again.';
        console.error('Error:', error);
    }
});