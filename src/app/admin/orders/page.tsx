import { prisma } from "@/lib/prisma";
import { OrderRow } from "@/features/admin/components/OrderRow";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-secondary">Logística e Pedidos</h1>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="text-text-muted">Nenhum pedido encontrado no sistema.</p>
        ) : (
          orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
