"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct } from "@/features/admin/actions/product";
import { Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface VariantInput {
  size: string;
  color: string;
  stock: number;
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantInput[]>([{ size: "", color: "", stock: 0 }]);

  const handleAddVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: string | number) => {
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
      setError("Você só pode enviar até 5 imagens.");
      setLoading(false);
      return;
    }

    const res = await createProduct(formData);

    if (res.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
      setVariants([{ size: "", color: "", stock: 0 }]);
      alert("Produto criado com sucesso!");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-black p-6 rounded-xl shadow-sm border border-white space-y-4">
      <h2 className="text-lg font-bold text-white mb-4">Adicionar Novo Produto</h2>
      
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-text-main">Nome do Produto</label>
          <Input name="name" required placeholder="Ex: Vestido Floral" />
        </div>
        
        <div>
          <label className="text-sm font-medium text-text-main">Preço Base (R$)</label>
          <Input name="price" type="number" step="0.01" required placeholder="199.90" />
        </div>

        <div>
          <label className="text-sm font-medium text-text-main">Categoria</label>
          <select 
            name="categoryId" 
            required 
            className="flex h-10 w-full rounded-md border border-primary-light bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="">Selecione uma categoria...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-text-main">Guia de Medidas (Opcional)</label>
          <Input name="sizeGuide" type="file" accept="image/*" className="cursor-pointer" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text-main">Imagens do Produto (Até 5 fotos)</label>
          <Input name="images" type="file" multiple accept="image/*" required className="cursor-pointer" />
          <p className="text-xs text-text-muted mt-1">Selecione várias segurando o Ctrl/Command.</p>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text-main">Descrição</label>
          <textarea 
            name="description" 
            required
            className="flex w-full rounded-md border border-primary-light bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
            placeholder="Detalhes do vestido..."
          />
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-white">Variações e Estoque</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddVariant} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Adicionar Variação
          </Button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={index} className="flex items-end gap-3 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              <div className="flex-1">
                <label className="text-xs font-medium text-text-main">Tamanho</label>
                <Input 
                  value={variant.size} 
                  onChange={(e) => updateVariant(index, "size", e.target.value)} 
                  placeholder="Ex: 44, G, GG" 
                  className="h-9"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-text-main">Cor</label>
                <Input 
                  value={variant.color} 
                  onChange={(e) => updateVariant(index, "color", e.target.value)} 
                  placeholder="Ex: Floral Rosê, Preto" 
                  className="h-9"
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
                  className="h-9"
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

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar Produto"}
        </Button>
      </div>
    </form>
  );
}
