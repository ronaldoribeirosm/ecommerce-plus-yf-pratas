"use client";

import { useState } from "react";
import { deleteProduct } from "@/features/admin/actions/product";
import { PromotionModal } from "./PromotionModal";
import { EditProductModal } from "./EditProductModal";

interface Category {
  id: string;
  name: string;
}

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    variants: any[];
  };
  categories: Category[];
}

export function ProductActions({ product, categories }: ProductActionsProps) {
  const [loading, setLoading] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setLoading(true);
      await deleteProduct(product.id);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-3">
        <button 
          className="text-primary-dark hover:underline text-xs font-medium disabled:opacity-50"
          onClick={() => setIsPromoOpen(true)}
        >
          Promoção
        </button>
        <button 
          className="text-primary-dark hover:underline text-xs font-medium disabled:opacity-50"
          onClick={() => setIsEditOpen(true)}
        >
          Editar
        </button>
        <button 
          className="text-red-500 hover:underline text-xs font-medium disabled:opacity-50"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      <PromotionModal 
        id={product.id} 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
      />

      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        categories={categories}
        product={product}
      />
    </>
  );
}
