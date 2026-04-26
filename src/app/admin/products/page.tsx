import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { ProductActions } from "@/features/admin/components/ProductActions";

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">
          Gerenciar Produtos
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Adicione, edite ou remova produtos do seu catálogo.
        </p>
      </div>

      <ProductForm categories={categories} />

      <div className="bg-black rounded-xl shadow-sm border border-white overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Estoque Atual ({products.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Produto</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Estoque Total</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((product) => {
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                return (
                  <tr key={product.id} className="hover:bg-zinc-900 transition-colors">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-white border border-zinc-700">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{totalStock}</td>
                    <td className="px-6 py-4 text-right">
                      <ProductActions product={product as any} categories={categories} />
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                    Nenhum produto cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
