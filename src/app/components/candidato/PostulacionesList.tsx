"use client"

import { useState, useEffect } from "react"
import { FileText, Building2, Clock, ExternalLink, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Empresa {
  emp_id: number
  emp_nombre: string
}

interface Empleo {
  emp_id: number
  emp_titulo: string
  empresa: Empresa
}

interface Postulacion {
  pos_id: number
  pos_empleo_id: number
  pos_estado: string
  empleo: Empleo
}

export default function PostulacionesList() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/candidato/postulaciones")
        const data: Postulacion[] = await res.json()
        setPostulaciones(data)
      } catch (error) {
        console.error("Error al obtener postulaciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en revisión":
        return "bg-blue-100 text-blue-800"
      case "aceptada":
        return "bg-green-100 text-green-800"
      case "rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return <Clock className="h-4 w-4" />
      case "en revisión":
        return <FileText className="h-4 w-4" />
      case "aceptada":
        return <FileText className="h-4 w-4" />
      case "rechazada":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando postulaciones...</p>
      </div>
    )
  }

  if (postulaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes postulaciones</h3>
        <p className="text-gray-600 mb-4">No has postulado a ninguna oferta aún.</p>
        <Link href="/jobs">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
            Explorar Empleos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Mis Postulaciones</h3>
        <Badge variant="secondary">{postulaciones.length} aplicaciones</Badge>
      </div>

      <div className="space-y-4">
        {postulaciones.map((postulacion) => (
          <Card key={postulacion.pos_id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      <Link
                        href={`/ofertas/${postulacion.empleo.emp_id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {postulacion.empleo.emp_titulo}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-blue-600 font-medium">
                      {postulacion.empleo.empresa.emp_nombre}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`${getStatusColor(postulacion.pos_estado)} flex items-center gap-1`}>
                  {getStatusIcon(postulacion.pos_estado)}
                  {postulacion.pos_estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Link href={`/ofertas/${postulacion.empleo.emp_id}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Oferta
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
