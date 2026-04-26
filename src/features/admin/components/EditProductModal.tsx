"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProduct } from "@/features/admin/actions/product";
import { Plus, Trash2, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id?: string;
  size: string;
  color: string;
  stock: number;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    variants: Variant[];
  };
}

export function EditProductModal({ isOpen, onClose, categories, product }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Clone variants initially
  const [variants, setVariants] = useState<Variant[]>(
    product.variants.length > 0 ? [...product.variants] : [{ size: "", color: "", stock: 0 }]
  );

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate variants
    const validVariants = variants.filter(v => v.size.trim() && v.color.trim() && v.stock >= 0);
    if (validVariants.length === 0) {
      setError("Adicione pelo menos uma variação com tamanho, cor e estoque válido.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("variants", JSON.stringify(validVariants));

    // Ensure we don't upload more than 5 images
    const imageInput = e.currentTarget.querySelector('input[name="images"]') as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 5) {
      setError("Você só pode enviar até 5 imagens novas.");
      setLoading(false);
      return;
    }

    const res = await updateProduct(product.id, formData);

    if (res.error) {
      setError(res.error);
    } else {
      alert("Produto atualizado com sucesso!");
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-black p-6 rounded-xl shadow-lg border border-white w-full max-w-2xl my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Editar Produto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-main block mb-1">Nome do Produto</label>
              <Input name="name" required defaultValue={product.name} />
            </div>
            
            <div>
              <label className="text-sm font-medium text-text-main block mb-1">Preço Base (R$)</label>
              <Input name="price" type="number" step="0.01" required defaultValue={product.price} />
            </div>

            <div>
              <label className="text-sm font-medium text-text-main block mb-1">Categoria</label>
              <select 
                name="categoryId" 
                required 
                defaultValue={product.categoryId}
                className="flex h-10 w-full rounded-md border border-primary-light bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-text-main block mb-1">Guia de Medidas (Novo arquivo)</label>
              <Input name="sizeGuide" type="file" accept="image/*" className="cursor-pointer" />
              <p className="text-xs text-text-muted mt-1">Selecione apenas se quiser substituir o atual.</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-main block mb-1">Adicionar Novas Imagens (Até 5 fotos)</label>
              <Input name="images" type="file" multiple accept="image/*" className="cursor-pointer" />
              <p className="text-xs text-text-muted mt-1">Selecione para anexar mais fotos ao produto.</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-main block mb-1">Descrição</label>
              <textarea 
                name="description" 
                required
                defaultValue={product.description}
                className="flex w-full rounded-md border border-primary-light bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-white">Variações e Estoque</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Nova Variação
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-end gap-3 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-text-main">Tamanho</label>
                    <Input 
                      value={variant.size} 
                      onChange={(e) => updateVariant(index, "size", e.target.value)} 
                      placeholder="Ex: 44, G" 
                      className="h-9 bg-black"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-text-main">Cor</label>
                    <Input 
                      value={variant.color} 
                      onChange={(e) => updateVariant(index, "color", e.target.value)} 
                      placeholder="Ex: Floral" 
                      className="h-9 bg-black"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-medium text-text-main">Qtd</label>
                    <Input 
                      type="number" 
                      value={variant.stock} 
                      onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)} 
                      min="0"
                      className="h-9 bg-black"
                      required
                    />
                  </div>
                  {variants.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
