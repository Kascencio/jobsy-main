"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { User, Mail, Phone, MapPin, Upload, FileText, Zap, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HabilidadOption {
  value: number
  label: string
}

interface Habilidad {
  hab_id: number
  hab_nombre: string
}

interface UsuarioHabilidad {
  habilidad: Habilidad
}

export default function PerfilForm() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    resumen: "",
  })

  const [habilidadesOptions, setHabilidadesOptions] = useState<Habilidad[]>([])
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<number[]>([])
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUploadingCV, setIsUploadingCV] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadCV(file)
    }
  }

  const uploadCV = async (file: File) => {
    if (!session?.user?.id) {
      setMessage({ type: "error", text: "Debes estar autenticado para subir un CV." })
      return
    }

    setIsUploadingCV(true)
    const formData = new FormData()
    formData.append("cv", file)
    formData.append("usuarioId", session.user.id.toString())

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "CV subido exitosamente" })
        if (data.cvId) {
          setCvUrl(`/api/cv/${data.cvId}`)
        }
        fetchUserData()
      } else {
        setMessage({ type: "error", text: `Error al subir el CV: ${data.error}` })
      }
    } catch (error) {
      console.error("Error al subir el CV:", error)
      setMessage({ type: "error", text: "Error al subir el CV" })
    } finally {
      setIsUploadingCV(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const resHabilidades = await fetch("/api/habilidades")
      const habilidadesData: Habilidad[] = await resHabilidades.json()
      setHabilidadesOptions(habilidadesData)

      const resUsuario = await fetch("/api/candidato/perfil")
      const data = await resUsuario.json()
      setForm({
        nombre: data.usu_nombre || "",
        apellido: data.usu_apellido || "",
        email: data.usu_email || "",
        telefono: data.usu_telefono || "",
        direccion: data.usu_direccion || "",
        resumen: data.usu_resumen || "",
      })

      if (data.usuario_habilidades) {
        const habilidadesSeleccionadas = data.usuario_habilidades.map((uh: UsuarioHabilidad) => uh.habilidad.hab_id)
        setHabilidadesSeleccionadas(habilidadesSeleccionadas)
      }

      if (data.cvs && data.cvs.length > 0) {
        const latestCV = data.cvs[data.cvs.length - 1]
        setCvUrl(`/api/cv/${latestCV.id}`)
      } else {
        setCvUrl(null)
      }
    } catch (error) {
      console.error("Error al obtener datos:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMessage(null)
  }

  const toggleHabilidad = (habilidadId: number) => {
    setHabilidadesSeleccionadas((prev) =>
      prev.includes(habilidadId) ? prev.filter((id) => id !== habilidadId) : [...prev, habilidadId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/candidato/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, habilidades: habilidadesSeleccionadas }),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Perfil actualizado correctamente" })
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: `Error al actualizar el perfil: ${data.error}` })
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      setMessage({ type: "error", text: "Error al actualizar el perfil" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Información Personal
            </CardTitle>
            <CardDescription>Actualiza tus datos personales y de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  type="text"
                  placeholder="Tu apellido"
                  value={form.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefono"
                    name="telefono"
                    type="text"
                    placeholder="+34 600 123 456"
                    value={form.telefono}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Tu dirección"
                    value={form.direccion}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Habilidades
            </CardTitle>
            <CardDescription>Selecciona tus habilidades profesionales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border rounded-lg bg-gray-50">
              {habilidadesOptions.map((habilidad) => (
                <div
                  key={habilidad.hab_id}
                  onClick={() => toggleHabilidad(habilidad.hab_id)}
                  className={`cursor-pointer p-2 rounded-md text-sm transition-colors ${
                    habilidadesSeleccionadas.includes(habilidad.hab_id)
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-white hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {habilidad.hab_nombre}
                </div>
              ))}
            </div>
            {habilidadesSeleccionadas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Seleccionadas:</span>
                {habilidadesSeleccionadas.map((id) => {
                  const habilidad = habilidadesOptions.find((h) => h.hab_id === id)
                  return (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {habilidad?.hab_nombre}
                    </Badge>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Currículum Vitae
            </CardTitle>
            <CardDescription>Sube tu CV en formato PDF, DOC o DOCX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
                disabled={isUploadingCV}
              />
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={isUploadingCV} asChild>
                  <span>
                    {isUploadingCV ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        Subiendo...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Subir CV
                      </div>
                    )}
                  </span>
                </Button>
              </Label>
              {cvUrl && <Badge className="bg-green-100 text-green-800">CV cargado</Badge>}
            </div>

            {cvUrl && (
              <div className="border rounded-lg overflow-hidden">
                <iframe src={cvUrl} width="100%" height="400px" title="CV" className="border-0" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen Profesional</CardTitle>
            <CardDescription>Describe brevemente tu experiencia y objetivos profesionales</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="resumen"
              placeholder="Escribe un breve resumen de tu experiencia profesional, habilidades destacadas y objetivos de carrera..."
              value={form.resumen}
              onChange={handleChange}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Actualizando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Actualizar Perfil
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
