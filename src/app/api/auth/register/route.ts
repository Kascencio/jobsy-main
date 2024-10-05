// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  const data = await request.json();

  const hashedPassword = await hash(data.password, 10);

  try {
    const user = await prisma.usuario.create({
      data: {
        usu_nombre: data.nombre,
        usu_apellido: data.apellido,
        usu_email: data.email,
        usu_password: hashedPassword,
        usu_rol: data.rol,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error registering user:', error); // log the error
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}