const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Sedang memulai seeding nomor kamar...');

  const gedungs = ['QBS', 'FQ'];
  const nomors = ['1', '2', '3', '4', '5', '6'];

  for (const gdg of gedungs) {
    for (const no of nomors) {
      await prisma.kamar.upsert({
        where: {
          nomor_gedung: { nomor: no, gedung: gdg }
        },
        update: {},
        create: {
          nomor: no,
          gedung: gdg
        }
      });
    }
  }
  console.log("Seed Kamar QBS & FQ Berhasil!");

// Opsi: Tambahkan beberapa santri contoh agar bisa langsung dicoba penilaiannya
console.log('Menambahkan contoh data santri...');
await prisma.santri.createMany({
  data: [
    { nama: 'Ahmad Fauzi', kamarId: 1 },
    { nama: 'Zainuddin', kamarId: 1 },
    { nama: 'Lukman Hakim', kamarId: 2 },
    { nama: 'M. Ridwan', kamarId: 6 },
    { nama: 'M. yusuf', kamarId: 3 },
    { nama: 'M. ghani', kamarId: 5 },
    { nama: 'muti', kamarId: 7 },
    { nama: 'sari', kamarId: 8 },
    { nama: 'ainun', kamarId: 9 },
    { nama: 'zalfa', kamarId: 10 },
    { nama: 'veni', kamarId: 11 },
    { nama: 'sarah', kamarId: 12 },
    { nama: 'siti', kamarId: 12 },
  ],
  skipDuplicates: true,
});



// Di dalam fungsi main() yang tadi:
const hashedPassword = await bcrypt.hash('admin123', 10);
await prisma.admin.upsert({
  where: { username: 'admin' },
  update: {},
  create: {
    username: 'admin',
    password: hashedPassword,
    nama: 'Pengurus Pesantren',
  },
});

console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });