-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "match_uuid" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);
