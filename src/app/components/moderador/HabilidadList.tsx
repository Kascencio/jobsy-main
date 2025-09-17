"use client"

import { useState, useEffect } from "react"
import { Trash2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Habilidad {
  hab_id: number
  hab_nombre: string
}

export default function HabilidadList() {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const fetchHabilidades = async () => {
      try {
        const res = await fetch("/api/moderador/habilidades")
        if (res.ok) {
          const data = await res.json()
          setHabilidades(data)
        }
      } catch (error) {
        console.error("Error al obtener habilidades:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHabilidades()
  }, [])

  const eliminarHabilidad = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) {
      return
    }

    try {
      const res = await fetch(`/api/moderador/habilidades/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Habilidad eliminada correctamente" })
        setHabilidades(habilidades.filter((hab) => hab.hab_id !== id))
      } else {
        setMessage({ type: "error", text: "Error al eliminar la habilidad" })
      }
    } catch (error) {
      console.error("Error al eliminar la habilidad:", error)
      setMessage({ type: "error", text: "Error de conexión" })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Cargando habilidades...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {habilidades.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No hay habilidades registradas</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {habilidades.map((habilidad) => (
            <div key={habilidad.hab_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                <Badge variant="secondary">{habilidad.hab_nombre}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => eliminarHabilidad(habilidad.hab_id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
