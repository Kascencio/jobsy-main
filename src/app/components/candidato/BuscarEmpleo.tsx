"use client"

import { useState, useEffect } from "react"
import { Search, Building2, Briefcase, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Empresa {
  emp_id: number
  emp_nombre: string
}

interface Empleo {
  emp_id: number
  emp_titulo: string
  emp_descripcion?: string
  empresa: Empresa
}

export default function BuscarEmpleos() {
  const [empleos, setEmpleos] = useState<Empleo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmpleos, setFilteredEmpleos] = useState<Empleo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/candidato/empleos")
        const data: Empleo[] = await res.json()
        setEmpleos(data)
        setFilteredEmpleos(data)
      } catch (error) {
        console.error("Error al obtener empleos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = empleos.filter(
      (empleo) =>
        empleo.emp_titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleo.empresa.emp_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleo.emp_descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEmpleos(filtered)
  }, [searchTerm, empleos])

  const postularEmpleo = async (empId: number) => {
    try {
      const res = await fetch(`/api/candidato/postular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empId }),
      })

      if (res.ok) {
        alert("Te has postulado correctamente")
      } else {
        const errorData = await res.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error al postularse:", error)
      alert("Error al procesar la postulación")
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando ofertas de empleo...</p>
      </div>
    )
  }

  if (empleos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ofertas disponibles</h3>
        <p className="text-gray-600">No hay ofertas de empleo disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por título, empresa o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredEmpleos.length} {filteredEmpleos.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
        </p>
        {searchTerm && (
          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
            Limpiar búsqueda
          </Button>
        )}
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredEmpleos.map((empleo) => (
          <Card key={empleo.emp_id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{empleo.emp_titulo}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">{empleo.empresa.emp_nombre}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">Nuevo</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {empleo.emp_descripcion && <p className="text-gray-600 mb-4 line-clamp-2">{empleo.emp_descripcion}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => postularEmpleo(empleo.emp_id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Postularme
                </Button>
                <Link href={`/ofertas/${empleo.emp_id}`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmpleos.length === 0 && searchTerm && (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertDescription>
            No se encontraron ofertas que coincidan con &quot;{searchTerm}&quot;. Intenta con otros términos de búsqueda.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
