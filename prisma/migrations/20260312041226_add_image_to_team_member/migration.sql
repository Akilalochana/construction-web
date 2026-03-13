/*
  Warnings:

  - You are about to drop the column `label` on the `BeforeAfter` table. All the data in the column will be lost.
  - Added the required column `title` to the `BeforeAfter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BeforeAfter" DROP COLUMN "label",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" VARCHAR(200),
ADD COLUMN     "title" VARCHAR(200) NOT NULL,
ADD COLUMN     "year" VARCHAR(10),
ALTER COLUMN "order" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "image" TEXT;
