const {pool} = require ('../config/db.config');
const {redis} = require ('../config/redis.config');
const {v4: generateId} = require('uuid');
const bcrypt = require('bcrypt');

async function setWithExpiration(email, User) {
	try {
		await redis.setex(email, 3600, JSON.stringify(User));
		console.log(`Successfully store User ${User.username} in cache for 1 hour`)
	} catch (err) {
		console.log(`Error storing ${User.username} data in cache: ${err}`);
	}
} 

async function signUp (req, res) {
	const {username, email, password} = req.body;

	//Check if username pr email exists
	const existingUser = await pool.query(`SELECT * FROM users WHERE username = $1 OR email = $2;`, [username, email]);
	
	//Invalidate if exists
	if (existingUser.rows.length > 0) {
		return res.status(400).json({message: 'Username or email already exists'});
	}

	try {
		//Create new account if valid
		const account_id = generateId();
		const product_owned_id = generateId();
		const cart_owned_id = generateId();
		const hashedPassword = await bcrypt.hash(password, 10);

		//Query to the database
		const query = {
			text: `INSERT INTO account (account_id, username, email, password, product_owned_id, cart_owned_id) VALUES ($1, $2
			, $3, $4, $5) RETURNING *;`
			,
			values: [account_id, username, email, hashedPassword, product_owned_id, cart_owned_id]
		};
		const result = await pool.query(query);
		const user = result.rows[0];
		res.status(201).json(user); 

		//Store the data in cache for 1 hour
		setWithExpiration(email, 3600, [account_id, username, email, password, product_owned_id, cart_owned_id]);
	} catch (error) { //If there is a server error
		console.error(error);
		res.status(500).json({message: 'Internal Server Error'});
	}
}

async function login (req, res) {
	const {email, password} = req.body;

	//Check if the User is available on Redis
	let user = await JSON.parse(redis.get(email));

	//If User is available
	if(user) {
		const isMatch = await bcrypt.compare(password, user.password);
		if(isMatch) {
			res.status(200).json(user);
		} else {
			res.status(401).json({message: 'Invalid password'});
		}
	}
	else { //Query to the database to get User
		const query = {
			text: `SELECT * FROM account WHERE email = ${email};`
		};
		try {
			const result = await pool.query(query);
			user = result.rows[0];
			if(user) {
				const isMatch = await bcrypt.compare(password, user.password);
				if(isMatch) { //Store the Data in Redis
					setWithExpiration(email, 3600, [account_id, username, email, password, product_owned_id, cart_owned_id]);
					res.status(200).json(user);
				} else {
					res.status(401).json({message: "Invalid password"});
				}
			}
		} catch (err) {
			console.error(err);
			res.status(500).JSON({message: err});
		}
	}
}

async function deleteAccount(req, res) {
	const account_id = req.body;

	// //Find the account
	// let query = `SELECT * FROM account WHERE account_id = ${account_id};`;
	// let result = await pool.query(query);
	// const user = result.rows[0];

	//Check if User has unfinished transaction
	let query, result;
	try {
		query = `SELECT * FROM history WHERE transaction_owner_id = ${account_id} AND status = FALSE;`;
		result = await pool.query(query);
		if(result.rows) {
			return res.status(400).json({message: "User has unfinished transaction"});
		}
	} catch(err) {
		console.error(err);
		return res.status(501).json({message: "Failed to check transaction history", error: err});
	}
	

	//Delete account
	try {
		query = `DELETE FROM account WHERE account_id = ${account_id};`;
		result = await pool.query(query);
		res.status(202).json({message: 'Account successfully deleted'});
	} catch(err) {
		res.status(501).json({message: 'Account not deleted'});
	}
}

async function getAccountById(req, res) {
	const account_id = req.body;

	try {
		//Find the account
		const query = `SELECT * FROM account WHERE account_id = ${account_id};`;
		const result = await pool.query(query);
		const User = result.rows[0];

		//Check if user exists
		if(User) {
			res.status(200).json({message: 'User found', User: User});
		} else {
			res.status(404).json({message: 'User not found'});
		}
	} catch (err) {
		console.error(err);
		res.status(501).json({message: "Failed to get user", error: err});
	}

}

module.exports = {
	signUp,
	login,
	deleteAccount,
	getAccountById
}