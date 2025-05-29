"use client"

import type React from "react"

import { useState } from "react"
import { Tag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CategoriaForm() {
  const [nombre, setNombre] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/moderador/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Categoría creada correctamente" })
        setNombre("")
      } else {
        setMessage({ type: "error", text: "Error al crear la categoría" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Categoría</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="nombre"
              type="text"
              placeholder="Ej: Tecnología, Marketing, Ventas..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !nombre.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Categoría
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
