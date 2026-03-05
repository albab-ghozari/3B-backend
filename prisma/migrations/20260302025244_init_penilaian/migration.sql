-- CreateTable
CREATE TABLE "Kamar" (
    "id" SERIAL NOT NULL,
    "nomor" TEXT NOT NULL,

    CONSTRAINT "Kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Santri" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kamarId" INTEGER NOT NULL,

    CONSTRAINT "Santri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianSantri" (
    "id" SERIAL NOT NULL,
    "santriId" INTEGER NOT NULL,
    "rapiTempatTidur" INTEGER NOT NULL,
    "rapiLemari" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PenilaianSantri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenilaianKamar" (
    "id" SERIAL NOT NULL,
    "kamarId" INTEGER NOT NULL,
    "lantai" INTEGER NOT NULL,
    "kamarMandi" INTEGER NOT NULL,
    "tempatSampah" INTEGER NOT NULL,
    "gantunganBaju" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PenilaianKamar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kamar_nomor_key" ON "Kamar"("nomor");

-- AddForeignKey
ALTER TABLE "Santri" ADD CONSTRAINT "Santri_kamarId_fkey" FOREIGN KEY ("kamarId") REFERENCES "Kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianSantri" ADD CONSTRAINT "PenilaianSantri_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianKamar" ADD CONSTRAINT "PenilaianKamar_kamarId_fkey" FOREIGN KEY ("kamarId") REFERENCES "Kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
