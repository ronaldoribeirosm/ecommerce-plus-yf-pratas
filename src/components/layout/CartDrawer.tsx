"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-black border-l border-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-secondary">
            <ShoppingBag className="h-6 w-6" />
            Sua Sacola
          </h2>
          <Button variant="icon" size="icon" onClick={closeCart}>
            <X className="h-6 w-6 text-text-muted hover:text-text-main" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <ShoppingBag className="h-16 w-16 text-primary-light" />
              <p className="text-lg font-medium text-text-muted">Sua sacola está vazia</p>
              <Button onClick={closeCart} className="mt-4">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-black">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-text-main line-clamp-2">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-text-muted hover:text-red-500 transition-colors ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-text-muted">
                        Tam: {item.size || "Único"} {item.color ? `| Cor: ${item.color}` : ""}
                      </p>
                    </div>
                    <div className="flex items-end justify-between text-sm">
                      <div className="flex items-center border border-zinc-800 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="px-2 py-1 text-text-muted hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-medium text-text-main">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="px-2 py-1 text-text-muted hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-bold text-secondary">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-zinc-800 px-6 py-6 bg-zinc-900">
            <div className="flex justify-between text-base font-bold text-secondary mb-6">
              <p>Subtotal</p>
              <p>R$ {subtotal.toFixed(2)}</p>
            </div>
            <p className="text-xs text-text-muted mb-4 text-center">
              Frete calculado na próxima etapa.
            </p>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full h-12 text-lg">
                Finalizar Compra
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
