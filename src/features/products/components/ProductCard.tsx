"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  sizes: string[];
  isPromotion?: boolean;
  promotionalPrice?: number | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const formattedPromoPrice = product.promotionalPrice ? new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.promotionalPrice) : null;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/produto/${product.slug}`);
  };

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl p-3 transition-all hover:bg-zinc-900 hover:shadow-xl animate-fade-in">
      
      {/* Botão de Favorito Absoluto - Omitido temporariamente */}

      {/* Imagem (Aspect Ratio 3/4) */}
      <Link href={`/produto/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-900 block">
        {product.isPromotion && (
          <div className="absolute top-2 left-2 z-10 bg-primary-dark text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            PROMOÇÃO
          </div>
        )}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Overlay Botão Carrinho no Hover (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block">
          <Button 
            className="w-full shadow-lg bg-white text-black hover:bg-gray-200" 
            variant="secondary" 
            size="sm"
            onClick={handleViewDetails}
          >
            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
          </Button>
        </div>
      </Link>

      {/* Informações do Produto */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center gap-2">
          {product.sizes.slice(0, 3).map((size) => (
            <span key={size} className="flex h-6 min-w-6 items-center justify-center rounded border border-primary-light text-[10px] font-medium text-text-muted">
              {size}
            </span>
          ))}
          {product.sizes.length > 3 && (
            <span className="text-[10px] text-text-muted">+{product.sizes.length - 3}</span>
          )}
        </div>
        
        <Link href={`/produto/${product.slug}`}>
          <h3 className="font-sans text-sm font-medium text-text-main line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {product.isPromotion && formattedPromoPrice ? (
            <>
              <p className="font-serif text-lg font-bold text-primary-dark">
                {formattedPromoPrice}
              </p>
              <p className="text-xs font-medium text-text-muted line-through">
                {formattedPrice}
              </p>
            </>
          ) : (
            <p className="font-serif text-lg font-bold text-secondary">
              {formattedPrice}
            </p>
          )}
        </div>
        
        <Button 
          className="mt-2 w-full md:hidden bg-white text-black hover:bg-gray-200" 
          variant="outline" 
          size="sm"
          onClick={handleViewDetails}
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
}
