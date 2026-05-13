// ERROR MIDDLEWARE - Tangkap semua error tak terduga
// file ini yang akan menangkapnya dan menampilkan halaman 500 ke user

const errorMiddleware = (err, req, res, next) => {

    // Tampilkan detail error di terminal
    // Berguna untuk debugging saat development
    console.log('ERROR TIDAK TERDUGA:', err.message);

    // Tampilkan halaman 500 ke user
    res.status(500).render('errors/500', {

        // mode development → tampilkan detail errornya
        // mode production → sembunyikan (null = tidak ditampilkan)
        // ubah mode: ganti NODE_ENV di file .env
        message: process.env.NODE_ENV === 'development' ? err.message : null,

        // Kirim data user kalau ada (untuk navbar)
        user: req.session && req.session.user ? req.session.user : null
    });
};

module.exports = errorMiddleware;