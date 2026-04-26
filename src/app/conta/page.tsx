import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default async function ContaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/conta");
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-secondary mb-8">Minha Conta</h1>
        
        <div className="bg-black rounded-xl shadow-sm border border-white overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900">
            <h2 className="text-xl font-bold text-secondary">Meus Pedidos</h2>
            <p className="text-sm text-text-muted">Acompanhe o status das suas compras</p>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-text-muted">Você ainda não possui pedidos.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-zinc-800 rounded-lg p-5 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-text-muted">Pedido realizado em</p>
                          <p className="font-bold text-sm text-text-main">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-muted">Total</p>
                          <p className="font-bold text-sm text-text-main">R$ {order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-muted">Status</p>
                          <p className="font-bold text-sm text-secondary">
                            {order.status === "PAID" ? "Pagamento Aprovado" : order.status === "PENDING" ? "Aguardando Pagamento" : order.status}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex text-sm text-text-main">
                            <span className="font-medium mr-2">{item.quantity}x</span>
                            <span>{item.product?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-64 bg-zinc-900 p-4 rounded-md border border-zinc-800 flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-secondary mb-2 uppercase tracking-wide">Acompanhar Entrega</h4>
                      {order.trackingCode ? (
                        <>
                          <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                            <Truck className="h-4 w-4" />
                            <span>Em trânsito</span>
                          </div>
                          <p className="text-sm text-text-main mb-1">Código de rastreio:</p>
                          <p className="font-mono bg-black p-2 text-center text-sm border border-white rounded text-white font-bold select-all">
                            {order.trackingCode}
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <Clock className="h-4 w-4" />
                          <span>Aguardando envio...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
