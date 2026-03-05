-- ============================================================
-- Dados iniciais — Power Run
-- ============================================================
-- Este ficheiro NÃO cria tabelas. As tabelas são criadas pelas
-- migrações do Prisma (prisma migrate dev / migrate deploy).
--
-- Executar DEPOIS de aplicar as migrações (prisma migrate deploy).
-- Cria um utilizador admin para primeiro acesso.
--
-- Credenciais padrão (ALTERAR no primeiro login ou via painel):
--   Utilizador: admin
--   Senha:      PowerRun2025!
--
-- Para usar outra senha: não execute este ficheiro e use em vez disso:
--   npm run admin:init
-- com ADMIN_PASSWORD definido no .env.local
-- ============================================================

-- Evitar duplicar o admin se o seed for executado mais de uma vez
DELETE FROM "AdminUser" WHERE username = 'admin';

INSERT INTO "AdminUser" (
  id,
  username,
  password,
  "createdAt",
  "updatedAt"
) VALUES (
  'clseed000000000000000000001',
  'admin',
  '$2b$10$Jn1sg.uohnpxVsi2iK5Na.m5mKOexHpF3/dmT7kmoGYyulOw5Tx.W',
  NOW(),
  NOW()
);
