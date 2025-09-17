"use client"

import { useState } from "react"
import { Briefcase, Building2, Tag, Calendar, Eye, EyeOff, Trash2, ExternalLink, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PostulacionesList from "./PostulacionesList"
import Link from "next/link"

export interface Empleo {
  emp_id: number
  emp_titulo: string
  emp_descripcion?: string
  emp_empresa_id: number
  emp_categoria_id: number
  emp_fecha_publicacion: string
  empresa?: Empresa
  categoria?: Categoria
  empleo_habilidades?: EmpleoHabilidad[]
}

export interface Habilidad {
  hab_id: number
  hab_nombre: string
}

export interface EmpleoHabilidad {
  habilidad: Habilidad
}

export interface Empresa {
  emp_id: number
  emp_nombre: string
  emp_sector: string
}

export interface Categoria {
  cat_id: number
  cat_nombre: string
}

interface Props {
  empleos: Empleo[]
}

export default function EmpleosList({ empleos }: Props) {
  const [empleoSeleccionado, setEmpleoSeleccionado] = useState<number | null>(null)
  const [listaEmpleos, setListaEmpleos] = useState<Empleo[]>(empleos)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleDelete = async (empId: number) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este empleo?")
    if (!confirmar) return

    setIsDeleting(empId)

    try {
      const res = await fetch(`/api/reclutador/empleos/${empId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setListaEmpleos((prevEmpleos) => prevEmpleos.filter((empleo) => empleo.emp_id !== empId))
        // Si el empleo eliminado era el seleccionado, cerrar las postulaciones
        if (empleoSeleccionado === empId) {
          setEmpleoSeleccionado(null)
        }
      } else {
        const errorData = await res.json()
        alert(`Error al eliminar el empleo: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error al eliminar el empleo:", error)
      alert("Error al eliminar el empleo")
    } finally {
      setIsDeleting(null)
    }
  }

  const togglePostulaciones = (empId: number) => {
    if (empleoSeleccionado === empId) {
      setEmpleoSeleccionado(null)
    } else {
      setEmpleoSeleccionado(empId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (listaEmpleos.length === 0) {
    return (
      <Alert>
        <Briefcase className="h-4 w-4" />
        <AlertDescription>No tienes empleos publicados aún.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {listaEmpleos.map((empleo) => (
        <Card key={empleo.emp_id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    <Link href={`/ofertas/${empleo.emp_id}`} className="hover:text-blue-600 transition-colors">
                      {empleo.emp_titulo}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    {empleo.empresa && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {empleo.empresa.emp_nombre}
                      </span>
                    )}
                    {empleo.categoria && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {empleo.categoria.cat_nombre}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(empleo.emp_fecha_publicacion)}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary">Activa</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Description */}
            {empleo.emp_descripcion && <p className="text-gray-600 text-sm line-clamp-2">{empleo.emp_descripcion}</p>}

            {/* Skills */}
            {empleo.empleo_habilidades && empleo.empleo_habilidades.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Habilidades requeridas:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {empleo.empleo_habilidades.map((eh) => (
                    <Badge key={eh.habilidad.hab_id} variant="outline" className="text-xs">
                      {eh.habilidad.hab_nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePostulaciones(empleo.emp_id)}
                className="flex items-center gap-2"
              >
                {empleoSeleccionado === empleo.emp_id ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Ocultar Postulaciones
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Ver Postulaciones
                  </>
                )}
              </Button>

              <Link href={`/ofertas/${empleo.emp_id}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Oferta
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(empleo.emp_id)}
                disabled={isDeleting === empleo.emp_id}
                className="ml-auto"
              >
                {isDeleting === empleo.emp_id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting === empleo.emp_id ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>

            {/* Postulaciones */}
            {empleoSeleccionado === empleo.emp_id && <PostulacionesList empId={empleo.emp_id} />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
