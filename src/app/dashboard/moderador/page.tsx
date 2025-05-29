"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield, Tag, Zap, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CategoriasList from "../../components/moderador/CategoriasList"
import CategoriaForm from "../../components/moderador/CategoriaForm"
import HabilidadForm from "../../components/moderador/HabilidadForm"
import HabilidadList from "../../components/moderador/HabilidadList"

export default function DashboardAdministrador() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user.role !== "moderador") {
      router.push("/")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Categorías Activas",
      value: "0", // Se puede obtener dinámicamente
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Habilidades Registradas",
      value: "0", // Se puede obtener dinámicamente
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Usuarios Totales",
      value: "0", // Se puede obtener dinámicamente
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <p className="text-gray-600">Gestiona categorías, habilidades y configuraciones del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="categorias" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categorias">Categorías</TabsTrigger>
            <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          </TabsList>

          {/* Categorías Tab */}
          <TabsContent value="categorias" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crear Categoría */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    Crear Categoría
                  </CardTitle>
                  <CardDescription>Agrega nuevas categorías para clasificar empleos</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoriaForm />
                </CardContent>
              </Card>

              {/* Lista de Categorías */}
              <Card>
                <CardHeader>
                  <CardTitle>Categorías Existentes</CardTitle>
                  <CardDescription>Gestiona las categorías disponibles en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoriasList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Habilidades Tab */}
          <TabsContent value="habilidades" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crear Habilidad */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Crear Habilidad
                  </CardTitle>
                  <CardDescription>Agrega nuevas habilidades para perfiles y empleos</CardDescription>
                </CardHeader>
                <CardContent>
                  <HabilidadForm />
                </CardContent>
              </Card>

              {/* Lista de Habilidades */}
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades Registradas</CardTitle>
                  <CardDescription>Gestiona las habilidades disponibles en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <HabilidadList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
