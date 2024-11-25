// Handle login form submission
document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the value of UserId and Password
    let account_id = document.getElementById('account_id').value.trim();
    const password = document.getElementById('password').value.trim();

    // Convert account_id to uppercase
    account_id = account_id.toUpperCase();

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_id, password })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                // Save user ID to localStorage for later use
                localStorage.setItem('account_id', account_id);
                window.location.href = 'admin.html';
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

async function logout() {
    try {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            mode: 'cors', // Ensure CORS mode is enabled
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                // Clear localStorage and redirect to login page
                localStorage.removeItem('account_id');
                window.location.href = 'Adminlogin.html';
            } else {
                alert('Log out failed: ' + result.message);
            }
        } else {
            alert(`Log out failed. Server responded with status ${response.status}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        console.error('Error:', error);
    }
}

