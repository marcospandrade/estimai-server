/*
  Warnings:

  - Added the required column `url_authenticated` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "url_authenticated" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);
