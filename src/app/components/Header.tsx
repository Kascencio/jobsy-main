"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, User, Building2, LogOut, Menu, X, Search, Bell, Home, Shield } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "candidato":
        return "Candidato"
      case "reclutador":
        return "Reclutador"
      case "moderador":
        return "Moderador"
      default:
        return "Usuario"
    }
  }

  // Actualizar las rutas de navegación para todos los roles
  const getNavigationItems = (role: string) => {
    switch (role) {
      case "candidato":
        return [
          { href: "/", label: "Inicio", icon: Home },
          { href: "/buscar-empleos", label: "Buscar Empleos", icon: Search },
          { href: "/dashboard/candidato", label: "Mi Dashboard", icon: User },
        ]
      case "reclutador":
        return [
          { href: "/", label: "Inicio", icon: Home },
          { href: "/dashboard/reclutador", label: "Panel Reclutador", icon: Building2 },
          { href: "/buscar-empleos", label: "Buscar Empleos", icon: Search },
        ]
      case "moderador":
        return [
          { href: "/", label: "Inicio", icon: Home },
          { href: "/dashboard/moderador", label: "Panel Admin", icon: Shield },
          { href: "/buscar-empleos", label: "Buscar Empleos", icon: Search },
        ]
      default:
        return [
          { href: "/", label: "Inicio", icon: Home },
          { href: "/buscar-empleos", label: "Empleos", icon: Search },
        ]
    }
  }

  // Actualizar los enlaces del dropdown para todos los roles
  const getDropdownItems = (role: string) => {
    const baseItems = [{ href: "/perfil", label: "Mi Perfil", icon: User }]

    switch (role) {
      case "candidato":
        return [
          ...baseItems,
          { href: "/dashboard/candidato", label: "Dashboard", icon: User },
          { href: "/buscar-empleos", label: "Buscar Empleos", icon: Search },
        ]
      case "reclutador":
        return [
          ...baseItems,
          { href: "/dashboard/reclutador", label: "Panel Reclutador", icon: Building2 },
          { href: "/dashboard/reclutador", label: "Mis Ofertas", icon: Briefcase },
        ]
      case "moderador":
        return [
          ...baseItems,
          { href: "/dashboard/moderador", label: "Panel Admin", icon: Shield },
          { href: "/buscar-empleos", label: "Buscar Empleos", icon: Search },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = session?.user?.role ? getNavigationItems(session.user.role) : getNavigationItems("")
  const dropdownItems = session?.user?.role ? getDropdownItems(session.user.role) : getDropdownItems("")

  // No mostrar navegación completa en páginas de auth
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/registro")
  const isDashboardPage = pathname?.includes("/dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-j.png" alt="Job Card" width={54} height={20} max-widht={2000} className="rounded-lg" />
            <span className="text-xl font-bold text-gray-900">Jobsy</span>
          </Link>

          {/* Desktop Navigation - Solo si no es página de auth */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Notifications - Solo en dashboard */}
                {isDashboardPage && (
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>
                )}

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                        <AvatarFallback>
                          {session.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session.user?.name || "Usuario"}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user?.email}</p>
                        {session.user?.role && (
                          <Badge className={`w-fit text-xs ${getRoleColor(session.user.role)}`}>
                            {getRoleLabel(session.user.role)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* Enlaces específicos por rol */}
                    {dropdownItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                >
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}

            {/* Mobile menu button - Solo si no es página de auth */}
            {!isAuthPage && (
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Solo si no es página de auth */}
        {!isAuthPage && isMenuOpen && (
          <div className="md:hidden border-t py-3">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {!session && (
                <>
                  <Link
                    href="/login"
                    className="px-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/registro"
                    className="px-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
