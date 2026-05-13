const { validationResult } = require('express-validator');
const authService = require('../services/authService');

// Tampil halaman login
exports.showLogin = (req, res) => {
	res.render('auth/login', { title: 'Login' });
};

// Proses login
exports.login = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash('validation', errors.array());
		return res.redirect('/login');
	}

	const { email, password } = req.body;

	try {
		const user = await authService.attemptLogin(email, password);
		if (!user) {
			req.flash('error', 'Email atau password salah');
			return res.redirect('/login');
		}

		// ambil roles & permissions
		const roles = await authService.getUserRoles(user.id);
		const permissions = await authService.getUserPermissions(user.id);

		// simpan ke session
		req.session.user = {
			id: user.id,
			name: user.name,
			email: user.email,
			roles,
			permissions,
		};

		req.flash('success', 'Berhasil login');
		return res.redirect('/dashboard');
	} catch (err) {
		console.error('Error login:', err);
		req.flash('error', 'Terjadi kesalahan, coba lagi');
		return res.redirect('/login');
	}
};

// Proses logout
exports.logout = (req, res) => {
	req.session.destroy((err) => {
		if (err) console.error('Error destroy session:', err);
		res.clearCookie('session_id');
		res.redirect('/login');
	});
};

