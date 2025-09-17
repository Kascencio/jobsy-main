"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Briefcase, Users, Plus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmpresaForm from "../../components/reclutador/EmpresaForm"
import CrearEmpleoForm from "../../components/reclutador/CrearEmpleoForm"
import EmpleosList from "../../components/reclutador/EmpleosList"
import type { Empleo } from "@/types"

export default function DashboardReclutador() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [empleos, setEmpleos] = useState<Empleo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "reclutador")) {
      router.push("/")
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchEmpleos = async () => {
      try {
        const res = await fetch("/api/reclutador/empleos")
        if (res.ok) {
          const data = await res.json()
          setEmpleos(data)
        } else {
          console.error("Error al obtener los empleos")
        }
      } catch (error) {
        console.error("Error al obtener los empleos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user.role === "reclutador") {
      fetchEmpleos()
    }
  }, [session])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const agregarEmpleo = (nuevoEmpleo: Empleo) => {
    setEmpleos((prevEmpleos) => [nuevoEmpleo, ...prevEmpleos])
  }

  const stats = [
    {
      title: "Ofertas Activas",
      value: empleos.length.toString(),
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Aplicaciones",
      value: "0", // Esto se puede calcular desde las postulaciones
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tasa de Respuesta",
      value: "0%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Reclutador</h1>
          <p className="text-gray-600">Gestiona tus ofertas de empleo y candidatos</p>
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
        <Tabs defaultValue="empleos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="empleos">Mis Ofertas</TabsTrigger>
            <TabsTrigger value="crear">Crear Oferta</TabsTrigger>
            <TabsTrigger value="empresa">Mi Empresa</TabsTrigger>
          </TabsList>

          {/* Empleos Tab */}
          <TabsContent value="empleos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mis Ofertas de Empleo</CardTitle>
                    <CardDescription>Gestiona todas tus ofertas publicadas</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      const tabsList = document.querySelector('[role="tablist"]')
                      const crearTab = tabsList?.querySelector('[value="crear"]') as HTMLElement
                      crearTab?.click()
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Oferta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {empleos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes ofertas publicadas</h3>
                    <p className="text-gray-600 mb-4">Comienza creando tu primera oferta de empleo</p>
                    <Button
                      onClick={() => {
                        const tabsList = document.querySelector('[role="tablist"]')
                        const crearTab = tabsList?.querySelector('[value="crear"]') as HTMLElement
                        crearTab?.click()
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Oferta
                    </Button>
                  </div>
                ) : (
                  <EmpleosList empleos={empleos} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crear Empleo Tab */}
          <TabsContent value="crear" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Oferta de Empleo</CardTitle>
                <CardDescription>Publica una nueva oportunidad laboral para atraer talento</CardDescription>
              </CardHeader>
              <CardContent>
                <CrearEmpleoForm agregarEmpleo={agregarEmpleo} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Empresa Tab */}
          <TabsContent value="empresa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>Actualiza los datos de tu empresa para atraer mejores candidatos</CardDescription>
              </CardHeader>
              <CardContent>
                <EmpresaForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
