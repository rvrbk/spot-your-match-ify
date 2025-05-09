/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "uuid" TEXT,
ALTER COLUMN "created_at" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");
