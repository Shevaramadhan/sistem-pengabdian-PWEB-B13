const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

// root → redirect ke login
router.get('/', (req, res) => res.redirect('/login'));

// mount auth routes
router.use('/', authRoutes);

// dashboard routes akan di-mount nanti saat Athaya selesai
// TODO: uncomment saat dashboardRoutes sudah ada
// const dashboardRoutes = require('./dashboardRoutes');
// router.use('/', dashboardRoutes);

module.exports = router;
