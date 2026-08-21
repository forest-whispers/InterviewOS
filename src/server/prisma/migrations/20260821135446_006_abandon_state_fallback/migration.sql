-- CreateTable
CREATE TABLE "InterviewRuntimeState" (
    "id" TEXT NOT NULL,
    "interviewSessionId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewRuntimeState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewRuntimeState_interviewSessionId_key" ON "InterviewRuntimeState"("interviewSessionId");

-- CreateIndex
CREATE INDEX "InterviewRuntimeState_expiresAt_idx" ON "InterviewRuntimeState"("expiresAt");

-- AddForeignKey
ALTER TABLE "InterviewRuntimeState" ADD CONSTRAINT "InterviewRuntimeState_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
