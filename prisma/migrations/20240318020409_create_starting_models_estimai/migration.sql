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
    "url_authenticated" TEXT NOT NULL,
    "cloud_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprints" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "goals" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "description" TEXT,
    "issueKey" TEXT NOT NULL,
    "sprintId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" TEXT,
    "role" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_participats" (
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
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

-- CreateIndex
CREATE INDEX "users_state_email_idx" ON "users"("state", "email");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_issueId_key" ON "tasks"("issueId");

-- CreateIndex
CREATE INDEX "tasks_issueId_idx" ON "tasks"("issueId");

-- CreateIndex
CREATE INDEX "team_participats_teamId_participantId_idx" ON "team_participats"("teamId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "team_participats_teamId_participantId_key" ON "team_participats"("teamId", "participantId");

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_participats" ADD CONSTRAINT "team_participats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_participats" ADD CONSTRAINT "team_participats_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
