"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { type ReactNode, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertCircle } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (requiredRole && session?.user?.role !== requiredRole) {
      router.push("/")
    }
  }, [status, session, router, requiredRole])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-center">Verificando autenticación...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 text-center mb-4">Debes iniciar sesión para acceder a esta página.</p>
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Permisos Insuficientes</h2>
            <p className="text-gray-600 text-center mb-4">
              No tienes los permisos necesarios para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Rol requerido: <span className="font-medium">{requiredRole}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
