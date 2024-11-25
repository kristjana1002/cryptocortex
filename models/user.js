// models/user.js
const db = require('../db/db');

const User = {
    create: async (username, email, password) => {
        const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const values = [username, email, password];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    findByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await db.query(query, [email]);
        return rows[0];
    },

    findById: async (id) => {
        const query = `SELECT * FROM users WHERE id = $1`;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },
};

module.exports = User;
