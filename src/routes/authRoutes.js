const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const guestMiddleware = require('../middleware/guestMiddleware');

// Route buat nampilin form login
router.get('/login', guestMiddleware, authController.showLogin);

// Route buat memproses kiriman form login
router.post(
  '/login',
  guestMiddleware,
  [
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  authController.login
);

// Route buat keluar akun (logout)
router.post('/logout', authController.logout);

module.exports = router;
