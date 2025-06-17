"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Leaf, Search, Star, ShoppingCart, LogOut, Eye, Package, Filter, Grid, List } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  rating?: number
  active: boolean
  storeId: number
  store?: {
    id: number
    name: string
    description: string
  }
}

// Função para decodificar o token JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error("Erro ao decodificar token:", e)
    return null
  }
}

export default function ClientPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    console.log("Client page carregada")

    // Verificar token diretamente
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("Token não encontrado, redirecionando para login")
      window.location.href = "/login"
      return
    }

    try {
      // Decodificar token para verificar role
      const decodedToken = parseJwt(token)
      console.log("Token decodificado:", decodedToken)

      if (!decodedToken || decodedToken.role !== "cliente") {
        console.log("Usuário não é cliente, redirecionando para login")
        window.location.href = "/login"
        return
      }

      // Usar dados do token ou do localStorage
      const userData = localStorage.getItem("user")
      const parsedUser = userData
        ? JSON.parse(userData)
        : {
            id: decodedToken.sub,
            email: decodedToken.user,
            name: decodedToken.user.split("@")[0],
            role: decodedToken.role,
          }

      setUser(parsedUser)
      loadProducts()
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      window.location.href = "/login"
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Zé da Horta</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                Cliente
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Olá, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-300 hover:bg-gray-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar produtos, categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 text-lg"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse border-0 shadow-lg rounded-2xl overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-100 to-green-200">
                      <Package className="h-16 w-16 text-green-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  {product.rating && product.rating > 0 && <div className="mb-3">{renderStars(product.rating)}</div>}

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{selectedProduct?.name}</DialogTitle>
                          <DialogDescription>Detalhes do produto</DialogDescription>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative h-80 bg-gray-100 rounded-2xl overflow-hidden">
                              {selectedProduct.imageUrl ? (
                                <Image
                                  src={selectedProduct.imageUrl || "/placeholder.svg"}
                                  alt={selectedProduct.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=300&width=400"
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-100 to-green-200">
                                  <Package className="h-20 w-20 text-green-400" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-3">{selectedProduct.name}</h3>
                                <Badge variant="outline" className="text-sm px-3 py-1">
                                  {selectedProduct.category}
                                </Badge>
                              </div>

                              <p className="text-gray-600 text-lg leading-relaxed">{selectedProduct.description}</p>

                              {selectedProduct.rating && selectedProduct.rating > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-gray-900">Avaliação</h4>
                                  {renderStars(selectedProduct.rating)}
                                </div>
                              )}

                              <div className="border-t pt-6">
                                <div className="text-4xl font-bold text-green-600 mb-6">
                                  R$ {selectedProduct.price.toFixed(2)}
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl text-lg font-semibold">
                                  <ShoppingCart className="h-5 w-5 mr-3" />
                                  Em breve...
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Nenhum produto encontrado</h3>
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? `Não encontramos produtos para "${searchTerm}"`
                  : "Não há produtos disponíveis no momento"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
