async function fetchTransactions() {
    try {
        // Sending a GET request to fetch all transactions from the correct endpoint
        const response = await fetch('http://localhost:5000/api/transactions');  // Correct endpoint
        
        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        // Parse the response body as JSON
        const data = await response.json();

        if (data.transactions) {
            const transactionsTable = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
            transactionsTable.innerHTML = ''; // Clear previous rows

            // Loop through the transactions and append them to the table
            data.transactions.forEach(transaction => {
                const row = transactionsTable.insertRow();
                row.innerHTML = `
                    <td>${transaction.user_id}</td>
                    <td>${transaction.scheme_id}</td> <!-- Added scheme_id -->
                    <td>${transaction.transaction_date}</td>
                    <td>${transaction.amount_paid}</td>
                    <td>${transaction.description}</td>
                `;
            });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        alert('Failed to fetch transactions');
    }
}

// Fetch transactions when the page loads
fetchTransactions();