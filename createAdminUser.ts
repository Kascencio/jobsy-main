// createAdminUser.ts

import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

async function createAdminUser() {
  const hashedPassword = await hash('12345', 10);

  try {
    const adminUser = await prisma.usuario.create({
      data: {
        usu_nombre: 'Admin',
        usu_email: 'admin@ADMINISTRADOR.com',
        usu_password: hashedPassword,
        usu_rol: 'administrador',
        // Add other fields if necessary
      },
    });
    console.log('Administrator user created:', adminUser);
  } catch (error) {
    console.error('Error creating administrator user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
