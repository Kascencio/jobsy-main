import { Search, MapPin, Building2, Users, Briefcase, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { prisma } from "@/lib/prisma"
import OfertaCard from "./components/OfertaCard"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const empleos = await prisma.empleo.findMany({
    include: {
      empresa: true,
    },
    orderBy: {
      emp_fecha_publicacion: "desc",
    },
    take: 10,
  })

  const stats = [
    { icon: Briefcase, label: "Empleos Activos", value: empleos.length.toString() },
    { icon: Building2, label: "Empresas", value: "1,234" },
    { icon: Users, label: "Candidatos", value: "15,678" },
    { icon: TrendingUp, label: "Contrataciones", value: "892" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Bienvenido a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                    Jobsy
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800">Conectamos talento y oportunidades:</span>
                  <br />
                  Una plataforma para reclutadores y candidatos en busca de su próximo gran paso.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Buscar empleos, empresas..."
                      className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Select>
                      <SelectTrigger className="pl-10 h-12 border-0 bg-gray-50">
                        <SelectValue placeholder="Ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villahermosa">Villahermosa</SelectItem>
                        <SelectItem value="Centro">Centro</SelectItem>
                        <SelectItem value="Centla">Centla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 whitespace-nowrap"
                    >
                      Buscar Empleo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/50 backdrop-blur rounded-lg p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-2">
                      <stat.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Images */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Background Circle */}
                <div className="absolute top-8 right-8 w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-20 blur-sm"></div>

                {/* Main Person Image */}
                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-4">
                  <Image
                    src="/images/Landing_Person.png"
                    alt="Professional Person"
                    width={400}
                    height={500}
                    className="rounded-xl"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-4 -left-4 z-20 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                  <Image src="/images/Card_.png" alt="Job Card" width={206} height={173} className="rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Últimas ofertas de empleo</h2>
            <p className="text-lg text-gray-600">Descubre las oportunidades más recientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {empleos.map((empleo) => (
              <OfertaCard
                key={empleo.emp_id}
                id={empleo.emp_id}
                titulo={empleo.emp_titulo}
                empresa={empleo.empresa.emp_nombre}
                fechaPublicacion={empleo.emp_fecha_publicacion.toISOString()}
              />
            ))}
          </div>

          {empleos.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleos disponibles</h3>
              <p className="text-gray-600">Vuelve pronto para ver nuevas oportunidades</p>
            </div>
          )}

          {empleos.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/jobs">
                <Button variant="outline" size="lg" className="px-8">
                  Ver Todos los Empleos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir Jobsy?</h2>
            <p className="text-lg text-gray-600">Tecnología avanzada para conectar el talento perfecto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">IA Avanzada</h3>
              <p className="text-gray-600">
                Nuestro algoritmo de inteligencia artificial analiza perfiles y ofertas para encontrar coincidencias
                perfectas
              </p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Red de Talento</h3>
              <p className="text-gray-600">
                Conecta con miles de profesionales y empresas líderes en diferentes industrias
              </p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-6">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proceso Simplificado</h3>
              <p className="text-gray-600">
                Aplicación con un clic, seguimiento en tiempo real y comunicación directa con reclutadores
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
