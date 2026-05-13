// middleware untuk memastikan user sudah login
module.exports = (req, res, next) => {
  if (req.session && req.session.user) return next();

  req.flash('error', 'Silakan login dulu');
  return res.redirect('/login');
};
