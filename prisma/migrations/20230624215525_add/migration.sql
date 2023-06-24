/*
  Warnings:

  - A unique constraint covering the columns `[state]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "state" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_state_key" ON "User"("state");
