"use client"

import { useState, useEffect } from "react"
import { Users, Star, CheckCircle, XCircle, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PerfilPostulante from "./PerfilPostulante"

interface Usuario {
  usu_id: number
  usu_nombre: string
  usu_apellido?: string
  usu_email: string
}

interface Postulacion {
  pos_id: number
  pos_usuario_id: number
  pos_empleo_id: number
  pos_fecha_postulacion: string
  pos_estado: string
  usuario: Usuario
  puntaje: number
}

interface Props {
  empId: number
}

export default function PostulacionesList({ empId }: Props) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const res = await fetch(`/api/reclutador/empleos/${empId}/postulaciones`)
        if (res.ok) {
          const data = await res.json()
          setPostulaciones(data)
        } else {
          console.error("Error al obtener las postulaciones")
        }
      } catch (error) {
        console.error("Error al obtener las postulaciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostulaciones()
  }, [empId])

  const actualizarEstado = async (posId: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/reclutador/postulaciones/${posId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevoEstado }),
      })

      if (res.ok) {
        setPostulaciones((prevPostulaciones) =>
          prevPostulaciones.map((p) => (p.pos_id === posId ? { ...p, pos_estado: nuevoEstado } : p)),
        )
      } else {
        alert("Error al actualizar la postulación")
      }
    } catch (error) {
      console.error("Error al actualizar postulación:", error)
      alert("Error al actualizar la postulación")
    }
  }

  const verPerfil = (usuarioId: number) => {
    setUsuarioSeleccionado(usuarioId)
  }

  const cerrarPerfil = () => {
    setUsuarioSeleccionado(null)
  }

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "aceptada":
        return "bg-green-100 text-green-800"
      case "rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCompatibilityColor = (puntaje: number) => {
    if (puntaje >= 80) return "text-green-600"
    if (puntaje >= 60) return "text-yellow-600"
    return "text-red-600"
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
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>No hay postulaciones para este empleo.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">Postulaciones ({postulaciones.length})</h4>
      </div>

      <div className="space-y-4">
        {postulaciones.map((postulacion) => (
          <Card key={postulacion.pos_id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600">
                      {postulacion.usuario.usu_nombre?.[0]}
                      {postulacion.usuario.usu_apellido?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {postulacion.usuario.usu_nombre} {postulacion.usuario.usu_apellido}
                    </h5>
                    <p className="text-sm text-gray-600">{postulacion.usuario.usu_email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(postulacion.pos_estado)}`}>
                        {postulacion.pos_estado}
                      </Badge>
                      {typeof postulacion.puntaje === "number" && !isNaN(postulacion.puntaje) && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className={`text-xs font-medium ${getCompatibilityColor(postulacion.puntaje)}`}>
                            {postulacion.puntaje.toFixed(1)}% compatibilidad
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verPerfil(postulacion.usuario.usu_id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Perfil
                  </Button>
                  {postulacion.pos_estado.toLowerCase() === "pendiente" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => actualizarEstado(postulacion.pos_id, "Aceptada")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => actualizarEstado(postulacion.pos_id, "Rechazada")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {usuarioSeleccionado && <PerfilPostulante usuarioId={usuarioSeleccionado} onClose={cerrarPerfil} />}
    </div>
  )
}
