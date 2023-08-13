/*
  Warnings:

  - You are about to drop the column `code` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refresh_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_code_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "code",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_access_token_key" ON "User"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_refresh_token_key" ON "User"("refresh_token");
