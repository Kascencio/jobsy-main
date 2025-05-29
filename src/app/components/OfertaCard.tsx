"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { Building2, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface OfertaCardProps {
  id: number
  titulo: string
  empresa: string
  ubicacion?: string
  fechaPublicacion: string
}

export default function OfertaCard({ id, titulo, empresa, ubicacion, fechaPublicacion }: OfertaCardProps) {
  const fechaFormateada = format(new Date(fechaPublicacion), "dd MMM yyyy", { locale: es })

  // Calcular días desde la publicación
  const diasDesdePublicacion = Math.floor(
    (new Date().getTime() - new Date(fechaPublicacion).getTime()) / (1000 * 3600 * 24),
  )

  const tiempoTexto =
    diasDesdePublicacion === 0 ? "Hoy" : diasDesdePublicacion === 1 ? "Ayer" : `Hace ${diasDesdePublicacion} días`

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-[1.02] bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {titulo}
              </CardTitle>
              <p className="text-blue-600 font-medium text-sm mt-1">{empresa}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Información adicional */}
        <div className="space-y-2">
          {ubicacion && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{ubicacion}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{tiempoTexto}</span>
          </div>
        </div>

        {/* Badge de fecha */}
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            {fechaFormateada}
          </Badge>

          {diasDesdePublicacion <= 3 && (
            <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">Nuevo</Badge>
          )}
        </div>

        {/* Botón de acción */}
        <Link href={`/ofertas/${id}`} className="block">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 group-hover:shadow-md transition-all duration-300"
            size="sm"
          >
            <span>Ver más</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
