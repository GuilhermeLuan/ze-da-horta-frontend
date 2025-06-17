"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ShoppingCart, Store, Users, Star, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">Zé da Horta</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-2 h-12">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 h-12">Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Produtos frescos
                  <span className="text-green-600 block">direto do campo</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Conectamos você aos melhores produtores locais. Qualidade garantida, frescor incomparável e apoio à
                  agricultura familiar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register?type=cliente">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 h-14 text-lg">
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Começar a Comprar
                  </Button>
                </Link>
                <Link href="/register?type=produtor">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 h-14 text-lg"
                  >
                    <Store className="mr-3 h-6 w-6" />
                    Vender Produtos
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Produtores</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">10k+</div>
                  <div className="text-sm text-gray-600">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">50k+</div>
                  <div className="text-sm text-gray-600">Produtos</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3">
                  <Image
                    src="https://www.jbtc.com/foodtech/wp-content/uploads/sites/2/2021/08/Fresh-Produce-Collage.jpg"
                    alt="Produtos frescos"
                    width={500}
                    height={400}
                    className="rounded-2xl object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-green-200 rounded-3xl transform -rotate-3 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Por que escolher o Zé da Horta?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolucionamos a forma como você compra e vende produtos do campo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">100% Frescos</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Produtos colhidos no dia e entregues diretamente do produtor para sua mesa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Apoio Local</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Fortaleça a economia local comprando diretamente dos produtores da região
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Entrega Rápida</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Receba seus produtos frescos no conforto da sua casa com agilidade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">O que nossos clientes dizem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Cliente",
                content: "Produtos sempre frescos e de qualidade. Recomendo!",
                rating: 5,
              },
              {
                name: "João Santos",
                role: "Produtor",
                content: "Plataforma fácil de usar e vendas aumentaram muito.",
                rating: 5,
              },
              {
                name: "Ana Costa",
                role: "Cliente",
                content: "Entrega rápida e atendimento excelente.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-0 rounded-2xl p-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 text-lg italic mb-4">
                    "{testimonial.content}"
                  </CardDescription>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{testimonial.name}</CardTitle>
                    <p className="text-green-600 font-medium">{testimonial.role}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram a diferença dos produtos frescos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=cliente">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 h-14 text-lg">
                Começar a Comprar
              </Button>
            </Link>
            <Link href="/register?type=produtor">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 h-14 text-lg font-semibold transition-all duration-200"
              >
                Vender Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Zé da Horta</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Conectando produtores locais aos consumidores, promovendo agricultura sustentável e produtos frescos.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Zé da Horta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
