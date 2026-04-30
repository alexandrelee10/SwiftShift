/*
  Warnings:

  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RATE_CONFIRMATION', 'BILL_OF_LADING', 'PROOF_OF_DELIVERY', 'INVOICE');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "BillOfLading" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "shipperName" TEXT NOT NULL,
    "shipperAddress" TEXT NOT NULL,
    "consigneeName" TEXT NOT NULL,
    "consigneeAddress" TEXT NOT NULL,
    "carrierName" TEXT,
    "trailerNumber" TEXT,
    "sealNumber" TEXT,
    "commodity" TEXT,
    "weight" DOUBLE PRECISION,
    "pieces" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillOfLading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillOfLading_documentId_key" ON "BillOfLading"("documentId");

-- AddForeignKey
ALTER TABLE "BillOfLading" ADD CONSTRAINT "BillOfLading_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
