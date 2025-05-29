"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, FileText, Search, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PerfilForm from "../../components/candidato/PerfilForm"
import PostulacionesList from "../../components/candidato/PostulacionesList"
import BuscarEmpleos from "../../components/candidato/BuscarEmpleo"

export default function DashboardCandidato() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("perfil")

  useEffect(() => {
    if (status === "loading") {
      console.log("Session data:", session)
    } else if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user.role !== "candidato") {
      router.push("/")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Aplicaciones Enviadas",
      value: "0", // Se puede obtener dinámicamente
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Entrevistas Programadas",
      value: "0", // Se puede obtener dinámicamente
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tasa de Respuesta",
      value: "0%", // Se puede calcular dinámicamente
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "perfil":
        return <PerfilForm />
      case "postulaciones":
        return <PostulacionesList />
      case "buscarEmpleos":
        return <BuscarEmpleos />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard del Candidato</h1>
          </div>
          <p className="text-gray-600">Gestiona tu perfil, aplicaciones y búsqueda de empleos</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
            <TabsTrigger value="postulaciones">Mis Postulaciones</TabsTrigger>
            <TabsTrigger value="buscarEmpleos">Buscar Empleos</TabsTrigger>
          </TabsList>

          {/* Perfil Tab */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Mi Perfil Profesional
                </CardTitle>
                <CardDescription>Mantén tu información actualizada para atraer mejores oportunidades</CardDescription>
              </CardHeader>
              <CardContent>
                <PerfilForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Postulaciones Tab */}
          <TabsContent value="postulaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Mis Postulaciones
                </CardTitle>
                <CardDescription>Revisa el estado de todas tus aplicaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <PostulacionesList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buscar Empleos Tab */}
          <TabsContent value="buscarEmpleos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-600" />
                  Buscar Empleos
                </CardTitle>
                <CardDescription>Encuentra y postúlate a nuevas oportunidades laborales</CardDescription>
              </CardHeader>
              <CardContent>
                <BuscarEmpleos />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
