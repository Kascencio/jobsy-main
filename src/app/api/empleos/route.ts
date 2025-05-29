import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const empleos = await prisma.empleo.findMany({
      include: {
        empresa: true,
        categoria: true,
        empleo_habilidades: {
          include: {
            habilidad: true,
          },
        },
      },
      orderBy: {
        emp_fecha_publicacion: "desc",
      },
      take: 50, // Limitar a 50 empleos para rendimiento
    })

    return NextResponse.json(empleos)
  } catch (error) {
    console.error("Error al obtener empleos públicos:", error)
    return NextResponse.json({ error: "Error al obtener empleos" }, { status: 500 })
  }
}
