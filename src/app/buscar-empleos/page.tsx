"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Star,
  Heart,
  Zap,
  TrendingUp,
  Eye,
  LogIn,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Empresa {
  emp_id: number
  emp_nombre: string
  emp_sector?: string
}

interface Categoria {
  cat_id: number
  cat_nombre: string
}

interface Habilidad {
  hab_id: number
  hab_nombre: string
}

interface EmpleoHabilidad {
  habilidad: Habilidad
}

interface Empleo {
  emp_id: number
  emp_titulo: string
  emp_descripcion?: string
  emp_fecha_publicacion: string
  empresa: Empresa
  categoria?: Categoria
  empleo_habilidades?: EmpleoHabilidad[]
  matchScore?: number
  isRecommended?: boolean
  isSaved?: boolean
  hasApplied?: boolean
  salaryRange?: string
  location?: string
  jobType?: string
  experience?: string
}

export default function BuscarEmpleosPage() {
  const { data: session, status } = useSession()

  console.log("Session data:", status, session)
  // Estados principales
  const [empleos, setEmpleos] = useState<Empleo[]>([])
  const [empleosFiltrados, setEmpleosFiltrados] = useState<Empleo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("todos")

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [salaryRange, setSalaryRange] = useState([0, 100000])
  const [showRemoteOnly, setShowRemoteOnly] = useState(false)

  // Datos para filtros
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [habilidades, setHabilidades] = useState<Habilidad[]>([])

  console.log("Empleos data:", habilidades)
  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar endpoint público para empleos
        const empleosEndpoint = session?.user.role === "candidato" ? "/api/candidato/empleos" : "/api/empleos/publicos"

        const [empleosRes, categoriasRes, habilidadesRes] = await Promise.all([
          fetch(empleosEndpoint),
          fetch("/api/categorias"),
          fetch("/api/habilidades"),
        ])

        const empleosData = await empleosRes.json()
        const categoriasData = await categoriasRes.json()
        const habilidadesData = await habilidadesRes.json()

        // Enriquecer datos para demo
        const empleosConDatos = empleosData.map((empleo: Empleo, index: number) => ({
          ...empleo,
          matchScore: session?.user.role === "candidato" ? Math.floor(Math.random() * 40) + 60 : undefined,
          isRecommended: session?.user.role === "candidato" ? Math.random() > 0.7 : false,
          isSaved: session?.user.role === "candidato" ? Math.random() > 0.8 : false,
          hasApplied: session?.user.role === "candidato" ? Math.random() > 0.9 : false,
          salaryRange: ["€30,000 - €45,000", "€45,000 - €65,000", "€65,000 - €85,000", "€85,000 - €120,000"][index % 4],
          location: ["Madrid", "Barcelona", "Valencia", "Remoto", "Sevilla"][index % 5],
          jobType: ["Tiempo completo", "Tiempo parcial", "Freelance"][index % 3],
          experience: ["Junior", "Mid-level", "Senior"][index % 3],
        }))

        setEmpleos(empleosConDatos)
        setEmpleosFiltrados(empleosConDatos)
        setCategorias(categoriasData)
        setHabilidades(habilidadesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...empleos]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (empleo) =>
          empleo.emp_titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleo.empresa.emp_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleo.emp_descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter((empleo) => empleo.categoria?.cat_id.toString() === selectedCategory)
    }

    // Filtro por ubicación
    if (selectedLocation) {
      filtered = filtered.filter((empleo) => empleo.location === selectedLocation)
    }

    // Filtro por tipo de empleo
    if (selectedJobType) {
      filtered = filtered.filter((empleo) => empleo.jobType === selectedJobType)
    }

    // Filtro por experiencia
    if (selectedExperience) {
      filtered = filtered.filter((empleo) => empleo.experience === selectedExperience)
    }

    // Filtro solo remoto
    if (showRemoteOnly) {
      filtered = filtered.filter((empleo) => empleo.location === "Remoto")
    }

    // Filtro por tab activo (solo para candidatos autenticados)
    if (session?.user.role === "candidato") {
      switch (activeTab) {
        case "recomendados":
          filtered = filtered.filter((empleo) => empleo.isRecommended)
          break
        case "guardados":
          filtered = filtered.filter((empleo) => empleo.isSaved)
          break
        case "aplicados":
          filtered = filtered.filter((empleo) => empleo.hasApplied)
          break
      }
    }

    // Ordenar por relevancia/match score para candidatos, por fecha para otros
    if (session?.user.role === "candidato") {
      filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    } else {
      filtered.sort((a, b) => new Date(b.emp_fecha_publicacion).getTime() - new Date(a.emp_fecha_publicacion).getTime())
    }

    setEmpleosFiltrados(filtered)
  }, [
    empleos,
    searchTerm,
    selectedCategory,
    selectedLocation,
    selectedJobType,
    selectedExperience,
    showRemoteOnly,
    activeTab,
    session,
  ])

  // Funciones de acción
  const postularEmpleo = async (empId: number) => {
    if (!session) {
      // Redirigir a login si no está autenticado
      window.location.href = `/login?redirect=/buscar-empleos`
      return
    }

    if (session.user.role !== "candidato") {
      alert("Solo los candidatos pueden postularse a empleos")
      return
    }

    setIsApplying(empId)
    try {
      const res = await fetch("/api/candidato/postular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empId }),
      })

      if (res.ok) {
        setEmpleos((prev) => prev.map((emp) => (emp.emp_id === empId ? { ...emp, hasApplied: true } : emp)))
      } else {
        const errorData = await res.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error al postularse:", error)
      alert("Error al procesar la postulación")
    } finally {
      setIsApplying(null)
    }
  }

  const toggleSaveJob = (empId: number) => {
    if (!session) {
      alert("Debes iniciar sesión para guardar empleos")
      return
    }
    setEmpleos((prev) => prev.map((emp) => (emp.emp_id === empId ? { ...emp, isSaved: !emp.isSaved } : emp)))
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-gray-600 bg-gray-50 border-gray-200"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hace 1 día"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
    return date.toLocaleDateString("es-ES")
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Ubicación */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          Ubicación
        </h3>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar ubicación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ubicaciones</SelectItem>
            <SelectItem value="Villahermosa">Villahermosa</SelectItem>
            <SelectItem value="Centro">Centro</SelectItem>
            <SelectItem value="Centla">Centla</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 mt-3">
          <Checkbox id="remote-only" checked={showRemoteOnly} onCheckedChange={(value) => setShowRemoteOnly(value === true)} />
          <Label htmlFor="remote-only" className="text-sm">
            Solo trabajos remotos
          </Label>
        </div>
      </div>

      {/* Tipo de Empleo */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-green-600" />
          Tipo de Empleo
        </h3>
        <Select value={selectedJobType} onValueChange={setSelectedJobType}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de empleo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="Tiempo completo">Tiempo completo</SelectItem>
            <SelectItem value="Tiempo parcial">Tiempo parcial</SelectItem>
            <SelectItem value="Freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Nivel de Experiencia */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          Experiencia
        </h3>
        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
          <SelectTrigger>
            <SelectValue placeholder="Nivel de experiencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="Junior">Junior (1-2 años)</SelectItem>
            <SelectItem value="Mid-level">Mid-level (3-5 años)</SelectItem>
            <SelectItem value="Senior">Senior (5+ años)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rango Salarial */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          Salario Anual
        </h3>
        <div className="px-2">
          <Slider
            value={salaryRange}
            onValueChange={setSalaryRange}
            max={120000}
            min={20000}
            step={5000}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>€{salaryRange[0].toLocaleString()}</span>
            <span>€{salaryRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Limpiar filtros */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedLocation("")
          setSelectedJobType("")
          setSelectedExperience("")
          setShowRemoteOnly(false)
          setSalaryRange([20000, 120000])
        }}
      >
        Limpiar Filtros
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empleos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Buscar Empleos</h1>
          <p className="text-lg text-gray-600">
            {session?.user.role === "candidato"
              ? "Encuentra tu próxima oportunidad profesional"
              : "Descubre las mejores oportunidades laborales"}
          </p>
        </div>

        {/* Alerta para usuarios no autenticados */}
        {!session && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <LogIn className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>¿Buscas empleo?</strong> Inicia sesión para acceder a funciones avanzadas como postulaciones,
                recomendaciones personalizadas y guardar empleos favoritos.
              </span>
              <div className="flex gap-2 ml-4">
                <Button size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Barra de búsqueda principal */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por título, empresa o habilidades..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.cat_id} value={categoria.cat_id.toString()}>
                        {categoria.cat_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de filtrado - Solo para candidatos autenticados */}
        {session?.user.role === "candidato" && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todos">Todos ({empleos.length})</TabsTrigger>
              <TabsTrigger value="recomendados">
                Recomendados ({empleos.filter((e) => e.isRecommended).length})
              </TabsTrigger>
              <TabsTrigger value="guardados">Guardados ({empleos.filter((e) => e.isSaved).length})</TabsTrigger>
              <TabsTrigger value="aplicados">Aplicados ({empleos.filter((e) => e.hasApplied).length})</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="flex gap-8">
          {/* Sidebar de filtros - Desktop */}
          <div className="hidden lg:block w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Botón de filtros móvil */}
            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtros de Búsqueda</SheetTitle>
                    <SheetDescription>Refina tu búsqueda de empleos</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Header de resultados */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{empleosFiltrados.length} empleos encontrados</h2>
                <p className="text-gray-600">
                  {session?.user.role === "candidato" ? "Ordenados por relevancia" : "Ordenados por fecha"}
                </p>
              </div>
              <Select defaultValue={session?.user.role === "candidato" ? "relevance" : "date"}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Más recientes</SelectItem>
                  {session?.user.role === "candidato" && (
                    <>
                      <SelectItem value="relevance">Más relevantes</SelectItem>
                      <SelectItem value="match">Mayor coincidencia</SelectItem>
                    </>
                  )}
                  <SelectItem value="company">Por empresa</SelectItem>
                  <SelectItem value="salary">Por salario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista de empleos */}
            {empleosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron empleos</h3>
                  <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("")
                      setSelectedLocation("")
                      setSelectedJobType("")
                      setSelectedExperience("")
                      setShowRemoteOnly(false)
                      setActiveTab("todos")
                    }}
                  >
                    Limpiar todos los filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {empleosFiltrados.map((empleo) => (
                  <Card key={empleo.emp_id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {empleo.emp_titulo}
                              </CardTitle>
                              <CardDescription className="text-blue-600 font-medium text-lg">
                                {empleo.empresa.emp_nombre}
                              </CardDescription>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {session?.user.role === "candidato" && empleo.isRecommended && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Recomendado
                              </Badge>
                            )}
                            {empleo.categoria && <Badge variant="secondary">{empleo.categoria.cat_nombre}</Badge>}
                            <Badge variant="outline" className="text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {empleo.location}
                            </Badge>
                            <Badge variant="outline" className="text-gray-600">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {empleo.jobType}
                            </Badge>
                            <Badge variant="outline" className="text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(empleo.emp_fecha_publicacion)}
                            </Badge>
                          </div>
                        </div>

                        {/* Match Score - Solo para candidatos */}
                        {session?.user.role === "candidato" && empleo.matchScore && (
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchScoreColor(empleo.matchScore)}`}
                          >
                            {empleo.matchScore}% match
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Información adicional */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {empleo.salaryRange}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          {empleo.experience}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {empleo.jobType}
                        </div>
                      </div>

                      {/* Descripción */}
                      {empleo.emp_descripcion && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{empleo.emp_descripcion}</p>
                      )}

                      {/* Habilidades */}
                      {empleo.empleo_habilidades && empleo.empleo_habilidades.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Habilidades:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {empleo.empleo_habilidades.slice(0, 4).map((eh) => (
                              <Badge key={eh.habilidad.hab_id} variant="outline" className="text-xs">
                                {eh.habilidad.hab_nombre}
                              </Badge>
                            ))}
                            {empleo.empleo_habilidades.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{empleo.empleo_habilidades.length - 4} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-3">
                        {session ? (
                          <>
                            {session.user.role === "candidato" ? (
                              empleo.hasApplied ? (
                                <Button disabled className="flex-1 bg-green-100 text-green-800">
                                  ✓ Ya aplicaste
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => postularEmpleo(empleo.emp_id)}
                                  disabled={isApplying === empleo.emp_id}
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                                >
                                  {isApplying === empleo.emp_id ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      Aplicando...
                                    </div>
                                  ) : (
                                    <>
                                      <Briefcase className="h-4 w-4 mr-2" />
                                      Aplicar Ahora
                                    </>
                                  )}
                                </Button>
                              )
                            ) : (
                              <Button disabled className="flex-1" variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                Solo candidatos pueden aplicar
                              </Button>
                            )}

                            {session.user.role === "candidato" && (
                              <Button
                                variant="outline"
                                onClick={() => toggleSaveJob(empleo.emp_id)}
                                className={empleo.isSaved ? "text-red-600 border-red-200" : ""}
                              >
                                <Heart className={`h-4 w-4 mr-2 ${empleo.isSaved ? "fill-current" : ""}`} />
                                {empleo.isSaved ? "Guardado" : "Guardar"}
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              asChild
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                            >
                              <Link href={`/login?redirect=/buscar-empleos`}>
                                <LogIn className="h-4 w-4 mr-2" />
                                Iniciar Sesión para Aplicar
                              </Link>
                            </Button>
                            <Button variant="outline" asChild>
                              <Link href="/registro">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Registrarse
                              </Link>
                            </Button>
                          </>
                        )}

                        <Link href={`/ofertas/${empleo.emp_id}`}>
                          <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {empleosFiltrados.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8">
                  Cargar Más Empleos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
