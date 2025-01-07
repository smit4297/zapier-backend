/*
  Warnings:

  - Changed the type of `metaData` on the `ZapRun` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ZapRun" DROP COLUMN "metaData",
ADD COLUMN     "metaData" JSONB NOT NULL;
