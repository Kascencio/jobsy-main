"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Briefcase, Tag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Empleo } from "@/types"

interface Categoria {
  cat_id: number
  cat_nombre: string
}

interface Habilidad {
  hab_id: number
  hab_nombre: string
}


interface Props {
  agregarEmpleo: (empleo: Empleo) => void
}

export default function CrearEmpleoForm({ agregarEmpleo }: Props) {
  const [form, setForm] = useState({
    emp_titulo: "",
    emp_descripcion: "",
    emp_categoria_id: "",
  })

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [habilidadesOptions, setHabilidadesOptions] = useState<Habilidad[]>([])
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const fetchCategoriasYHabilidades = async () => {
      try {
        const resCategorias = await fetch("/api/categorias")
        const categoriasData = await resCategorias.json()
        setCategorias(categoriasData)

        const resHabilidades = await fetch("/api/habilidades")
        const habilidadesData: Habilidad[] = await resHabilidades.json()
        setHabilidadesOptions(habilidadesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchCategoriasYHabilidades()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMessage(null)
  }

  const handleCategoriaChange = (value: string) => {
    setForm({ ...form, emp_categoria_id: value })
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
      const res = await fetch("/api/reclutador/empleos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, habilidades: habilidadesSeleccionadas }),
      })

      if (res.ok) {
        const data = await res.json()
        const nuevoEmpleo: Empleo = {
          emp_id: data.emp_id,
          emp_titulo: data.emp_titulo,
          emp_descripcion: data.emp_descripcion,
          emp_categoria_id: data.emp_categoria_id,
          emp_fecha_publicacion: data.emp_fecha_publicacion,
          emp_empresa_id: data.emp_empresa_id,
          empleo_habilidades: data.empleo_habilidades,
        }

        setMessage({ type: "success", text: "Empleo creado correctamente" })
        agregarEmpleo(nuevoEmpleo)

        setForm({
          emp_titulo: "",
          emp_descripcion: "",
          emp_categoria_id: "",
        })
        setHabilidadesSeleccionadas([])
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: `Error al crear el empleo: ${data.error}` })
      }
    } catch (error) {
      console.error("Error al crear el empleo:", error)
      setMessage({ type: "error", text: "Error al crear el empleo" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título del Empleo */}
        <div className="space-y-2">
          <Label htmlFor="emp_titulo">Título del Empleo</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="emp_titulo"
              name="emp_titulo"
              type="text"
              placeholder="Ej: Desarrollador Frontend Senior"
              value={form.emp_titulo}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="emp_descripcion">Descripción del Puesto</Label>
          <Textarea
            id="emp_descripcion"
            name="emp_descripcion"
            placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
            value={form.emp_descripcion}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Select value={form.emp_categoria_id} onValueChange={handleCategoriaChange} required>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.cat_id} value={categoria.cat_id.toString()}>
                    {categoria.cat_nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Habilidades */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            <Label>Habilidades Requeridas</Label>
          </div>
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
              Publicando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Publicar Empleo
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
