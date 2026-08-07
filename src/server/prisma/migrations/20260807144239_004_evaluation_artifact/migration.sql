/*
  Warnings:

  - The values [CANCELLED] on the enum `InterviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewStatus_new" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');
ALTER TABLE "public"."InterviewSession" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "InterviewSession" ALTER COLUMN "status" TYPE "InterviewStatus_new" USING ("status"::text::"InterviewStatus_new");
ALTER TYPE "InterviewStatus" RENAME TO "InterviewStatus_old";
ALTER TYPE "InterviewStatus_new" RENAME TO "InterviewStatus";
DROP TYPE "public"."InterviewStatus_old";
ALTER TABLE "InterviewSession" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- CreateTable
CREATE TABLE "InterviewEvaluation" (
    "id" TEXT NOT NULL,
    "interviewSessionId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "technicalScore" DOUBLE PRECISION NOT NULL,
    "communicationScore" DOUBLE PRECISION NOT NULL,
    "artifact" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewEvaluation_interviewSessionId_key" ON "InterviewEvaluation"("interviewSessionId");

-- CreateIndex
CREATE INDEX "InterviewEvaluation_overallScore_idx" ON "InterviewEvaluation"("overallScore");

-- CreateIndex
CREATE INDEX "InterviewEvaluation_createdAt_idx" ON "InterviewEvaluation"("createdAt");

-- AddForeignKey
ALTER TABLE "InterviewEvaluation" ADD CONSTRAINT "InterviewEvaluation_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
