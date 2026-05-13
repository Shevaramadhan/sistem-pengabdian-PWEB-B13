
// PERMISSION MIDDLEWARE - Cek izin akses user
// Fungsi: Menjaga halaman supaya hanya bisa dibuka oleh user yang punya izin tertentu
// Cara pakai:permissionMiddleware('view_dashboard') halaman ini hanya untuk user
// yang punya izin 'view_dashboard'

const permissionMiddleware = (izinYangDibutuhkan) => {

    // Kembalikan fungsi middleware
    return (req, res, next) => {

        // LANGKAH 1: Cek apakah user sudah login
        if (!req.session || !req.session.user) {
            // Belum login → paksa ke halaman login
            return res.redirect('/login');
        }

        // LANGKAH 2: Ambil daftar izin user dari session
        // Contoh isi: ['view_dashboard', 'view_pengabdian']
        const izinUser = req.session.user.permissions || [];

        // LANGKAH 3: Cek apakah user punya izin yang dibutuhkan
        if (izinUser.includes(izinYangDibutuhkan)) {
            // Punya izin → boleh masuk, lanjutkan
            return next();
        }

        // Tidak punya izin → tampilkan halaman 403
        // Catat di terminal siapa yang ditolak dan butuh izin apa
        console.log(
            'Akses ditolak untuk:', req.session.user.name,
            '| Butuh izin:', izinYangDibutuhkan
        );

        return res.status(403).render('errors/403', {
            user: req.session.user
        });
    };
};

module.exports = permissionMiddleware;