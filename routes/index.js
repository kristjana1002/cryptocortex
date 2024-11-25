const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Home Route
router.get('/', (req, res) => res.render('index'));

// Login Routes
router.get('/login', (req, res) => res.render('login'));
router.post('/login', userController.login);

// Register Routes
router.get('/register', (req, res) => res.render('register'));
router.post('/register', userController.register);

// Dashboard Route (Authenticated)
router.get('/dashboard', auth, (req, res) => res.render('dashboard', { user: req.session.user }));

// Logout Route
router.get('/logout', userController.logout);

// About Route
router.get('/about', (req, res) => res.render('about'));

// Settings Route (Authenticated)
router.get('/settings', (req, res) => {
    if (!req.user) {
        return res.redirect('/login'); // If no user is logged in, redirect to login
    }
    res.render('settings', { user: req.user });
});

// POST route for updating settings
router.post('/settings', (req, res) => {
    const { username, email, password } = req.body;

    // Simulate updating user data (e.g., saving to the database)
    if (username && email) {
        // Logic to update the user's data goes here, like saving it to the database
        // For now, let's just send a success response
        res.json({ success: true, message: 'Account updated successfully!' });
    } else {
        res.json({ success: false, message: 'Username and email are required!' });
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const { fullName, email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match!');
    }

    // Add logic to save user data to your database
    // For now, you can just log the data
    console.log('User Signed Up:', { fullName, email, username });

    // Redirect to the login page or dashboard
    res.redirect('/login');
});

// Sample Transactions Data
// Add this to your routes/index.js file
router.get('views/transaction-histroy', (req, res) => {
    // Example data to display on the page
    const transactions = [
        { date: '2024-11-10', type: 'Deposit', amount: 1000, currency: 'USD' },
        { date: '2024-11-11', type: 'Withdrawal', amount: 500, currency: 'BTC' },
    ];

    res.render('views/transaction-histroy', { transactions }); // Pass data to EJS
});

const transactions = [
    { date: '2024-11-01', description: 'Salary', category: 'income', type: 'Income', amount: 2000 },
    { date: '2024-11-05', description: 'Grocery Shopping', category: 'food', type: 'Expense', amount: -150 },
    { date: '2024-11-10', description: 'Rent Payment', category: 'rent', type: 'Expense', amount: -1200 },
    { date: '2024-11-12', description: 'Bitcoin Investment', category: 'investment', type: 'Expense', amount: -500 },
];

// Route to Render Transaction History
router.get('/transactions/history', (req, res) => {
    res.render('transaction-history', { transactions });
});
router.get('/transaction-history', (req, res) => {
    const transactions = [
        { date: '2024-11-10', type: 'Deposit', amount: 1000, currency: 'USD' },
        { date: '2024-11-11', type: 'Withdrawal', amount: 500, currency: 'BTC' },
    ];

    res.render('transaction-history', { transactions });
});

// Sample Data
let budgets = [
    { category: 'Food', limit: 500, spent: 300 },
    { category: 'Rent', limit: 1200, spent: 1200 },
    { category: 'Entertainment', limit: 200, spent: 50 },
];

// Route to Render Budget Page
router.get('/budgets', (req, res) => {
    res.render('budget', { budgets });
});

// Route to Add or Update Budget
router.post('/budgets/add', (req, res) => {
    const { category, limit } = req.body;
    const budgetIndex = budgets.findIndex(b => b.category === category);

    if (budgetIndex !== -1) {
        // Update existing budget
        budgets[budgetIndex].limit = parseFloat(limit);
    } else {
        // Add new budget
        budgets.push({ category, limit: parseFloat(limit), spent: 0 });
    }

    res.redirect('/budgets');
});

// Route to Delete Budget
router.post('/budgets/delete', (req, res) => {
    const { category } = req.body;
    budgets = budgets.filter(b => b.category !== category);
    res.redirect('/budgets');
});

// Support route to display the support page
router.get('/support', (req, res) => {
    res.render('support');  // Render the support.ejs page
  });
  
  // Handling form submission from the support page
  router.post('/support', (req, res) => {
    const { name, email, message } = req.body;
  
    // Log the support request (you can store this in a DB)
    console.log(`New support request from ${name} (${email}): ${message}`);
  
    // Send a success response and re-render the support page with a success flag
    res.render('support', { success: true });
  });

  router.get('/crypto-news', async (req, res) => {
    try {
      // Fetch crypto news from a public API (for example, using CoinDesk or a free crypto news API)
      const response = await fetch('https://api.coindesk.com/v1/news');  // Replace with your API URL
      const newsData = await response.json();
      
      // Pass the news data to the crypto-news.ejs page
      res.render('crypto-news', { newsArticles: newsData.articles });
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      res.render('crypto-news', { newsArticles: [] });  // If there's an error, show an empty news list
    }
  });

  router.get('/crypto-stocks', async (req, res) => {
    try {
      // Fetch cryptocurrency data (example using CoinGecko API)
      const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        qs: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: '5',  // Top 5 cryptocurrencies
          page: '1',
          sparkline: 'false'
        }
      });
      const cryptoData = await cryptoResponse.json();
  
      // Fetch stock market data (example using Alpha Vantage API)
      const stockResponse = await fetch('https://www.alphavantage.co/query', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        qs: {
          function: 'TIME_SERIES_DAILY',
          symbols: 'AAPL,GOOGL,AMZN',  // Example stock symbols
          apikey: 'YOUR_ALPHAVANTAGE_API_KEY'
        }
      });
      const stockData = await stockResponse.json();
  
      // Parse stock data (simplified)
      const stocks = Object.keys(stockData["Time Series (Daily)"]).map(symbol => {
        return {
          symbol: symbol,
          price: stockData["Time Series (Daily)"][symbol]["4. close"],
          change: ((parseFloat(stockData["Time Series (Daily)"][symbol]["4. close"]) - parseFloat(stockData["Time Series (Daily)"][symbol]["1. open"])) / parseFloat(stockData["Time Series (Daily)"][symbol]["1. open"]) * 100).toFixed(2)
        };
      });
  
      // Pass both crypto and stock data to the EJS page
      res.render('crypto-stocks', { cryptoData: cryptoData, stocksData: stocks });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.render('crypto-stocks', { cryptoData: [], stocksData: [] });
    }
  });



module.exports = router;
