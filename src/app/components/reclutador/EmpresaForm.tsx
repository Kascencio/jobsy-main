"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Building2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: "",
    sector: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/reclutador/empresa")
        const data = await res.json()
        if (data) {
          setForm({
            nombre: data.emp_nombre || "",
            sector: data.emp_sector || "",
          })
        }
      } catch (error) {
        console.error("Error al obtener datos de empresa:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/reclutador/empresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Datos de la empresa actualizados correctamente" })
      } else {
        setMessage({ type: "error", text: "Error al actualizar los datos de la empresa" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando datos de la empresa...</p>
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
        {/* Nombre de la Empresa */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Empresa</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Nombre de tu empresa"
              value={form.nombre}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label htmlFor="sector">Sector</Label>
          <Input
            id="sector"
            name="sector"
            type="text"
            placeholder="Ej: Tecnología, Finanzas, Salud..."
            value={form.sector}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Empresa
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
