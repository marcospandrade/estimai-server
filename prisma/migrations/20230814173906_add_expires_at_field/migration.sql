/*
  Warnings:

  - Added the required column `expires_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expires_at" INTEGER NOT NULL;
