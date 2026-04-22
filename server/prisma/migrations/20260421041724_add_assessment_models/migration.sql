-- CreateTable
CREATE TABLE "dtci_questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "type" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "geneType" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "operator" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dtci_questionnaires" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "questions" TEXT NOT NULL,
    "settings" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "wechatConfig" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
