/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EDITOR';

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "blood_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "place" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300),
    "blood_types" "BloodType"[],
    "units_needed" INTEGER,
    "contact" VARCHAR(150),
    "notes" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blood_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_blood_request_city_id" ON "blood_request"("city_id");

-- CreateIndex
CREATE INDEX "idx_blood_request_verified" ON "blood_request"("verified");

-- AddForeignKey
ALTER TABLE "blood_request" ADD CONSTRAINT "blood_request_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_request" ADD CONSTRAINT "blood_request_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
