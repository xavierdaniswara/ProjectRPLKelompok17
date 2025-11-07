require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const connectDB = require('./src/config/db.config');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
connectDB(process.env.MONGODB_URI);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => res.send('Medical Chatbot backend (session-based) is running.'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));