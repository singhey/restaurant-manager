-- CreateEnum
CREATE TYPE "public"."DISH_TYPE" AS ENUM ('VEG', 'NON_VEG', 'EGG');

-- CreateEnum
CREATE TYPE "public"."SERVICES" AS ENUM ('DELIVERY', 'TAKEAWAY', 'DINE_IN');

-- AlterTable
ALTER TABLE "public"."MenuItem" ADD COLUMN     "dishType" "public"."DISH_TYPE" NOT NULL DEFAULT 'VEG',
ADD COLUMN     "services" "public"."SERVICES"[];
