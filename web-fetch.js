const userTableContent = document.querySelector("#userTableBody");
const studentTableContent = document.querySelector("#studenttable");
const transactions = document.querySelector("#transactions");
// Loading page
window.addEventListener("load", () => {
    getUser();
    getStudent();
    getTransactions();
});

// Fetch and display user data
function getUser() {
    let html = "";

    fetch("http://localhost:5000/api/envergancloud/user", { mode: "cors" })
        .then((response) => {
            console.log(response);
            return response.json(); // Parse response JSON
        })
        .then((data) => {
            console.log(data);

            // Iterate over the data array and generate HTML for each user
            data.forEach((element) => {
                html += `
                    <tr>
                        <td>${element.user_id}</td>
                        <td>${element.full_name}</td>
                        <td>${element.password}</td>
                        <td>${element.account_id}</td>
                        <td>${element.role_name}</td>
                        <td>${element.created_at}</td>
                    </tr>
                `;
            });

            // Insert generated HTML into the user table content element
            userTableContent.innerHTML = html;
        })
        .catch((error) => {
            console.log("Error fetching user data:", error);
        });
}

// Fetch and display student data
function getStudent() {
    let html = "";

    fetch("http://localhost:5000/api/envergancloud/student", { mode: "cors" }) // Replace with your actual API URL
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // Iterate over the fetched data and generate HTML for each student
            data.forEach((element) => {
                html += `
                    <tr>
                        <td>${element.student_id}</td>
                        <td>${element.full_name}</td>
                        <td>${element.course_name}</td>
                        <td>${element.year_level}</td>
                        <td>${element.password}</td>
                    </tr>
                `;
            });
            // Insert the generated HTML into the student table content element
            studentTableContent.innerHTML = html;
        })
        .catch((error) => {
            console.log("Error fetching student data:", error);
        });
}

//FETCH for inserting transactions in the ledger table
const tuition = document.querySelector('#tuition');
tuition.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page

    let student_id = document.querySelector('#student_id').value;
    let payment_amount = document.querySelector('#payment_amount').value;
    let payment_date = document.querySelector('#payment_date').value;
    let description = document.querySelector('#description').value

    let formData = { student_id, payment_amount, payment_date, description};

    fetch('http://localhost:5000/api/ledger/amount_paid', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Transaction Inserted successfully')
        document.querySelector('#student-transactionForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// FETCH for displaying the transactions
function getTransactions(){
    let html = '';

    fetch("http://localhost:5000/api/envergancloud/transactions", { mode: "cors" }) // Replace with your actual API URL
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then((data) => {
        console.log(data);
        // Iterate over the fetched data and generate HTML for each student
        data.forEach((element) => {
            html += `
                <tr>
                    <td>${element.payment_id}</td>
                    <td>${element.student_id}</td>
                    <td>${element.payment_amount}</td>
                    <td>${element.payment_date}</td>
                    <td>${element.description}</td>
                </tr>
            `;
        });
        // Insert the generated HTML into the student table content element
        transactions.innerHTML = html;
    })
    .catch((error) => {
        console.log("Error fetching student data:", error);
    });
}

const student_register = document.querySelector('#staff-form-btn');
student_register.addEventListener('click', (event) => {
    event.preventDefault();

    // Get values from the form inputs
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let course_name = document.getElementById('course_name').value; // Corrected here to match the key
    let year_level = document.getElementById('year_level').value;
    let password = document.getElementById('password').value;

    // Create the student data object
    let studentData = { first_name, last_name, course_name, year_level, password };

    // Make the fetch call
    fetch('http://localhost:5000/api/account-register', {
        method: 'POST',
        body: JSON.stringify(studentData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            alert('Account Created Successfully');
            // Reset the form if the parent form ID is "register-staff"
            document.querySelector('#register-staff').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


