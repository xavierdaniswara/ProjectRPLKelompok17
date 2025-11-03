const { Pool } = require('pg');
require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PORT } = process.env;

const pool = new Pool({
	user: PGUSER,
	password: PGPASSWORD,
	host: PGHOST,
	database: PGDATABASE,
	port: PORT,
	ssl: true
});

const connectDB = async (req, res) => {
	try {
		const client = await pool.connect();
		console.log('Connected to NeonDB');
		client.release();
	} catch (err) {
		console.error('Error connecting to NeonDB:', err);
	}
};

module.exports = {pool, connectDB};