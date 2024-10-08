import { getServerSession, NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

interface CustomUser extends User {
  role: string;
}

interface CustomSession extends Omit<Session, "user"> {
  user?: CustomUser & {
    id: string;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.usuario.findUnique({
          where: { usu_email: credentials.email },
        });

        if (!user) return null;

        const isValidPassword = await compare(credentials.password, user.usu_password);

        if (!isValidPassword) return null;

        return {
          id: user.usu_id.toString(),
          name: user.usu_nombre,
          email: user.usu_email,
          role: user.usu_rol,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<CustomSession> {
      return {
        ...session,
        user: session.user ? {
          ...session.user,
          id: token.sub!,
          role: token.role as string,
        } : undefined
      };
    },
    async jwt({ token, user }: { token: JWT; user?: CustomUser }): Promise<JWT> {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const empleos = await prisma.empleo.findMany({
    where: { emp_empresa_id: Number(session.user.id) },
    include: {
      empresa: true,
      categoria: true,
    },
  });

  return NextResponse.json(empleos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const data = await request.json();

  try {
    const empleo = await prisma.empleo.create({
      data: {
        emp_titulo: data.titulo,
        emp_descripcion: data.descripcion,
        emp_categoria_id: Number(data.categoria_id),
        emp_fecha_publicacion: new Date(),
        emp_salario_min: data.salario_min ? Number(data.salario_min) : null,
        emp_salario_max: data.salario_max ? Number(data.salario_max) : null,
        emp_tipo_contrato: data.tipo_contrato,
        emp_requisitos: data.requisitos,
        emp_beneficios: data.beneficios,
        emp_num_vacantes: data.num_vacantes ? Number(data.num_vacantes) : 1,
        emp_empresa_id: Number(session.user.id),
      },
    });

    return NextResponse.json(empleo);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error al crear el empleo' }, { status: 500 });
  }
}
