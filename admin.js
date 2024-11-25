
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const content1 = document.getElementById('profile1');
const content2 = document.getElementById('profile2');

 // Add event listeners to buttons
button1.addEventListener('click', function() {
    profile1.style.display = 'block';  // Show content 1
    profile2.style.display = 'none';   // Hide content 2
});

button2.addEventListener('click', function() {
    profile2.style.display = 'block';  // Show content 2
    profile1.style.display = 'none';   // Hide content 1
});
document.getElementById("staffBtn").addEventListener("click", function() {
    var staffSection = document.getElementById("staffContent");
    var studentSection = document.getElementById("studentContent");

    // Toggle the visibility of staff content
    if (staffSection.style.display === "none" || staffSection.style.display === "") {
        staffSection.style.display = "block";
        studentSection.style.display = "none"; // Hide student section
    } 
});

document.getElementById("studentBtn").addEventListener("click", function() {
    var staffSection = document.getElementById("staffContent");
    var studentSection = document.getElementById("studentContent");

    // Toggle the visibility of student content
    if (studentSection.style.display === "none" || studentSection.style.display === "") {
        studentSection.style.display = "block";
        staffSection.style.display = "none"; // Hide staff section
    } 
});
