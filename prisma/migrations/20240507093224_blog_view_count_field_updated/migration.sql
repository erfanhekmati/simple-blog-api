-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "viewCount" DROP NOT NULL,
ALTER COLUMN "viewCount" SET DEFAULT 0;