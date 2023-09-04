/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "access_token_estimai" TEXT NOT NULL,
    "access_token_atlassian" TEXT NOT NULL,
    "expires_at" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT,
    "job_title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_access_token_estimai_key" ON "users"("access_token_estimai");

-- CreateIndex
CREATE UNIQUE INDEX "users_access_token_atlassian_key" ON "users"("access_token_atlassian");

-- CreateIndex
CREATE UNIQUE INDEX "users_refresh_token_key" ON "users"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_state_key" ON "users"("state");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
