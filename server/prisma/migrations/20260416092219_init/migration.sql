-- CreateTable
CREATE TABLE "dtci_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "openid" TEXT NOT NULL,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "profession" TEXT,
    "education" TEXT,
    "marriage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dtci_assessments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "answers" TEXT,
    "dScore" REAL,
    "tScore" REAL,
    "cScore" REAL,
    "iScore" REAL,
    "resultType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dtci_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dtci_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dtci_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentTime" DATETIME,
    "transactionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dtci_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dtci_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dtci_orders_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "dtci_assessments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "dtci_users_openid_key" ON "dtci_users"("openid");

-- CreateIndex
CREATE UNIQUE INDEX "dtci_orders_orderNo_key" ON "dtci_orders"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "dtci_orders_assessmentId_key" ON "dtci_orders"("assessmentId");
