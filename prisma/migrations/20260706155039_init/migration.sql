-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ShelterType" AS ENUM ('OFFICIAL', 'INFORMAL');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SupplyRelationType" AS ENUM ('ACCEPTED', 'NEEDED');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state_aid_level" (
    "state_aid_id" UUID NOT NULL,
    "aid_level" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "state_aid_level_pkey" PRIMARY KEY ("state_aid_id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "state_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_center" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300),
    "contact" VARCHAR(150),
    "scheduled_at" TIMESTAMP(6) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "verified_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "collection_center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300),
    "contact" VARCHAR(150),
    "capacity" VARCHAR(50),
    "type" "ShelterType" NOT NULL DEFAULT 'OFFICIAL',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urgent_need" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "place" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300),
    "needed_items" TEXT NOT NULL,
    "contact" VARCHAR(150),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "urgent_need_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "source" VARCHAR(500),
    "city_id" UUID,
    "status" "NewsStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_number" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID,
    "type_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "number" VARCHAR(50),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "verified_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_number_type" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "emergency_number_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "help_link" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "help_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "supply_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_supply" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "category_id" UUID,

    CONSTRAINT "general_supply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_center_supply" (
    "collection_center_id" UUID NOT NULL,
    "supply_id" UUID NOT NULL,
    "relation" "SupplyRelationType" NOT NULL,

    CONSTRAINT "collection_center_supply_pkey" PRIMARY KEY ("collection_center_id","supply_id","relation")
);

-- CreateTable
CREATE TABLE "shelter_supply" (
    "shelter_id" UUID NOT NULL,
    "supply_id" UUID NOT NULL,
    "relation" "SupplyRelationType" NOT NULL,

    CONSTRAINT "shelter_supply_pkey" PRIMARY KEY ("shelter_id","supply_id","relation")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "state_name_key" ON "state"("name");

-- CreateIndex
CREATE INDEX "city_state_name_key" ON "city"("state_id", "name");

-- CreateIndex
CREATE INDEX "city_key_cc" ON "collection_center"("city_id", "name");

-- CreateIndex
CREATE INDEX "idx_collection_center_verified" ON "collection_center"("verified");

-- CreateIndex
CREATE INDEX "city_key_sh" ON "shelter"("city_id", "name");

-- CreateIndex
CREATE INDEX "idx_shelter_verified" ON "shelter"("verified");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_city_name_key" ON "hospital"("city_id", "name");

-- CreateIndex
CREATE INDEX "idx_urgent_need_city_id" ON "urgent_need"("city_id");

-- CreateIndex
CREATE INDEX "idx_news_state_id" ON "news"("city_id");

-- CreateIndex
CREATE INDEX "idx_emergency_number_city_id" ON "emergency_number"("city_id");

-- CreateIndex
CREATE INDEX "idx_emergency_number_type_id" ON "emergency_number"("type_id");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_number_type_slug_key" ON "emergency_number_type"("slug");

-- CreateIndex
CREATE INDEX "idx_help_link_category" ON "help_link"("category");

-- CreateIndex
CREATE UNIQUE INDEX "supply_category_slug_key" ON "supply_category"("slug");

-- CreateIndex
CREATE INDEX "idx_general_supply_category_id" ON "general_supply"("category_id");

-- AddForeignKey
ALTER TABLE "state_aid_level" ADD CONSTRAINT "state_aid_level_state_aid_id_fkey" FOREIGN KEY ("state_aid_id") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_center" ADD CONSTRAINT "collection_center_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_center" ADD CONSTRAINT "collection_center_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter" ADD CONSTRAINT "shelter_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter" ADD CONSTRAINT "shelter_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital" ADD CONSTRAINT "hospital_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urgent_need" ADD CONSTRAINT "urgent_need_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urgent_need" ADD CONSTRAINT "urgent_need_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_number" ADD CONSTRAINT "emergency_number_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_number" ADD CONSTRAINT "emergency_number_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "emergency_number_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_number" ADD CONSTRAINT "emergency_number_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_link" ADD CONSTRAINT "help_link_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "general_supply" ADD CONSTRAINT "general_supply_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "supply_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_center_supply" ADD CONSTRAINT "collection_center_supply_collection_center_id_fkey" FOREIGN KEY ("collection_center_id") REFERENCES "collection_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_center_supply" ADD CONSTRAINT "collection_center_supply_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "general_supply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_supply" ADD CONSTRAINT "shelter_supply_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_supply" ADD CONSTRAINT "shelter_supply_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "general_supply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
