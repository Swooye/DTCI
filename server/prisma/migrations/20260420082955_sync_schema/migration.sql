-- AlterTable
ALTER TABLE "dtci_users" ADD COLUMN "city" TEXT;

-- CreateTable
CREATE TABLE "dtci_cases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "tag" TEXT NOT NULL,
    "tagColor" TEXT NOT NULL DEFAULT '#FF6B35',
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dtci_cases_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "dtci_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dtci_admin_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "email" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dtci_services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "description" TEXT,
    "content" TEXT DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'personal',
    "sales" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dtci_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "dtci_admin_users_username_key" ON "dtci_admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "dtci_settings_key_key" ON "dtci_settings"("key");
