/*
  Warnings:

  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemAddon` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSettlement` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItemAddon" DROP CONSTRAINT "OrderItemAddon_addonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItemAddon" DROP CONSTRAINT "OrderItemAddon_orderItemId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "customerId",
ADD COLUMN     "customer" JSONB,
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "orderSettlement" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."OrderItem";

-- DropTable
DROP TABLE "public"."OrderItemAddon";
