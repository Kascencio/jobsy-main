import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Image src="/images/logo-j.png" alt="Job Card" width={54} height={20} max-widht={2000} className="rounded-lg" />
              </div>
              <span className="text-xl font-bold">Jobsy</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plataforma de empleos más avanzada, impulsada por inteligencia artificial para conectar el talento
              perfecto.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contacto@jobsy.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Villahermosa, Tabasco</span>
              </div>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Para Candidatos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Buscar Empleos
                </Link>
              </li>
              <li>
                <Link href="/jobs/recommended" className="hover:text-white transition-colors">
                  Empleos Recomendados
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Crear Perfil
                </Link>
              </li>
              <li>
                <Link href="/resume-builder" className="hover:text-white transition-colors">
                  Constructor de CV
                </Link>
              </li>
              <li>
                <Link href="/career-advice" className="hover:text-white transition-colors">
                  Consejos de Carrera
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Para Empresas</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/post-job" className="hover:text-white transition-colors">
                  Publicar Empleo
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="hover:text-white transition-colors">
                  Panel de Reclutador
                </Link>
              </li>
              <li>
                <Link href="/talent-search" className="hover:text-white transition-colors">
                  Buscar Talento
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-white transition-colors">
                  Soluciones Empresariales
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Trabaja con Nosotros
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">
                  Prensa
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Jobsy. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
