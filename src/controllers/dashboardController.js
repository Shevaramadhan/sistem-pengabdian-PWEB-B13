// Fungsi untuk memanggil halaman dashboard
exports.index = (req, res) => {
    res.render('dashboard/index', {
        title: 'Dashboard Universitas Andalas',
        layout: 'layouts/main' // Beritahu express pakai kerangka main.ejs
    });
};

exports.index = (req, res) => {
    // Ambil data user dari session yang dibuat oleh Sheva saat login
    const userData = req.session.user;

    res.render('dashboard/index', {
        title: 'Dashboard',
        user: userData, // Kirim data user ke EJS
        layout: 'layouts/main'
    });
};
