import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Rafael@2021';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // Buscar admin do banco ou usar senha padrão do env
  const admin = await prisma.adminUser.findFirst();
  
  if (admin) {
    return bcrypt.compare(password, admin.password);
  }
  
  // Se não existe admin, verificar contra senha do env
  return password === ADMIN_PASSWORD;
}

export async function createAdminUser(username: string, password: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.adminUser.upsert({
    where: { username },
    update: { password: hashedPassword },
    create: {
      username,
      password: hashedPassword,
    },
  });
}

export async function initAdminUser(): Promise<void> {
  const adminExists = await prisma.adminUser.findFirst();
  
  if (!adminExists && ADMIN_PASSWORD) {
    await createAdminUser('admin', ADMIN_PASSWORD);
  }
}

