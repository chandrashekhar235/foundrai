/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "provider",
DROP COLUMN "updatedAt";
