/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Restaurant" DROP CONSTRAINT "Restaurant_organizationId_fkey";

-- DropIndex
DROP INDEX "public"."Restaurant_organizationId_key";

-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "organizationId",
ALTER COLUMN "currency" SET DEFAULT 'INR';

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- AddForeignKey
ALTER TABLE "public"."Restaurant" ADD CONSTRAINT "Restaurant_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."organization"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
