/*
  Warnings:

  - The primary key for the `Observations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Observations" DROP CONSTRAINT "Observations_pkey",
ADD CONSTRAINT "Observations_pkey" PRIMARY KEY ("id");
