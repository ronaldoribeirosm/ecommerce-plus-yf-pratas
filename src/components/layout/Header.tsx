"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const { items, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-light bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <Button variant="icon" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0 z-10">
          <Link href="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="YF Pratas" className="h-14 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-x-8 lg:gap-x-12 absolute left-0 right-0">
          <Link href="/" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-main transition-colors hover:text-primary-dark">
            INÍCIO
          </Link>
          <Link href="/produtos" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-main transition-colors hover:text-primary-dark">
            CATÁLOGO
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center justify-end gap-2 z-10 relative">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="h-9 w-40 rounded-l-md border border-primary-light px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="button" variant="icon" size="icon" onClick={() => setIsSearchOpen(false)} aria-label="Fechar Busca">
                <X className="h-5 w-5 text-text-muted" />
              </Button>
            </form>
          ) : (
            <Button variant="icon" size="icon" aria-label="Buscar" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* User Auth Icons (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            {status === "authenticated" ? (
              <>
                {(session?.user as any)?.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="hidden lg:flex text-xs border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white mr-2">
                      Painel Admin
                    </Button>
                  </Link>
                )}
                <Link href="/conta">
                  <Button variant="icon" size="icon" aria-label="Minha Conta" title="Minha Conta">
                    <User className="h-5 w-5 text-primary-dark" />
                  </Button>
                </Link>
                <Button variant="icon" size="icon" aria-label="Sair" onClick={async () => {
                  useCartStore.getState().clearCart();
                  await signOut();
                }} title="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="icon" size="icon" aria-label="Login" title="Entrar">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          <Button variant="icon" size="icon" aria-label="Carrinho" className="relative" onClick={openCart}>
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-dark text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-primary-light bg-background px-4 py-4 shadow-lg transition-all">
          <nav className="flex flex-col space-y-4">
            <Link href="/" onClick={toggleMobileMenu} className="text-sm font-semibold tracking-widest uppercase text-text-main">
              Início
            </Link>
            <Link href="/produtos" onClick={toggleMobileMenu} className="text-sm font-semibold tracking-widest uppercase text-text-main">
              Catálogo
            </Link>
            <div className="h-px w-full bg-primary-light my-2"></div>
            
            {status === "authenticated" ? (
              <>
                {(session?.user as any)?.role === "ADMIN" && (
                  <Link href="/admin" onClick={toggleMobileMenu} className="flex items-center gap-2 text-base font-bold text-primary-dark mb-2">
                    Painel Admin
                  </Link>
                )}
                <Link href="/conta" onClick={toggleMobileMenu} className="flex items-center gap-2 text-base font-medium text-text-main">
                  <User className="h-5 w-5 text-primary-dark" /> Minha Conta ({session.user?.name?.split(" ")[0]})
                </Link>
                <button onClick={async () => {
                  useCartStore.getState().clearCart();
                  await signOut();
                }} className="flex items-center gap-2 text-base font-medium text-red-500 text-left">
                  <LogOut className="h-5 w-5" /> Sair
                </button>
              </>
            ) : (
              <Link href="/login" onClick={toggleMobileMenu} className="flex items-center gap-2 text-base font-medium text-text-main">
                <User className="h-5 w-5" /> Entrar / Cadastrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
