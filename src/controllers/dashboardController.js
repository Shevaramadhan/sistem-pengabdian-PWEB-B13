// DASHBOARD CONTROLLER
// Menampilkan halaman dashboard setelah user login

const dashboardController = {

    // Tampilkan halaman dashboard
    // Dipanggil saat user buka: GET /dashboard
    index(req, res) {

        // Ambil data user dari session disimpan saat login berhasil
        const user = req.session.user;

        // Tampilkan file views/dashboard/index.ejs dan kirim data user ke halaman tersebut
        res.render('dashboard/index', {
            title: 'Dashboard — SIPENGABDIAN',
            user:  user
        });
    }

};

module.exports = dashboardController;