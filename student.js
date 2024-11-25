document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        // Remove 'active' class from all links
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        // Add 'active' class to the clicked link
        this.classList.add('active');
    });
});

const profile = document.getElementById('nav-profile');
const grades = document.getElementById('nav-grade');
const ledger = document.getElementById('nav-ledger');
const enroll_subject = document.getElementById('nav-register');

const view_profile = document.getElementById('scrollspyHeading1');
const view_subject = document.getElementById('scrollspyHeading2');
const view_grade = document.getElementById('scrollspyHeading3');
const view_ledger = document.getElementById('scrollspyHeading4'); // Fixed typo here

// Function to reset display of all views
function resetViews() {
    view_profile.style.display = 'none';
    view_grade.style.display = 'none';
    view_subject.style.display = 'none';
    view_ledger.style.display = 'none';
}

// Event listeners for nav links
profile.addEventListener('click', function() {
    resetViews();
    view_profile.style.display = 'block';
});

grades.addEventListener('click', function() {
    resetViews();
    view_grade.style.display = 'block';
});

ledger.addEventListener('click', function() {
    resetViews();
    view_ledger.style.display = 'block';
});

enroll_subject.addEventListener('click', function() {
    resetViews();
    view_subject.style.display = 'block';
});

// Set initial display
resetViews();
view_profile.style.display = 'block';

// Dropdown functionality
document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedValue = this.getAttribute('data-value');
        document.getElementById('dropdown-button').innerText = selectedValue;
        // Uncomment if you want to show the selected value somewhere
        // document.getElementById('selected-value').innerText = `Selected: ${selectedValue}`;
    });
});