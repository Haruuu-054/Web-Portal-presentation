// Import express
const express = require("express");
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 5000;
const moment = require('moment')
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // Parses JSON request bodies

const logger = (req, res, next)=>{
    console.log(`${req.protocol}://${req.get ('host')} ${req.originalUrl}:  ${moment().format()}`)
    next()
}

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger)
app.use(cors())
// Connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'dbenvergancloud',
    debug: true
});

// Initialization of connection
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
        // process.exit(1);
    }
    console.log('Connected to the database');
});

// API - Get all user accounts
app.get("/api/envergancloud/user", (req, res) => {
    // Query the database to fetch all users
    const query = `
        SELECT users.*, roles.role_name, CONCAT(users.first_name, ' ', users.last_name) AS full_name
        FROM users
        JOIN roles ON users.role_id = roles.role_id;
    `;
    connection.query(query, (err, rows) => {
        if (err) {
            console.error("Database query failed:", err.message); // Log the error
            return res.status(500).json({ error: "An error occurred while fetching users." }); // Error response
        }

        // Respond with the retrieved rows
        res.status(200).json(rows);
    });
});


app.get('/api/envergancloud/student', (req, res) => {
    // Query to fetch all student data along with full_name (first_name + last_name)
    connection.query("SELECT student_id, CONCAT(first_name, ' ', last_name) AS full_name, course_name, year_level, password FROM students", (err, rows) => {
        if (err) {
            // Log the error and return a 500 status code for internal server errors
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'An error occurred while fetching student data.' });
        }
        // Send the fetched data as a JSON response
        res.json(rows);
    });
});

// POST route to submit a new transaction
app.post('/api/ledger/amount_paid', (req, res) => {
    const { student_id, payment_amount, payment_date, description } = req.body;

    // Query to insert into the ledger table
    const query = `
        INSERT INTO payments (student_id, payment_amount, payment_date, description)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(query, [student_id, payment_amount, payment_date, description], (err, result) => {
        if (err) {
            console.error('Error inserting transaction:', err);
            return res.status(500).json({ error: 'Failed to insert transaction.' });
        }
        res.json({ success: true, message: 'Transaction recorded successfully' });
    });
});
//get all transactions
app.get('/api/envergancloud/transactions', (req, res)=>{
    connection.query("SELECT * FROM payments", (err, rows)=>{
        if(err){
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ error: 'An error occurred while fetching transactions.' });
        }
        res.json(rows);
    })
})
//inserting a new student
app.post("/api/account-register", (req, res) => {
    const { first_name, last_name, course_name, year_level, password } = req.body;

    // Check if all required fields are provided
    if (!first_name || !last_name || !course_name || !year_level || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // SQL query to insert the student data
    const query = `
        INSERT INTO students (first_name, last_name, course_name, year_level, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Safe insertion using parameterized queries
    connection.query(query, [first_name, last_name, course_name, year_level, password], (err, result) => {
        if (err) {
            console.error('Error registering account:', err);
            return res.status(500).json({ error: 'Failed to register account.' });
        }

        res.json({ success: true, message: 'Account registered successfully' });
    });
});

//API for log-in
app.post('/api/login', (req, res) => {
        const { account_id, password } = req.body;
    
        // Input validation
        if (!account_id || !password) {
            return res.status(400).json({
                success: false,
                message: 'User ID and password are required.',
            });
        }
    
        // SQL query to verify user credentials
        const query = `SELECT * FROM users WHERE account_id = ? AND password = ?`;
    
        connection.query(query, [account_id, password], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error.',
                });
            }
    
            if (results.length > 0) {
                const user = results[0]; 
                res.status(200).json({
                    success: true,
                    message: 'Login successful!',
                    user: {
                        account_id: user.account_id,

                    },
                });
            } else {
                // User not found or credentials incorrect
                res.status(401).json({
                    success: false,
                    message: 'Invalid User ID or password.',
                });
            }
        });
    });

    app.post('/api/login', (req, res) => {
        const { account_id, password } = req.body;
    
        // Input validation
        if (!account_id || !password) {
            return res.status(400).json({
                success: false,
                message: 'Account ID and password are required.',
            });
        }
    
        // SQL query to verify user credentials
        const query = `SELECT * FROM users WHERE account_id = ? AND password = ?`;
    
        connection.query(query, [account_id, password], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error.',
                });
            }
    
            // If user exists in the database
            if (results.length > 0) {
                const user = results[0]; // Extract user info from results
                res.status(200).json({
                    success: true,
                    message: 'Login successful!',
                    fullname: `${user.first_name} ${user.last_name}`, // Full name from database
                });
            } else {
                // User not found or credentials incorrect
                res.status(401).json({
                    success: false,
                    message: 'Invalid Account ID or password.',
                });
            }
        });
    });
    
//FOR THE ADMIN
    app.get('/api/GET/admin/:account_id', (req, res) => {
        const { account_id } = req.params;
        const query = `
            SELECT CONCAT(first_name, ' ', last_name) AS fullname 
            FROM users 
            WHERE account_id = ?`;
        
        connection.query(query, [account_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send({ success: false, message: 'Error retrieving admin name' });
                return;
            }
            if (results.length > 0) {
                res.json({ fullname: results[0].fullname });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        });
    });

app.post('/api/logout', (req, res) => { 
    // Clear any session or authentication tokens here if applicable 
    res.json({ success: true, 
     message: 'Logged out successfully' 
    })
})

// Endpoint to handle student login
app.post('/api/student-login', (req, res) => {
    let { student_id, password } = req.body
   
       const query = `SELECT * FROM students WHERE BINARY student_id = ? AND password = ?`
   
       connection.query(query, [student_id, password], (err, results) => {
           if (err) {
               res.status(500).json({
                   success: false,
                   alert: 'Internal Server error!!!'
               })
           } else if (results.length > 0) {
               res.json({
                   success: true,
                   message: 'LogIn Success',
                   
               })
           } else {
               res.json({
                   success: false,
                   alert: 'Invalid student_id or password!!!'
               })
           }
       })
   })
//Showing student_id
app.get('/api/GET/student/:student_id', (req, res) => {
    const { student_id } = req.params;
    const query = `
        SELECT 
            CONCAT(first_name, ' ', last_name) AS fullname, 
            course_name,
            year_level 
        FROM students 
        WHERE student_id = ?`;
    
    connection.query(query, [student_id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send({ success: false, message: 'Error retrieving student data' });
            return;
        }
        if (results.length > 0) {
            res.json({ 
                fullname: results[0].fullname,
                course: results[0].course_name, 
                year_level: results[0].year_level
            });
        } else {
            res.status(404).json({ success: false, message: 'Student not found' });
        }
    });
});

app.get('/api/GET/student/payments/:student_id', (req, res) => {
    const { student_id } = req.params;
    const query = `
    SELECT payment_amount, payment_date, description
    FROM payments
    WHERE student_id = ?`;

    connection.query(query, [student_id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send({ success: false, message: 'Error retrieving your payments data' });
            return;
        }

        if (results.length > 0) {
            // Return all results as an array
            res.json({
                success: true,
                payments: results // Send the entire array of payments
            });
        } else {
            res.status(404).json({ success: false, message: 'No payments found for this student' });
        }
    });
});

app.get('/api/GET/student/balances/:student_id', (req, res) => {
    const { student_id } = req.params;

    const query = `
        SELECT 
            CONCAT(students.first_name, ' ', students.last_name) AS fullname, 
            students.course_name, 
            students.year_level, 
            COALESCE(SUM(payments.payment_amount), 0) AS total_payments,
            tuition_balances.remaining_balance
        FROM students
        LEFT JOIN payments ON students.student_id = payments.student_id
        LEFT JOIN tuition_balances ON students.student_id = tuition_balances.student_id
        WHERE students.student_id = ?
        GROUP BY students.student_id, tuition_balances.remaining_balance;
    `;

    connection.query(query, [student_id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send({ success: false, message: 'Error retrieving student data' });
            return;
        }

        if (results.length > 0) {
            res.json({
                success: true,
                fullname: results[0].fullname,
                course: results[0].course_name,
                year_level: results[0].year_level,
                total_payments: results[0].total_payments,
                remaining_balance: results[0].remaining_balance,
            });
        } else {
            res.status(404).json({ success: false, message: 'Student not found' });
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});