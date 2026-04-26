"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, deleteCategory } from "@/features/admin/actions/category";
import { Trash2 } from "lucide-react";

export function CategoryClient({ categories }: { categories: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createCategory(formData);
    if (res.error) setError(res.error);
    else (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setLoading(true);
      const res = await deleteCategory(id);
      if (res.error) alert(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded-xl shadow-sm border border-white">
        <h2 className="text-lg font-bold text-white mb-4">Nova Categoria</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Nome</label>
            <Input name="name" required placeholder="Ex: Vestidos, Calças..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Categoria"}
          </Button>
        </div>
      </form>

      <div className="bg-black p-6 rounded-xl shadow-sm border border-white">
        <h2 className="text-lg font-bold text-white mb-4">Categorias Cadastradas</h2>
        <div className="space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <span className="font-medium text-white">{c.name}</span>
              <button onClick={() => handleDelete(c.id)} disabled={loading} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-text-muted">Nenhuma categoria.</p>}
        </div>
      </div>
    </div>
  );
}
