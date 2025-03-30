-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "email" TEXT,
    "display_name" TEXT,
    "country" TEXT,
    "profile_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_spotifyId_key" ON "users"("spotifyId");
