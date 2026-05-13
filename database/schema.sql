-- ============================================================
-- DATABASE SISTEM PENGABDIAN
-- ============================================================

-- Kalau databasenya sudah ada dan mau reset total
-- tinggal aktifkan baris di bawah ini
-- DROP DATABASE IF EXISTS sistem_pengabdian;

-- Membuat database utama
CREATE DATABASE IF NOT EXISTS sistem_pengabdian
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistem_pengabdian;

-- ============================================================
-- TABEL USERS
-- Menyimpan data akun dosen/admin yang bisa login
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nip VARCHAR(20) UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABEL ROLES
-- Tempat menyimpan role user
-- Contoh:
-- admin
-- dosen
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  guard_name VARCHAR(100) DEFAULT 'web',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABEL PERMISSIONS
-- Menyimpan daftar izin akses per fitur
-- Jadi nanti tiap role bisa punya akses berbeda
-- ============================================================
CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  guard_name VARCHAR(100) DEFAULT 'web',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABEL ROLE_HAS_PERMISSIONS
-- Penghubung antara role dan permission
--
-- Contoh:
-- role admin punya permission create_pengabdian
-- ============================================================
CREATE TABLE IF NOT EXISTS role_has_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABEL MODEL_HAS_ROLES
-- Menentukan user punya role apa
--
-- Contoh:
-- User Sheva = admin
-- User Athaya = dosen
-- ============================================================
CREATE TABLE IF NOT EXISTS model_has_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  model_type VARCHAR(100) DEFAULT 'User',
  model_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_role (role_id, model_type, model_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABEL MODEL_HAS_PERMISSIONS
-- Kalau ada user yang mau diberi akses khusus langsung
-- tanpa mengikuti role
--
-- Misalnya:
-- dosen biasa tapi bisa approve undangan
-- ============================================================
CREATE TABLE IF NOT EXISTS model_has_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  permission_id INT NOT NULL,
  model_type VARCHAR(100) DEFAULT 'User',
  model_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_permission (permission_id, model_type, model_id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABEL SESSIONS
-- Dipakai untuk menyimpan session login user
-- Jadi user tidak perlu login terus menerus
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) PRIMARY KEY,
  expires INT NOT NULL,
  data MEDIUMTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA AWAL
-- ============================================================

-- ============================================================
-- ROLE DEFAULT
-- ============================================================
INSERT INTO roles (name, guard_name) VALUES
  ('admin', 'web'),
  ('dosen', 'web');

-- ============================================================
-- DAFTAR PERMISSION
-- Total: 15 permission
-- ============================================================
INSERT INTO permissions (name, guard_name) VALUES

  -- Dashboard utama
  ('view_dashboard', 'web'),
  
  -- =========================
  -- Modul Pengabdian
  -- =========================
  ('view_pengabdian', 'web'),
  ('create_pengabdian', 'web'),
  ('update_pengabdian', 'web'),
  ('delete_pengabdian', 'web'),
  ('export_pengabdian', 'web'),
  ('import_pengabdian', 'web'),
  
  -- =========================
  -- Modul Anggota Pengabdian
  -- =========================
  ('view_anggota', 'web'),
  ('create_anggota', 'web'),
  ('update_anggota', 'web'),
  ('delete_anggota', 'web'),
  ('export_anggota', 'web'),
  
  -- =========================
  -- Modul Undangan
  -- =========================
  ('view_undangan', 'web'),
  ('approve_undangan', 'web'),
  ('reject_undangan', 'web');

-- ============================================================
-- ADMIN DAPAT SEMUA AKSES
-- ============================================================
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'admin') AS role_id,
  id AS permission_id
FROM permissions;

-- ============================================================
-- AKSES KHUSUS UNTUK DOSEN
-- Tidak semua permission diberikan
-- ============================================================
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'dosen') AS role_id,
  id AS permission_id
FROM permissions
WHERE name IN (
  'view_dashboard',

  'view_pengabdian',
  'create_pengabdian',
  'update_pengabdian',
  'export_pengabdian',

  'view_anggota',
  'create_anggota',
  'update_anggota',
  'export_anggota',

  'view_undangan',
  'approve_undangan',
  'reject_undangan'
);