import { prisma } from "@/lib/prisma";
import { CategoryClient } from "@/features/admin/components/CategoryClient";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">
          Gerenciar Categorias
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Crie ou remova categorias do seu catálogo.
        </p>
      </div>

      <CategoryClient categories={categories} />
    </div>
  );
}
