// middleware untuk mencegah akses halaman guest saat sudah login
module.exports = (req, res, next) => {
  if (req.session && req.session.user) return res.redirect('/dashboard');
  return next();
};
