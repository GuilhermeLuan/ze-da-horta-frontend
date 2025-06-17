"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, User, Store, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [userType, setUserType] = useState(searchParams.get("type") || "cliente")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    cnpj: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType,
        ...(userType === "cliente" ? { cpf: formData.cpf } : { cnpj: formData.cnpj }),
      }

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Cadastro realizado com sucesso!",
          description: "Você será redirecionado para a página de login.",
        })
        setTimeout(() => router.push("/login"), 2000)
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message || "Tente novamente",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Zé da Horta</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-white px-8 pt-8 pb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Junte-se à nossa comunidade de produtores e consumidores
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Usuário */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">Tipo de Conta</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Cliente</div>
                          <div className="text-sm text-gray-500">Comprar produtos</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="produtor">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Store className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Produtor</div>
                          <div className="text-sm text-gray-500">Vender produtos</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nome */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold text-gray-900">
                  {userType === "cliente" ? "Nome Completo" : "Nome da Empresa/Produtor"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={userType === "cliente" ? "João Silva" : "Fazenda Orgânica Ltda"}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Senha */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-semibold text-gray-900">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                  minLength={6}
                />
              </div>

              {/* CPF ou CNPJ */}
              <div className="space-y-3">
                <Label htmlFor="document" className="text-base font-semibold text-gray-900">
                  {userType === "cliente" ? "CPF" : "CNPJ"}
                </Label>
                <Input
                  id="document"
                  type="text"
                  placeholder={userType === "cliente" ? "000.000.000-00" : "00.000.000/0000-00"}
                  value={userType === "cliente" ? formData.cpf : formData.cnpj}
                  onChange={(e) => handleInputChange(userType === "cliente" ? "cpf" : "cnpj", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
