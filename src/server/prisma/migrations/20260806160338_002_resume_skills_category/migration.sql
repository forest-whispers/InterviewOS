/*
  Warnings:

  - The `category` column on the `ResumeSkill` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('LANGUAGE', 'FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'CLOUD', 'AI_ML', 'TOOLS', 'OTHER');

-- AlterTable
ALTER TABLE "ResumeSkill" DROP COLUMN "category",
ADD COLUMN     "category" "SkillCategory";
