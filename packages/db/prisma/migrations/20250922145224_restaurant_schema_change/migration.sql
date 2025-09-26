/*
  Warnings:

  - You are about to drop the column `address` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "compliance" JSONB,
ADD COLUMN     "delivery" JSONB,
ADD COLUMN     "position" JSONB,
ADD COLUMN     "reviewLinks" JSONB,
ALTER COLUMN "timezone" SET DEFAULT 'IST';

-- CreateTable
CREATE TABLE "public"."RestaurantSEO" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "gTag" TEXT,
    "fbPixel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantSEO_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantSEO_restaurantId_key" ON "public"."RestaurantSEO"("restaurantId");

-- AddForeignKey
ALTER TABLE "public"."RestaurantSEO" ADD CONSTRAINT "RestaurantSEO_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
