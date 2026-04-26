import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Header } from "@/components/layout/Header";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const categoriaSlug = resolvedParams.categoria as string | undefined;
  const filtro = resolvedParams.filtro as string | undefined;

  let whereClause: any = {};

  if (categoriaSlug) {
    whereClause.category = {
      slug: categoriaSlug,
    };
  }

  // Se filtro for "novidades", ordena por createdAt desc.
  // Se for "promocoes", podemos simular um filtro de preço (ou no futuro ter um campo isPromo).
  // Como não temos campo de promoção no banco agora, vamos apenas limitar aos produtos mais baratos ou mockar.
  let orderByClause: any = { createdAt: "desc" };
  
  if (filtro === "promocoes") {
    orderByClause = { price: "asc" };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: { category: true, variants: true },
      orderBy: orderByClause,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const titulo = categoriaSlug 
    ? `Categoria: ${categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1)}` 
    : filtro === "novidades" 
    ? "Novidades" 
    : filtro === "promocoes"
    ? "Promoções"
    : "Todos os Produtos";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar de Filtros */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-secondary mb-4">Filtros</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-text-main mb-2">Categorias</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/produtos" className={`text-sm ${!categoriaSlug ? 'font-bold text-primary-dark' : 'text-text-muted hover:text-primary-dark'}`}>
                        Todas
                      </a>
                    </li>
                    {categories.map(c => (
                      <li key={c.id}>
                        <a href={`/produtos?categoria=${c.slug}`} className={`text-sm ${categoriaSlug === c.slug ? 'font-bold text-primary-dark' : 'text-text-muted hover:text-primary-dark'}`}>
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold text-secondary mb-6">{titulo}</h1>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {products.map((product) => {
                  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
                  return (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        imageUrl: product.images[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
                        sizes: uniqueSizes.length > 0 ? uniqueSizes : ["Único"],
                        isPromotion: product.isPromotion,
                        promotionalPrice: product.promotionalPrice,
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-900 rounded-xl border border-dashed border-zinc-800">
                <p className="text-text-muted text-lg">Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
