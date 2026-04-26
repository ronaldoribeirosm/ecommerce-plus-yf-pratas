import { prisma } from "@/lib/prisma";
import { Package, Tags, Users, ShoppingCart } from "lucide-react";

export default async function AdminDashboard() {
  const [totalProducts, totalCategories, totalUsers, totalOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.order.count(),
  ]);

  const stats = [
    { name: "Total de Produtos", value: totalProducts, icon: Package },
    { name: "Categorias Ativas", value: totalCategories, icon: Tags },
    { name: "Usuários Registrados", value: totalUsers, icon: Users },
    { name: "Pedidos Realizados", value: totalOrders, icon: ShoppingCart },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-secondary">
          Visão Geral
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex items-center gap-4 rounded-xl bg-black p-4 sm:p-6 shadow-sm border border-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
