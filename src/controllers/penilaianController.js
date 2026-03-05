// Ambil semua data santri beserta info kamar
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getAllSantri = async (req, res) => {
   try {
      const santri = await prisma.santri.findMany({
         include: { kamar: true }
      });
      res.json(santri);
   } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data santri" });
   }
}
// Rekap Nilai Kamar per Minggu
const getRekapKamarMingguan = async (req, res) => {
   try {
      const tujuhHariLalu = new Date();
      tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);

      // Ambil semua kamar beserta info gedung
      const semuaKamar = await prisma.kamar.findMany();

      // Ambil semua penilaian kamar dalam 7 hari terakhir
      const dataPenilaian = await prisma.penilaianKamar.findMany({
         where: {
            tanggal: {
               gte: tujuhHariLalu
            }
         }
      });

      // Proses rekap per kamar
      const rekap = semuaKamar.map(kmr => {
         const penilaianKamar = dataPenilaian.filter(p => p.kamarId === kmr.id);
         // Hitung total pelanggaran (1 = melanggar, 0 = aman) untuk semua aspek
         const totalMinus = penilaianKamar.reduce((acc, curr) => {
            return acc
               + (curr.lantai === 1 ? 1 : 0)
               + (curr.kamarMandi === 1 ? 1 : 0)
               + (curr.tempatSampah === 1 ? 1 : 0)
               + (curr.gantunganBaju === 1 ? 1 : 0);
         }, 0);
         const nilaiDasar = 95;
         const nilaiAkhir = nilaiDasar - totalMinus;
         return {
            gedung: kmr.gedung,
            nomorKamar: kmr.nomor,
            totalPelanggaran: totalMinus,
            skorAkhir: nilaiAkhir < 0 ? 0 : nilaiAkhir
         };
      });

      // Group by gedung
      const rekapByGedung = {};
      rekap.forEach(item => {
         if (!rekapByGedung[item.gedung]) {
            rekapByGedung[item.gedung] = [];
         }
         rekapByGedung[item.gedung].push(item);
      });

      // Sort tiap gedung berdasarkan skorAkhir descending
      Object.keys(rekapByGedung).forEach(gedung => {
         rekapByGedung[gedung].sort((a, b) => b.skorAkhir - a.skorAkhir);
      });

      res.json(rekapByGedung);
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Gagal menghitung rekap kamar mingguan",
         error: error.message
      });
   }
}

// Ambil daftar kamar 1-6
const getKamar = async (req, res) => {
   try {
      const kamar = await prisma.kamar.findMany({
         orderBy: { nomor: 'desc' }
      });
      res.json(kamar);
   } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data kamar" });
   }
};

// Simpan Nilai Kamar (Lantai, KM, Sampah, Gantungan)
const simpanNilaiKamar = async (req, res) => {
   const { kamarId, lantai, kamarMandi, tempatSampah, gantunganBaju } = req.body;
   // Validasi hanya boleh input angka 0 atau 1 untuk semua field
   const validInput = [0, 1];
   if (
      !validInput.includes(parseInt(lantai)) ||
      !validInput.includes(parseInt(kamarMandi)) ||
      !validInput.includes(parseInt(tempatSampah)) ||
      !validInput.includes(parseInt(gantunganBaju))
   ) {
      return res.status(400).json({ error: "Hanya boleh input angka 0 atau 1 untuk semua nilai kamar" });
   }
   try {
      const hasil = await prisma.penilaianKamar.create({
         data: {
            kamarId: parseInt(kamarId),
            lantai: parseInt(lantai),
            kamarMandi: parseInt(kamarMandi),
            tempatSampah: parseInt(tempatSampah),
            gantunganBaju: parseInt(gantunganBaju)
         }
      });
      res.status(201).json({ message: "Nilai kamar berhasil disimpan", data: hasil });
   } catch (error) {
      res.status(400).json({ error: "Gagal menyimpan nilai kamar" });
   }
};

// Simpan Nilai Santri (Kasur & Lemari)
const simpanNilaiSantri = async (req, res) => {
   const { santriId, rapiTempatTidur, rapiLemari } = req.body;
   // Validasi hanya boleh input angka 0 atau 1
   const validInput = [0, 1];
   if (!validInput.includes(parseInt(rapiTempatTidur)) || !validInput.includes(parseInt(rapiLemari))) {
      return res.status(400).json({ error: "Hanya boleh input angka 0 atau 1 untuk rapiTempatTidur dan rapiLemari" });
   }
   try {
      const hasil = await prisma.penilaianSantri.create({
         data: {
            santriId: parseInt(santriId),
            rapiTempatTidur: parseInt(rapiTempatTidur),
            rapiLemari: parseInt(rapiLemari)
         }
      });
      res.status(201).json({ message: "Nilai santri berhasil disimpan", data: hasil });
   } catch (error) {
      res.status(400).json({ error: "Gagal menyimpan nilai santri" });
   }
};

const getRekapSantriMingguan = async (req, res) => {
   try {
      const tujuhHariLalu = new Date();
      tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);

      // 1. Ambil semua data santri
      const semuaSantri = await prisma.santri.findMany({
         include: { kamar: true }
      });

      // 2. Ambil semua data pelanggaran dalam 7 hari terakhir
      const dataPelanggaran = await prisma.penilaianSantri.findMany({
         where: {
            tanggal: {
               gte: tujuhHariLalu
            }
         }
      });

      // 3. Proses perhitungan nilai per santri
      const rekap = semuaSantri.map(snt => {
         const pelanggaranSantri = dataPelanggaran.filter(p => p.santriId === snt.id);
         const totalMinus = pelanggaranSantri.reduce((acc, curr) => {
            return acc + (curr.rapiTempatTidur === 1 ? 1 : 0) + (curr.rapiLemari === 1 ? 1 : 0);
         }, 0);
         const nilaiDasar = 95;
         const nilaiAkhir = nilaiDasar - totalMinus;
         let hpTime = "";
         if (nilaiAkhir >= 90 && nilaiAkhir <= 95) {
            hpTime = "+30 min";
         } else if (nilaiAkhir >= 80 && nilaiAkhir < 90) {
            hpTime = "normal";
         }
         return {
            nama: snt.nama,
            gedung: snt.kamar.gedung,
            nomorKamar: snt.kamar.nomor,
            totalPelanggaran: totalMinus,
            skorAkhir: nilaiAkhir < 0 ? 0 : nilaiAkhir,
            hpTime
         };
      });

      // Group by gedung
      const rekapByGedung = {};
      rekap.forEach(item => {
         if (!rekapByGedung[item.gedung]) {
            rekapByGedung[item.gedung] = [];
         }
         rekapByGedung[item.gedung].push(item);
      });

      // Sort each gedung's array by skorAkhir descending
      Object.keys(rekapByGedung).forEach(gedung => {
         rekapByGedung[gedung].sort((a, b) => b.skorAkhir - a.skorAkhir);
      });

      res.json(rekapByGedung);
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Gagal menghitung",
         error: error.message
      });
   }
}

module.exports = { getKamar, simpanNilaiKamar, simpanNilaiSantri, getRekapSantriMingguan, getRekapKamarMingguan, getAllSantri };