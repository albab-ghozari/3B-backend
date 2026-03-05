const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "RAHASIA_LOKAL_123";

const authenticateToken = (req, res, next) => {
   // Ambil token dari header 'Authorization'
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN_DISINI

   if (!token) {
      return res.status(401).json({ message: "Akses ditolak, silakan login dulu" });
   }

   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Token tidak valid atau sudah expired" });
      req.user = user; // Simpan data user ke request
      next(); // Lanjut ke controller penilaian
   });
};

module.exports = authenticateToken;