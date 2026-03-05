const express = require('express');
const router = express.Router();
const { getKamar, simpanNilaiKamar, simpanNilaiSantri, getRekapSantriMingguan, getRekapKamarMingguan, getAllSantri } = require('../controllers/penilaianController');
const { login } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth'); // Import satpamnya

// Public Route (Bisa diakses siapa saja/sebelum login)
router.post('/login', login);
router.get('/santri', authenticateToken, getAllSantri);

// Protected Routes (Hanya bisa diakses kalau sudah login/punya token)
router.get('/kamar', authenticateToken, getKamar);
router.post('/nilai-kamar', authenticateToken, simpanNilaiKamar);
router.post('/nilai-santri', authenticateToken, simpanNilaiSantri);
router.get('/rekap-mingguan', authenticateToken, getRekapSantriMingguan);
router.get('/rekap-kamar-mingguan', authenticateToken, getRekapKamarMingguan);

module.exports = router;