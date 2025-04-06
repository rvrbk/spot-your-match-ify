-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('Friends', 'Romance');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "goal" "Goal";
