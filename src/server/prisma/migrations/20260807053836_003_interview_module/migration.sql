-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InterviewMessageRole" AS ENUM ('ASSISTANT', 'USER', 'SYSTEM');

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'CREATED',
    "interviewPlan" JSONB NOT NULL,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewMessage" (
    "id" TEXT NOT NULL,
    "interviewSessionId" TEXT NOT NULL,
    "role" "InterviewMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewSession_candidateId_idx" ON "InterviewSession"("candidateId");

-- CreateIndex
CREATE INDEX "InterviewSession_resumeId_idx" ON "InterviewSession"("resumeId");

-- CreateIndex
CREATE INDEX "InterviewSession_status_idx" ON "InterviewSession"("status");

-- CreateIndex
CREATE INDEX "InterviewMessage_interviewSessionId_idx" ON "InterviewMessage"("interviewSessionId");

-- CreateIndex
CREATE INDEX "InterviewMessage_createdAt_idx" ON "InterviewMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewMessage" ADD CONSTRAINT "InterviewMessage_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
