"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  ShoppingCart, 
  Store,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produtos", href: "/admin/products", icon: ShoppingBag },
  { name: "Categorias", href: "/admin/categories", icon: Tags },
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
  { name: "Promoções", href: "/admin/promotions", icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 border-b md:border-r border-white bg-black flex flex-col md:h-screen md:sticky top-0 z-50">
      <div className="p-4 md:p-6 border-b border-white hidden md:block">
        <Link href="/admin" className="font-serif text-xl font-bold text-white tracking-tight leading-tight">
          YF Pratas<br/>Admin
        </Link>
      </div>

      <nav className="flex md:flex-col md:flex-1 space-x-2 md:space-x-0 md:space-y-1 p-3 md:p-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 md:gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-shrink-0",
                isActive 
                  ? "bg-white text-black" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 md:p-4 border-t md:border-t-0 border-white md:mt-auto hidden md:block">
        <Link 
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <Store className="h-5 w-5" />
          Voltar para a Loja
        </Link>
      </div>
    </aside>
  );
}
