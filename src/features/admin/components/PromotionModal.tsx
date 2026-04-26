"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setProductPromotion } from "@/features/admin/actions/product";

interface PromotionModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PromotionModal({ id, isOpen, onClose }: PromotionModalProps) {
  const [loading, setLoading] = useState(false);
  const [isPromotion, setIsPromotion] = useState(true);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const promotionalPrice = parseFloat(formData.get("promotionalPrice") as string);

    await setProductPromotion(id, isPromotion, isNaN(promotionalPrice) ? undefined : promotionalPrice);
    
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-black p-6 rounded-xl shadow-lg border border-white w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Gerenciar Promoção</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox" 
              id="isPromotion" 
              checked={isPromotion} 
              onChange={(e) => setIsPromotion(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-black text-white focus:ring-white"
            />
            <label htmlFor="isPromotion" className="text-sm font-medium text-white">
              Ativar Promoção para este produto
            </label>
          </div>

          {isPromotion && (
            <div>
              <label className="text-sm font-medium text-white block mb-1">Preço Promocional (R$)</label>
              <Input name="promotionalPrice" type="number" step="0.01" required={isPromotion} placeholder="Ex: 99.90" />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
