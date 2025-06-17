"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Função para decodificar o token JWT
function parseJwt(token: string) {
  try {
    // Pega a parte do meio do token (payload)
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

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Resposta da API:", data)

        // Extrair o token
        const token = data.access_token || data.token

        if (!token) {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Token não encontrado na resposta",
          })
          setLoading(false)
          return
        }

        // Decodificar o token para obter as informações do usuário
        const decodedToken = parseJwt(token)
        console.log("Token decodificado:", decodedToken)

        if (!decodedToken) {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Erro ao decodificar o token",
          })
          setLoading(false)
          return
        }

        // Salvar token
        localStorage.setItem("token", token)

        // Salvar dados do usuário extraídos do token
        const userData = {
          id: decodedToken.sub,
          email: decodedToken.user,
          name: decodedToken.user.split("@")[0], // Extraindo nome do email como fallback
          role: decodedToken.role,
        }

        localStorage.setItem("user", JSON.stringify(userData))
        console.log("Dados do usuário salvos:", userData)

        toast({
          variant: "success",
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        })

        // Redirecionar baseado no tipo de usuário
        setTimeout(() => {
          if (
            decodedToken.role === "produtor" ||
            decodedToken.role === "producer" ||
            decodedToken.role === "PRODUCER"
          ) {
            console.log("Redirecionando para /producer")
            window.location.href = "/producer"
          } else if (
            decodedToken.role === "cliente" ||
            decodedToken.role === "client" ||
            decodedToken.role === "CLIENT"
          ) {
            console.log("Redirecionando para /client")
            window.location.href = "/client"
          } else {
            console.log("Role não reconhecido:", decodedToken.role)
            toast({
              variant: "destructive",
              title: "Erro no login",
              description: `Role não reconhecido: ${decodedToken.role}`,
            })
          }
        }, 1000)
      } else {
        const error = await response.json()
        console.error("Erro na resposta:", error)
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message || "Credenciais inválidas",
        })
      }
    } catch (error) {
      console.error("Erro de conexão:", error)
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
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-lg text-gray-600">Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
