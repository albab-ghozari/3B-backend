const express = require('express');
const cors = require('cors');
// Impor route penilaian yang sudah kita buat
const penilaianRoutes = require('./routes/penilaianRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Global
app.use(cors()); // Mengizinkan Svelte mengakses API ini
app.use(express.json()); // Mengizinkan API menerima data format JSON

// Gunakan Routes
// Semua URL akan diawali dengan /api (contoh: /api/login, /api/nilai-kamar)
app.use('/api', penilaianRoutes);

// Error Handling sederhana jika route tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.listen( PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`🔒 Security: JWT Authentication Enabled`);
});