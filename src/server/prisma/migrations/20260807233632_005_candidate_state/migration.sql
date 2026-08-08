-- CreateTable
CREATE TABLE "CandidateState" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateState_candidateProfileId_key" ON "CandidateState"("candidateProfileId");

-- AddForeignKey
ALTER TABLE "CandidateState" ADD CONSTRAINT "CandidateState_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
