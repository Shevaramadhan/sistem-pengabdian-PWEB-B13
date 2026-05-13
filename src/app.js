const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
require('dotenv').config();

const pool = require('./config/database');
const routes = require('./routes');

const app = express();

// ============================================================
// VIEW ENGINE SETUP
// ============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// MIDDLEWARE SECURITY & LOGGING
// ============================================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);
app.use(morgan('dev'));

// ============================================================
// STATIC FILES
// ============================================================
app.use(express.static(path.join(__dirname, '../public')));

// ============================================================
// BODY PARSER MIDDLEWARE
// ============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================================
// SESSION STORE CONFIGURATION
// ============================================================
const sessionStore = new MySQLStore(
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistem_pengabdian',
  },
  pool
);

// ============================================================
// SESSION MIDDLEWARE
// ============================================================
app.use(
  session({
    key: 'session_id',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true kalau pakai HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 jam
    },
  })
);

// ============================================================
// FLASH MESSAGE MIDDLEWARE
// ============================================================
app.use(flash());

// ============================================================
// LOCALS UNTUK EJS (Akses di semua template)
// ============================================================
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.validation = req.flash('validation');
  next();
});

// ============================================================
// ROUTES
// ============================================================
app.use(routes);

// ============================================================
// 404 NOT FOUND HANDLER
// ============================================================
app.use((req, res) => {
  res.status(404).send('Halaman tidak ditemukan (404)');
});

// ============================================================
// GLOBAL ERROR HANDLER (sementara, nanti pakai errorMiddleware dari Athaya)
// ============================================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.statusCode || 500).send(err.message || 'Terjadi kesalahan pada server');
});

module.exports = app;
