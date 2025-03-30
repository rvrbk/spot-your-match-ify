-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preference" "Sex",
ADD COLUMN     "sex" "Sex";
