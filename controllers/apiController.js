const Transaction = require('../models/transaction');
const Budget = require('../models/budget');

exports.getBalance = async (req, res) => {
    const userId = req.user.id;
    const transactions = await Transaction.findByUserId(userId);
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    res.json({ balance });
};

exports.getSpendingReport = async (req, res) => {
    const userId = req.user.id;
    const report = await Transaction.getSpendingByCategory(userId);
    res.json(report);
};

exports.getBudgetAlerts = async (req, res) => {
    const userId = req.user.id;
    const budgets = await Budget.findByUserId(userId);
    const alerts = budgets.filter(budget => budget.spent > budget.limit);
    res.json(alerts);
};
