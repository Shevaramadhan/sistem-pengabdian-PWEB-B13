const pool = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Coba login pake email + password
 * Kalau berhasil: balikkan objek user (tanpa password)
 * Kalau gagal: balikkan null
 */
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

  // hapus password biar gak kebocor kalau balikkan user
  delete user.password;
  return user;
}

/**
 * Ambil daftar role user (balik array nama role)
 */
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

/**
 * Ambil permission user.
 * Gabung permission yang langsung diberi dan yang didapat lewat role.
 */
async function getUserPermissions(userId) {
  if (!userId) return [];

  // permission yang langsung dipetakan ke user
  const [direct] = await pool.query(
    `SELECT p.name FROM permissions p
     JOIN model_has_permissions mp ON p.id = mp.permission_id
     WHERE mp.model_type = 'User' AND mp.model_id = ?`,
    [userId]
  );

  // permission yang didapat lewat role
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

  // balik array unik
  return Array.from(names);
}

module.exports = {
  attemptLogin,
  getUserRoles,
  getUserPermissions,
};
