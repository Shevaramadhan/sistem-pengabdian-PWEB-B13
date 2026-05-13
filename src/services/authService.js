const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Coba login pake email sama password
async function attemptLogin(email, password) {
  if (!email || !password) return null;

  const [rows] = await pool.query(
    'SELECT id, nip, name, email, password FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  if (!rows || rows.length === 0) return null;

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  // buang field password biar aman pas disimpen di session
  delete user.password;
  return user;
}

// Ambil list role yang dipunya user
async function getUserRoles(userId) {
  if (!userId) return [];

  const [rows] = await pool.query(
    `SELECT r.name FROM roles r
     JOIN model_has_roles mr ON r.id = mr.role_id
     WHERE mr.model_type = 'User' AND mr.model_id = ?`,
    [userId]
  );

  return rows.map((r) => r.name);
}

// Ambil semua permission user, gabungan dari direct permission sama dari role
async function getUserPermissions(userId) {
  if (!userId) return [];

  // permission yang nempel langsung di user
  const [direct] = await pool.query(
    `SELECT p.name FROM permissions p
     JOIN model_has_permissions mp ON p.id = mp.permission_id
     WHERE mp.model_type = 'User' AND mp.model_id = ?`,
    [userId]
  );

  // permission yang dapet dari role
  const [viaRoles] = await pool.query(
    `SELECT DISTINCT p.name FROM permissions p
     JOIN role_has_permissions rp ON p.id = rp.permission_id
     JOIN model_has_roles mr ON rp.role_id = mr.role_id
     WHERE mr.model_type = 'User' AND mr.model_id = ?`,
    [userId]
  );

  const names = new Set();
  direct.forEach((r) => names.add(r.name));
  viaRoles.forEach((r) => names.add(r.name));

  return Array.from(names);
}

module.exports = {
  attemptLogin,
  getUserRoles,
  getUserPermissions,
};
