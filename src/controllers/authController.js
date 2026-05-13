const { validationResult } = require('express-validator');
const authService = require('../services/authService');

// Nampilin halaman form login
exports.showLogin = (req, res) => {
	res.render('auth/login', { title: 'Login' });
};

// Proses verifikasi login pas tombol submit ditekan
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

		// ambil data roles sama permissions buat keperluan ACL
		const roles = await authService.getUserRoles(user.id);
		const permissions = await authService.getUserPermissions(user.id);

		// simpen data user ke session aktif saat ini
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

// Proses keluar akun (destroy session)
exports.logout = (req, res) => {
	req.session.destroy((err) => {
		if (err) console.error('Error destroy session:', err);
		res.clearCookie('session_id');
		res.redirect('/login');
	});
};

