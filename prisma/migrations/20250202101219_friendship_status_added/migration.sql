/*
  Warnings:

  - The `status` column on the `Friend` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "status",
ADD COLUMN     "status" "FriendStatus" NOT NULL DEFAULT 'PENDING';
