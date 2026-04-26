"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 text-center">
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="font-serif text-4xl font-bold text-secondary mb-4">
          Pedido Confirmado!
        </h1>
        <p className="text-lg text-text-muted mb-8 max-w-md">
          Sua compra foi processada com sucesso. Enviaremos os detalhes do pedido e o código de rastreamento para o seu e-mail.
        </p>
        <Link href="/">
          <Button className="h-12 text-lg">
            Continuar Comprando
          </Button>
        </Link>
      </main>
    </>
  );
}
