const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const authMiddleware = require('../middleware/authMiddleware');

// root → redirect ke login
router.get('/', (req, res) => res.redirect('/login'));

// mount auth routes
router.use('/', authRoutes);

// mount dashboard routes (butuh login dulu)
router.use('/dashboard', authMiddleware, dashboardRoutes);

module.exports = router;
