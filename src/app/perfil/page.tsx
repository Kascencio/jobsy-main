import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import ProtectedRoute from "../components/ProtectedRoute"
import { User, Mail, Shield, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default async function Perfil() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso requerido</h2>
            <p className="text-gray-600">Debes iniciar sesión para ver esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = await prisma.usuario.findUnique({
    where: { usu_email: session.user.email! },
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "candidato":
        return "bg-blue-100 text-blue-800"
      case "reclutador":
        return "bg-green-100 text-green-800"
      case "moderador":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "reclutador":
        return "👔"
      case "moderador":
        return "🛡️"
      default:
        return "👤"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Información de tu cuenta en Jobsy</p>
          </div>

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600">
                    {user?.usu_nombre?.[0]}
                    {user?.usu_apellido?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    {user?.usu_nombre} {user?.usu_apellido}
                  </CardTitle>
                  <CardDescription className="text-lg mb-3">{user?.usu_email}</CardDescription>
                  <Badge className={`${getRoleColor(user?.usu_rol || "")} text-sm`}>
                    <span className="mr-1">{getRoleIcon(user?.usu_rol || "")}</span>
                    {user?.usu_rol?.charAt(0).toUpperCase() + user?.usu_rol?.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Información Personal
                </CardTitle>
                <CardDescription>Datos básicos de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre completo</label>
                  <p className="text-gray-900 font-medium">
                    {user?.usu_nombre} {user?.usu_apellido}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">Correo electrónico</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{user?.usu_email}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de cuenta</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <Badge className={`${getRoleColor(user?.usu_rol || "")} text-xs`}>
                      {user?.usu_rol?.charAt(0).toUpperCase() + user?.usu_rol?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Actividad de la Cuenta
                </CardTitle>
                <CardDescription>Estadísticas y actividad reciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">Aplicaciones</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Entrevistas</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">Miembro desde</label>
                  <p className="text-gray-900 mt-1">Información no disponible</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Último acceso</label>
                  <p className="text-gray-900 mt-1">Ahora</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role-specific Information */}
          {user?.usu_rol === "reclutador" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-green-700">Panel de Reclutador</CardTitle>
                <CardDescription>Herramientas específicas para reclutadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Ofertas publicadas</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">Candidatos revisados</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600">Contrataciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user?.usu_rol === "moderador" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-purple-700">Panel de Moderador</CardTitle>
                <CardDescription>Herramientas de administración y moderación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600">Reportes revisados</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">0</p>
                    <p className="text-sm text-gray-600">Acciones tomadas</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">Usuarios gestionados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
