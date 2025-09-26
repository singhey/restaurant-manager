/*
  Warnings:

  - The `services` column on the `MenuItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."MenuItem" DROP COLUMN "services",
ADD COLUMN     "services" TEXT[];
