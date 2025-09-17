import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Building2, Calendar, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Params {
  params: {
    id: string
  }
}

export default async function DetalleOferta({ params }: Params) {
  const empleo = await prisma.empleo.findUnique({
    where: { emp_id: Number(params.id) },
    include: {
      empresa: true,
      categoria: true,
    },
  })

  if (!empleo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Oferta no encontrada</h2>
            <p className="text-gray-600 mb-4">La oferta que buscas no existe o ha sido eliminada.</p>
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fechaPublicacion = new Date(empleo.emp_fecha_publicacion).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const diasDesdePublicacion = Math.floor(
    (new Date().getTime() - new Date(empleo.emp_fecha_publicacion).getTime()) / (1000 * 3600 * 24),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la página principal
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details - Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{empleo.emp_titulo}</CardTitle>
                    <CardDescription className="text-lg text-blue-600 font-medium">
                      {empleo.empresa.emp_nombre}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Publicado el {fechaPublicacion}</span>
                      </div>
                      {diasDesdePublicacion <= 7 && <Badge className="bg-green-100 text-green-800">Nuevo</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción del puesto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{empleo.emp_descripcion}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Categoría</p>
                      <p className="text-gray-600">{empleo.categoria.cat_nombre}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Fecha de publicación</p>
                      <p className="text-gray-600">{fechaPublicacion}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">¿Te interesa esta oferta?</CardTitle>
                <CardDescription className="text-blue-700">
                  Postúlate ahora y da el siguiente paso en tu carrera profesional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                    <Users className="h-4 w-4 mr-2" />
                    Postularte ahora
                  </Button>
                </Link>
                <p className="text-xs text-blue-600 mt-2 text-center">Necesitas iniciar sesión para postularte</p>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre la empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{empleo.empresa.emp_nombre}</p>
                    <p className="text-sm text-gray-600">Empresa verificada</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Empresa líder en su sector</p>
                  <p>• Ambiente de trabajo colaborativo</p>
                  <p>• Oportunidades de crecimiento</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de la oferta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Días publicada</span>
                  <span className="font-medium">{diasDesdePublicacion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Categoría</span>
                  <Badge variant="secondary">{empleo.categoria.cat_nombre}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge className="bg-green-100 text-green-800">Activa</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
