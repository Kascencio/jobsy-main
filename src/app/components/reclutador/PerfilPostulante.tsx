"use client"

import { useState, useEffect } from "react"
import { X, User, Mail, Phone, MapPin, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Usuario {
  usu_id: number
  usu_nombre: string
  usu_apellido?: string
  usu_email: string
  usu_telefono?: string
  usu_direccion?: string
  usu_resumen?: string
  usuario_habilidades?: {
    habilidad: {
      hab_nombre: string
    }
  }[]
  cvs?: {
    id: number
  }[]
}

interface Props {
  usuarioId: number
  onClose: () => void
}

export default function PerfilPostulante({ usuarioId, onClose }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`/api/usuarios/${usuarioId}`)
        if (res.ok) {
          const data = await res.json()
          setUsuario(data)
        } else {
          console.error("Error al obtener el perfil del usuario")
        }
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsuario()
  }, [usuarioId])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-red-600">Error al cargar el perfil del usuario</p>
          <Button onClick={onClose} className="mt-4">
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  const cvUrl = usuario.cvs && usuario.cvs.length > 0 ? `/api/cv/${usuario.cvs[usuario.cvs.length - 1].id}` : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Perfil del Candidato</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600">
                    {usuario.usu_nombre?.[0]}
                    {usuario.usu_apellido?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {usuario.usu_nombre} {usuario.usu_apellido}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {usuario.usu_email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usuario.usu_telefono && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{usuario.usu_telefono}</span>
                  </div>
                )}
                {usuario.usu_direccion && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{usuario.usu_direccion}</span>
                  </div>
                )}
              </div>

              {/* Professional Summary */}
              {usuario.usu_resumen && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Resumen Profesional
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{usuario.usu_resumen}</p>
                  </div>
                </>
              )}

              {/* Skills */}
              {usuario.usuario_habilidades && usuario.usuario_habilidades.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Habilidades
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {usuario.usuario_habilidades.map((uh, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {uh.habilidad.hab_nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* CV Viewer */}
          {cvUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Currículum Vitae
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <iframe src={cvUrl} width="100%" height="600px" title="CV" className="border-0" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
