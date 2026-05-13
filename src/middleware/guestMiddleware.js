// Middleware buat ngehalangin user yang udah login buka halaman login lagi
module.exports = (req, res, next) => {
  if (req.session && req.session.user) return res.redirect('/dashboard');
  return next();
};
