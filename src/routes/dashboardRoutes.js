// DASHBOARD ROUTES - Daftar URL halaman dashboard
// 1. Butuh login dulu (dicek oleh authMiddleware Sheva)
// 2. Butuh izin 'view_dashboard' (dicek oleh permissionMiddleware)

const express              = require('express');
const router               = express.Router();

// Panggil controller dan middleware yang dibutuhkan
const dashboardController  = require('../controllers/dashboardController');
const permissionMiddleware = require('../middleware/permissionMiddleware');

// GET /dashboard
// Cek izin 'view_dashboard' dulu sebelum masuk
router.get('/',
    permissionMiddleware('view_dashboard'),
    dashboardController.index
);

module.exports = router;