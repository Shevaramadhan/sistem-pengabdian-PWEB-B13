
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

const seedAdmin = async () => {
  try {
    console.log('🌱 Seeding admin user...\n');

    // ============================================================
    // Step 1: Hash password dengan bcrypt
    // ============================================================
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('✅ Password berhasil di-hash');

    // ============================================================
    // Step 2: Cek apakah admin user sudah ada
    // ============================================================
    const connection = await pool.getConnection();
    
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@unand.ac.id']
    );

    if (existingUser.length > 0) {
      console.log('⚠️  Admin user sudah ada. Skip insert user.');
      const adminUserId = existingUser[0].id;

      // ============================================================
      // Step 3: Cek apakah sudah punya role admin
      // ============================================================
      const [existingRole] = await connection.query(
        `SELECT * FROM model_has_roles 
         WHERE model_id = ? AND model_type = 'User' 
         AND role_id = (SELECT id FROM roles WHERE name = 'admin')`,
        [adminUserId]
      );

      if (existingRole.length > 0) {
        console.log('⚠️  Admin user sudah memiliki role admin. Skip role assignment.\n');
      } else {
        // Assign role admin
        const [adminRole] = await connection.query(
          'SELECT id FROM roles WHERE name = ?',
          ['admin']
        );

        if (adminRole.length > 0) {
          await connection.query(
            `INSERT INTO model_has_roles (role_id, model_type, model_id) 
             VALUES (?, ?, ?)`,
            [adminRole[0].id, 'User', adminUserId]
          );
          console.log('✅ Role admin berhasil di-assign ke admin user\n');
        }
      }

      connection.release();
      return;
    }

    // ============================================================
    // Step 2B: Insert admin user ke tabel users
    // ============================================================
    const [insertResult] = await connection.query(
      `INSERT INTO users (nip, name, email, password) 
       VALUES (?, ?, ?, ?)`,
      ['19950815', 'Administrator', 'admin@unand.ac.id', hashedPassword]
    );

    const adminUserId = insertResult.insertId;
    console.log(`✅ Admin user berhasil dibuat (ID: ${adminUserId})`);

    // ============================================================
    // Step 3: Assign role 'admin' ke user admin via model_has_roles
    // ============================================================
    const [adminRole] = await connection.query(
      'SELECT id FROM roles WHERE name = ?',
      ['admin']
    );

    if (adminRole.length > 0) {
      await connection.query(
        `INSERT INTO model_has_roles (role_id, model_type, model_id) 
         VALUES (?, ?, ?)`,
        [adminRole[0].id, 'User', adminUserId]
      );
      console.log('✅ Role admin berhasil di-assign\n');
    }

   
    console.log('📋 Admin User Details:');
    console.log('───────────────────────────────────────');
    console.log(`Email:    admin@unand.ac.id`);
    console.log(`Password: ${plainPassword}`);
    console.log(`Hashed:   ${hashedPassword}`);
    console.log('───────────────────────────────────────\n');

    console.log('✨ Seed admin user selesai! Siap login.\n');

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error saat seed admin user:', error.message);
    console.error(error);
    process.exit(1);
  }
};


seedAdmin();
