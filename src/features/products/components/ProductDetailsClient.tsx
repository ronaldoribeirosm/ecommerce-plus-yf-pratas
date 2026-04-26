"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Check, X } from "lucide-react";

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    images: string[];
    sizeGuideImage?: string | null;
    categoryName: string;
    isPromotion: boolean;
    promotionalPrice: number | null;
    variants: Variant[];
  };
}

export function ProductDetailsClient({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>(product.images[0] || product.imageUrl);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addItem, openCart } = useCartStore();

  const allColors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product.variants]);
  
  // Sizes available for the selected color (or all if none selected)
  const availableSizes = useMemo(() => {
    if (!selectedColor) return Array.from(new Set(product.variants.map((v) => v.size)));
    return product.variants.filter((v) => v.color === selectedColor).map((v) => v.size);
  }, [product.variants, selectedColor]);

  // If a selected size is no longer available in the newly selected color, clear it
  useEffect(() => {
    if (selectedSize && selectedColor) {
      if (!availableSizes.includes(selectedSize)) {
        setSelectedSize("");
      }
    }
  }, [selectedColor, availableSizes, selectedSize]);

  // Find the exact variant based on size and color
  const currentVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) || null;
  }, [product.variants, selectedSize, selectedColor]);

  const stock = currentVariant ? currentVariant.stock : 0;
  
  // If no size and color are selected, we don't know the exact stock. But we can check if the product has ANY stock across all variants.
  const totalStock = useMemo(() => product.variants.reduce((acc, v) => acc + v.stock, 0), [product.variants]);
  
  const isFullySelected = selectedSize !== "" && selectedColor !== "";

  const handleAddToCart = () => {
    if (!isFullySelected) {
      alert("Por favor, selecione o tamanho e a cor antes de adicionar ao carrinho.");
      return;
    }

    if (stock <= 0) {
      alert("Esta variação está esgotada.");
      return;
    }

    const price = product.isPromotion && product.promotionalPrice ? product.promotionalPrice : product.price;

    addItem({
      id: product.id,
      name: product.name,
      price: price,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
    });
    
    openCart();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Galeria de Imagens */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
            {product.isPromotion && (
              <div className="absolute top-4 left-4 z-10 bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                PROMOÇÃO
              </div>
            )}
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover object-top transition-all duration-300"
              priority
            />
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    activeImage === img ? 'border-primary-dark opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx+1}`} fill className="object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-sm font-medium text-primary-dark mb-2">{product.categoryName}</p>
            <h1 className="font-serif text-4xl font-bold text-secondary mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              {product.isPromotion && product.promotionalPrice ? (
                <>
                  <p className="text-3xl font-medium text-primary-dark">
                    R$ {product.promotionalPrice.toFixed(2)}
                  </p>
                  <p className="text-xl font-medium text-text-muted line-through">
                    R$ {product.price.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-medium text-text-main">
                  R$ {product.price.toFixed(2)}
                </p>
              )}
            </div>
            <p className="text-text-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seleção de Cor */}
          {allColors.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-secondary mb-3">COR</h3>
              <div className="flex flex-wrap gap-3">
                {allColors.map((color) => {
                  const hasStock = product.variants.some((v) => v.color === color && v.stock > 0);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={!hasStock}
                      className={`px-4 py-2 text-sm rounded-md border transition-all ${
                        selectedColor === color
                          ? "border-primary-dark bg-primary-light/20 text-primary-dark font-medium"
                          : "border-zinc-700 text-text-muted hover:border-white/50"
                      } ${!hasStock && "opacity-50 cursor-not-allowed line-through"}`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seleção de Tamanho */}
          {availableSizes.length > 0 && (
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-sm font-bold text-secondary">TAMANHO</h3>
                {product.sizeGuideImage && (
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-primary-dark hover:underline flex items-center gap-1"
                  >
                    Guia de Medidas
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => {
                  const hasStock = selectedColor 
                    ? product.variants.some((v) => v.size === size && v.color === selectedColor && v.stock > 0)
                    : product.variants.some((v) => v.size === size && v.stock > 0);

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!hasStock}
                      className={`flex h-12 w-12 items-center justify-center rounded-md border text-sm transition-all ${
                        selectedSize === size
                          ? "border-primary-dark bg-primary-light/20 text-primary-dark font-bold"
                          : "border-zinc-700 text-text-muted hover:border-white/50"
                      } ${!hasStock && "opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500"}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="pt-6 border-t border-zinc-800">
            <Button 
              className="w-full h-14 text-lg" 
              onClick={handleAddToCart}
              disabled={totalStock <= 0 || (isFullySelected && stock <= 0)}
            >
              {totalStock > 0 ? (
                isFullySelected ? (stock > 0 ? "Adicionar ao Carrinho" : "Variação Esgotada") : "Selecione as opções"
              ) : (
                "Produto Esgotado"
              )}
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted">
              <Check className="h-4 w-4 text-green-500" />
              <p>Troca grátis em até 7 dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Guia de Medidas */}
      {isSizeGuideOpen && product.sizeGuideImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
          <div className="bg-zinc-900 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden relative border border-zinc-800">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-secondary">Guia de Medidas</h2>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative w-full h-[60vh] md:h-[70vh] bg-black">
              <Image 
                src={product.sizeGuideImage} 
                alt="Guia de Medidas" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
