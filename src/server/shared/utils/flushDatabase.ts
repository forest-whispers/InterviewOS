// scripts/clear-db.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️ Clearing database...");

    // Children first
    await prisma.interviewMessage.deleteMany();
    await prisma.interviewEvaluation.deleteMany();

    await prisma.interviewSession.deleteMany();

    await prisma.resumeSkill.deleteMany();
    await prisma.resumeProject.deleteMany();
    await prisma.resumeEducation.deleteMany();

    await prisma.candidateState.deleteMany();

    await prisma.resume.deleteMany();

    await prisma.candidateProfile.deleteMany();

    await prisma.user.deleteMany();

    console.log("✅ Database completely cleared.");
}

main()
    .catch((error) => {
        console.error("❌ Failed to clear database:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });