/*
  Warnings:

  - You are about to drop the column `access_token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token_estimai]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token_atlassian]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token_atlassian` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token_estimai` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_access_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "access_token",
ADD COLUMN     "access_token_atlassian" TEXT NOT NULL,
ADD COLUMN     "access_token_estimai" TEXT NOT NULL,
ALTER COLUMN "expires_at" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "User_access_token_estimai_key" ON "User"("access_token_estimai");

-- CreateIndex
CREATE UNIQUE INDEX "User_access_token_atlassian_key" ON "User"("access_token_atlassian");
