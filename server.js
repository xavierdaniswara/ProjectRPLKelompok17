// The address of this server is:
// URL: http://localhost:8383
// IP: http://127.0.0.1:8383
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const accountRepo = require("./src/repository/accounts");
//const db = require('./src/config/db.config');

// HTTP verbs and routes
app.post('/signUp', accountRepo.signUp);
app.post('/login', accountRepo.login);
app.delete('/deleteAccount', accountRepo.deleteAccount);
app.get('Profile/ViewUser', accountRepo.getAccountById);

// Connect to database
//db.connectDB();

// Starting server
app.listen(port, () => {console.log(`Server has started on ${port}`);})