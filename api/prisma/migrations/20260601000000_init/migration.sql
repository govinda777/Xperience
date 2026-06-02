-- CreateTable
CREATE TABLE "UserXp" (
    "user_id" TEXT NOT NULL,
    "wallet_address" TEXT,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserXp_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "XpTransaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionCooldown" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_key" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_claimed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionCooldown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet_number" TEXT NOT NULL,
    "privy_id" TEXT NOT NULL,
    "company_id" TEXT,
    "parent_id" TEXT,
    "department_id" TEXT,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "root_user_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Em subida',
    "business_map_status" TEXT NOT NULL DEFAULT 'Pendente',
    "business_map_data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentTrack" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "kpis" JSONB NOT NULL DEFAULT '{}',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWallet" (
    "user_id" TEXT NOT NULL,
    "eoa_address" TEXT NOT NULL,
    "smart_account_address" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'sepolia',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserXp_wallet_address_key" ON "UserXp"("wallet_address");

-- CreateIndex
CREATE INDEX "UserXp_wallet_address_idx" ON "UserXp"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "XpTransaction_nonce_key" ON "XpTransaction"("nonce");

-- CreateIndex
CREATE INDEX "XpTransaction_user_id_idx" ON "XpTransaction"("user_id");

-- CreateIndex
CREATE INDEX "MissionCooldown_user_id_idx" ON "MissionCooldown"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "MissionCooldown_user_id_mission_key_key" ON "MissionCooldown"("user_id", "mission_key");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_number_key" ON "User"("wallet_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_privy_id_key" ON "User"("privy_id");

-- CreateIndex
CREATE INDEX "User_wallet_number_idx" ON "User"("wallet_number");

-- CreateIndex
CREATE INDEX "User_privy_id_idx" ON "User"("privy_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_root_user_id_key" ON "Company"("root_user_id");

-- CreateIndex
CREATE INDEX "Company_root_user_id_idx" ON "Company"("root_user_id");

-- CreateIndex
CREATE INDEX "DepartmentTrack_company_id_idx" ON "DepartmentTrack"("company_id");

-- CreateIndex
CREATE INDEX "UserWallet_user_id_idx" ON "UserWallet"("user_id");

-- AddForeignKey
ALTER TABLE "XpTransaction" ADD CONSTRAINT "XpTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserXp"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "DepartmentTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_root_user_id_fkey" FOREIGN KEY ("root_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentTrack" ADD CONSTRAINT "DepartmentTrack_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
