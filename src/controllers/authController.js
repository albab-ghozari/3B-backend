const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "RAHASIA_LOKAL_123";

const login = async (req, res) => {
   const { username, password } = req.body;

   try {
      // 1. Cari admin berdasarkan username
      const admin = await prisma.admin.findUnique({ where: { username } });
      if (!admin) {
         return res.status(401).json({ message: "Username atau Password salah" });
      }

      // 2. Cek password (bandingkan input dengan yang di database)
      const passwordValid = await bcrypt.compare(password, admin.password);
      if (!passwordValid) {
         return res.status(401).json({ message: "Username atau Password salah" });
      }

      // 3. Jika benar, buatkan Token (JWT)
      const token = jwt.sign(
         { id: admin.id, username: admin.username },
         SECRET_KEY,
         { expiresIn: '24h' } // Token hangus dalam 24 jam
      );

      res.json({
         message: "Login Berhasil",
         token: token,
         nama: admin.nama
      });

   } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
   }
};

module.exports = { login };