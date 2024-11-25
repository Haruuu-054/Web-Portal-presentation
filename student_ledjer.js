// Fetch the payments for a specific student (using student_id)
const student_id = localStorage.getItem('student_id'); // Retrieve student_id from localStorage

fetch(`http://localhost:5000/api/GET/student/payments/${student_id}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (data.success && data.payments.length > 0) {
            // Save the payments data to localStorage
            localStorage.setItem('student_payments', JSON.stringify(data.payments));

            // Optionally, display the payments data on the page
            displayPayments(data.payments);
        } else {
            console.log('No payments found for this student');
        }
    })
    .catch((error) => {
        console.error('Error fetching student payment data:', error);
    });

// Function to display payments data in the HTML
function displayPayments(payments) {
    const paymentsTable = document.getElementById('payments-table');
    let html = '';

    payments.forEach((payment) => {
        html += `
            <tr>
                <td>${payment.payment_amount}</td>
                <td>${payment.payment_date}</td>
                <td>${payment.description}</td>
            </tr>
        `;
    });

    paymentsTable.innerHTML = html;
}

fetch(`http://localhost:5000/api/GET/student/balances/${student_id}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (data.success) {
            // Save the balance data to localStorage
            localStorage.setItem('student_balance', JSON.stringify({
                total_payments: data.total_payments,
                remaining_balance: data.remaining_balance,
            }));

            // Display the balance data on the page
            displayBalance(data);
        } else {
            console.log('Student not found');
        }
    })
    .catch((error) => {
        console.error('Error fetching student balance data:', error);
    });

// Function to display balance data in the HTML
function displayBalance(data) {
    // Update elements in your HTML to display the student balance information
    document.getElementById('remaining_balance').textContent = data.remaining_balance;
}
