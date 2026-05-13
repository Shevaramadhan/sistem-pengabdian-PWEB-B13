// Middleware buat mastiin user udah login sebelum ngakses route tertutup
module.exports = (req, res, next) => {
  if (req.session && req.session.user) return next();

  req.flash('error', 'Silakan login dulu');
  return res.redirect('/login');
};
