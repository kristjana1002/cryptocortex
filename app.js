const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db/db'); // Your database logic
const indexRoutes = require('./routes/index'); // Routes handling

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// EJS template engine
app.set('view engine', 'ejs');

// Routes
app.use('/', indexRoutes);

// Error handling
app.use((req, res) => {
    res.status(404).render('404', { title: '404 - Page Not Found' });
});

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.session.user) {
        return next(); // Continue to the requested route if authenticated
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
}

// Route for Transaction History (only accessible to logged-in users)
app.get('/transactions/history', isAuthenticated, (req, res) => {
    // Example data for transactions (replace with your actual data fetching logic)
    const fetchedTransactions = [
        { date: '2024-11-01', description: 'Grocery', category: 'Food', type: 'Expense', amount: 50 },
        { date: '2024-11-02', description: 'Salary', category: 'Income', type: 'Income', amount: 2000 },
        // Add more sample transactions here
    ];

    // Pass `user` and `transactions` to the view
    res.render('transaction-history', {
        transactions: fetchedTransactions,
        user: req.session.user  // Pass the user object (from session or passport)
    });
});

// Start server (only once)
app.listen(PORT, () => {
    console.log(`CryptoCortex is live at http://localhost:${PORT}`);
});
console.log("Views directory:", path.join(__dirname, 'views'));

app.get('/transactions/history', isAuthenticated, (req, res) => {
    // Example data for transactions (replace with your actual data fetching logic)
    const fetchedTransactions = [
        { date: '2024-11-01', description: 'Grocery', category: 'Food', type: 'Expense', amount: 50 },
        { date: '2024-11-02', description: 'Salary', category: 'Income', type: 'Income', amount: 2000 },
        // Add more sample transactions here
    ];

    // Pass `user` and `transactions` to the view
    res.render('transaction-history', {
        transactions: fetchedTransactions,
        user: req.session.user  // Make sure `user` is coming from session
    });
});
