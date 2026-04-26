"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

export function CartSync() {
  const { data: session, status } = useSession();
  const { items, clearCart } = useCartStore();
  const isInitialLoad = useRef(true);
  const previousSession = useRef(session?.user?.id);

  // Sync on mount or login
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      // If user just logged in (changed from unauthenticated or different user)
      if (previousSession.current !== session.user.id) {
        previousSession.current = session.user.id;
        
        // Fetch cart from DB
        fetch("/api/cart")
          .then(async (res) => {
            if (!res.ok) throw new Error("Falha ao buscar carrinho");
            const text = await res.text();
            return text ? JSON.parse(text) : { items: [] };
          })
          .then((data) => {
            if (data && data.items) {
              useCartStore.setState({ items: data.items });
            }
          })
          .catch(console.error);
      }
    } else if (status === "unauthenticated" && previousSession.current) {
      // User logged out
      previousSession.current = undefined;
      clearCart();
    }
  }, [session, status, clearCart]);

  // Sync changes to DB when cart updates
  useEffect(() => {
    if (status === "authenticated" && !isInitialLoad.current) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }).catch(console.error);
    }
    isInitialLoad.current = false;
  }, [items, status]);

  return null;
}
