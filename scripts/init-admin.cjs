require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Rafael@2021';

async function main() {
  try {
    console.log('Inicializando usuário admin...');
    
    const admin = await prisma.adminUser.findFirst();
    
    if (!admin && ADMIN_PASSWORD) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await prisma.adminUser.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });
      console.log('✅ Usuário admin criado com sucesso!');
      console.log(`   Username: admin`);
      console.log(`   Senha: ${ADMIN_PASSWORD}`);
    } else if (admin) {
      console.log('ℹ️  Usuário admin já existe.');
    } else {
      console.log('⚠️  ADMIN_PASSWORD não configurado no .env.local');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

