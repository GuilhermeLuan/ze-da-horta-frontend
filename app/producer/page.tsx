"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Leaf, Package, Plus, Edit, Trash2, LogOut, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  rating?: number
  active?: boolean
  storeId: number
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

export default function ProducerPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stores, setStores] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedStore, setSelectedStore] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Formulários
  const [storeForm, setStoreForm] = useState({ name: "", description: "" })
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  })

  // Modais
  const [showStoreModal, setShowStoreModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingStore, setEditingStore] = useState<any | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  useEffect(() => {
    console.log("Producer page carregada")

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

      if (!decodedToken || decodedToken.role !== "produtor") {
        console.log("Usuário não é produtor, redirecionando para login")
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
      loadStores()
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      window.location.href = "/login"
    }
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  const loadStores = async () => {
    try {
      const response = await fetch("http://localhost:3000/store", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setStores(data)
        if (data.length > 0) {
          setSelectedStore(data[0])
          loadProducts(data[0].id)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar lojas:", error)
    }
  }

  const loadProducts = async (storeId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/store/${storeId}/products`, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:3000/store", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...storeForm,
          producerProfileId: 1, 
        }),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Loja criada com sucesso!",
          description: "Sua nova loja foi adicionada.",
        })
        setStoreForm({ name: "", description: "" })
        setShowStoreModal(false)
        loadStores()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar loja",
          description: "Tente novamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStore) return

    setLoading(true)

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...productForm,
          price: Number.parseFloat(productForm.price),
          rating: 5,
          storeId: selectedStore.id,
        }),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Produto criado com sucesso!",
          description: "O produto foi adicionado à sua loja.",
        })
        setProductForm({ name: "", description: "", price: "", category: "", imageUrl: "" })
        setShowProductModal(false)
        loadProducts(selectedStore.id)
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar produto",
          description: "Tente novamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !selectedStore) return

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3000/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...productForm,
          price: Number.parseFloat(productForm.price),
        }),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Produto atualizado com sucesso!",
          description: "As alterações foram salvas.",
        })
        setProductForm({ name: "", description: "", price: "", category: "", imageUrl: "" })
        setShowProductModal(false)
        setEditingProduct(null)
        loadProducts(selectedStore.id)
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Erro ao atualizar produto",
          description: error.message || "Tente novamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedStore || !productToDelete) return

    try {
      const response = await fetch(`http://localhost:3000/products/${productToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Produto excluído com sucesso!",
          description: "O produto foi removido da sua loja.",
        })
        loadProducts(selectedStore.id)
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Erro ao excluir produto",
          description: error.message || "Tente novamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
      })
    } finally {
      setProductToDelete(null)
    }
  }

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl || "",
    })
    setShowProductModal(true)
  }

  const openAddProductModal = () => {
    setEditingProduct(null)
    setProductForm({ name: "", description: "", price: "", category: "", imageUrl: "" })
    setShowProductModal(true)
  }

  const closeProductModal = () => {
    setShowProductModal(false)
    setEditingProduct(null)
    setProductForm({ name: "", description: "", price: "", category: "", imageUrl: "" })
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
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
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                Produtor
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
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total de Lojas</p>
                  <p className="text-3xl font-bold">{stores.length}</p>
                </div>
                <Store className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Produtos</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Lojas */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-xl font-bold text-gray-900">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Store className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Minhas Lojas</span>
                  </CardTitle>
                  <Dialog open={showStoreModal} onOpenChange={setShowStoreModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Nova Loja</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Crie uma nova loja para vender seus produtos
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateStore} className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="storeName" className="text-base font-semibold text-gray-900">
                            Nome da Loja
                          </Label>
                          <Input
                            id="storeName"
                            value={storeForm.name}
                            onChange={(e) => setStoreForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="storeDescription" className="text-base font-semibold text-gray-900">
                            Descrição
                          </Label>
                          <Textarea
                            id="storeDescription"
                            value={storeForm.description}
                            onChange={(e) => setStoreForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-semibold"
                        >
                          {loading ? "Criando..." : "Criar Loja"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedStore?.id === store.id
                          ? "bg-green-50 border-2 border-green-200 shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                      onClick={() => {
                        setSelectedStore(store)
                        loadProducts(store.id)
                      }}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{store.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                    </div>
                  ))}
                  {stores.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Nenhuma loja cadastrada</p>
                      <p className="text-sm text-gray-400">Clique no + para criar sua primeira loja</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Produtos */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-xl font-bold text-gray-900">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Produtos {selectedStore && `- ${selectedStore.name}`}</span>
                  </CardTitle>
                  {selectedStore && (
                    <Button
                      onClick={openAddProductModal}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Produto
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {selectedStore ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="font-semibold text-gray-900">Nome</TableHead>
                          <TableHead className="font-semibold text-gray-900">Categoria</TableHead>
                          <TableHead className="font-semibold text-gray-900">Preço</TableHead>
                          <TableHead className="font-semibold text-gray-900">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <div className="font-semibold text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-green-200 text-green-800 bg-green-50">
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-green-600">R$ {product.price.toFixed(2)}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditModal(product)}
                                  title="Editar produto"
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDeleteModal(product)}
                                  title="Excluir produto"
                                  className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {products.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Package className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto cadastrado</h3>
                        <p className="text-gray-500 mb-4">Clique em "Novo Produto" para começar</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione uma loja</h3>
                    <p className="text-gray-500">Escolha uma loja para ver os produtos ou crie uma nova loja</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Produto */}
      <Dialog open={showProductModal} onOpenChange={closeProductModal}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingProduct ? "Edite as informações do produto" : "Adicione um novo produto à sua loja"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingProduct ? handleEditProduct : handleCreateProduct} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="productName" className="text-base font-semibold text-gray-900">
                Nome do Produto
              </Label>
              <Input
                id="productName"
                value={productForm.name}
                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="productDescription" className="text-base font-semibold text-gray-900">
                Descrição
              </Label>
              <Textarea
                id="productDescription"
                value={productForm.description}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="productPrice" className="text-base font-semibold text-gray-900">
                  Preço (R$)
                </Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="productCategory" className="text-base font-semibold text-gray-900">
                  Categoria
                </Label>
                <Input
                  id="productCategory"
                  value={productForm.category}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Frutas, Verduras"
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="productImage" className="text-base font-semibold text-gray-900">
                URL da Imagem
              </Label>
              <Input
                id="productImage"
                type="url"
                value={productForm.imageUrl}
                onChange={(e) => setProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://exemplo.com/imagem.jpg"
                className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-semibold"
              >
                {loading
                  ? editingProduct
                    ? "Atualizando..."
                    : "Criando..."
                  : editingProduct
                    ? "Atualizar Produto"
                    : "Criar Produto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={closeProductModal}
                className="px-8 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteProduct}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        icon={
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
        }
      />
    </div>
  )
}
