"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // Shipping State
  const [cep, setCep] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingName, setShippingName] = useState<string>("");
  
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  // Customer Info State
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const total = subtotal + (shippingCost || 0);

  const calculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      alert("Por favor, digite um CEP válido com 8 dígitos.");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
      }
    } catch (e) {
      console.error("Erro ao buscar CEP", e);
    }

    // Regra de Negócio: Frete por Região
    if (cleanCep.startsWith("12460")) {
      setShippingCost(10);
      setShippingName("Frete Local (Campos do Jordão)");
    } else {
      const prefix = parseInt(cleanCep.substring(0, 2), 10);
      if (prefix >= 1 && prefix <= 19) {
        setShippingCost(15);
        setShippingName("Frete Expresso (Estado de SP)");
      } else if ((prefix >= 20 && prefix <= 39) || (prefix >= 80 && prefix <= 99)) {
        setShippingCost(25);
        setShippingName("Frete Nacional (Sul / Sudeste)");
      } else {
        setShippingCost(45);
        setShippingName("Frete Nacional (Norte / Nordeste / CO)");
      }
    }
  };

  const handleCheckout = async () => {
    if (!name || !cpf || !phone || shippingCost === null) {
      alert("Por favor, preencha todos os seus dados e calcule o frete antes de finalizar.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingCost,
          shippingName,
          customer: { name, cpf, phone, cep, street, number, complement, neighborhood, city, state, userId: session?.user?.id }
        }),
      });

      const stripeSession = await response.json();

      if (stripeSession.error) {
        alert(stripeSession.error);
        setLoading(false);
        return;
      }

      if (stripeSession.url) {
        window.location.href = stripeSession.url;
      } else {
        alert("Erro ao redirecionar para o pagamento.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao processar o checkout.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-secondary mb-4">Seu carrinho está vazio</h1>
          <p className="text-text-muted mb-8">Adicione alguns produtos antes de finalizar a compra.</p>
          <a href="/">
            <Button>Voltar para a loja</Button>
          </a>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-secondary mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Esquerda: Formulário e Entrega */}
          <div className="space-y-8">
            <section className="bg-black p-6 rounded-xl shadow-sm border border-white">
              <h2 className="text-xl font-bold text-secondary mb-4">1. Seus Dados</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block">Nome Completo</label>
                  <Input placeholder="Maria da Silva" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">CPF</label>
                    <Input placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">WhatsApp</label>
                    <Input placeholder="(11) 90000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-black p-6 rounded-xl shadow-sm border border-white">
              <h2 className="text-xl font-bold text-secondary mb-4">2. Entrega e Frete</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-main mb-1 block">CEP</label>
                    <Input 
                      placeholder="00000-000" 
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      maxLength={9}
                    />
                  </div>
                  <Button onClick={calculateShipping} variant="outline" disabled={cep.length < 8}>
                    Buscar CEP
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-text-main mb-1 block">Rua / Logradouro</label>
                    <Input placeholder="Av. Principal" value={street} onChange={(e) => setStreet(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">Número</label>
                    <Input placeholder="123" value={number} onChange={(e) => setNumber(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">Complemento</label>
                    <Input placeholder="Apto 45" value={complement} onChange={(e) => setComplement(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">Bairro</label>
                    <Input placeholder="Centro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-text-main mb-1 block">Cidade</label>
                    <Input placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">Estado</label>
                    <Input placeholder="SP" value={state} onChange={(e) => setState(e.target.value)} required maxLength={2} />
                  </div>
                </div>
                
                {shippingCost !== null && (
                  <div className="bg-zinc-900 p-4 rounded-md border border-zinc-700 flex justify-between items-center mt-4">
                    <div>
                      <p className="font-bold text-white">{shippingName}</p>
                      <p className="text-sm text-zinc-400">Entrega em até 5 dias úteis</p>
                    </div>
                    <p className="font-bold text-white">R$ {shippingCost.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Direita: Resumo do Pedido */}
          <div className="bg-black p-6 rounded-xl border border-white h-fit">
            <h2 className="text-xl font-bold text-secondary mb-6">Resumo do Pedido</h2>
            
            <ul className="space-y-4 mb-6">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                  <div className="relative h-16 w-12 flex-shrink-0 rounded bg-black border border-zinc-800">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-main line-clamp-1">{item.name}</p>
                    <p className="text-xs text-text-muted">Tam: {item.size || "Único"} | Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-secondary">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-zinc-800 pt-6 text-sm">
              <div className="flex justify-between text-text-main">
                <p>Subtotal</p>
                <p>R$ {subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-text-main">
                <p>Frete</p>
                <p>{shippingCost !== null ? `R$ ${shippingCost.toFixed(2)}` : "A calcular"}</p>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-3 text-lg font-bold text-white">
                <p>Total</p>
                <p>R$ {total.toFixed(2)}</p>
              </div>
            </div>

            <Button 
              className="w-full mt-8 h-12 text-lg" 
              onClick={handleCheckout}
              disabled={loading || shippingCost === null}
            >
              {loading ? "Processando..." : "Ir para o Pagamento Seguro"}
            </Button>
            <p className="text-xs text-center text-text-muted mt-4">
              Você será redirecionada para o ambiente seguro do Stripe.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
