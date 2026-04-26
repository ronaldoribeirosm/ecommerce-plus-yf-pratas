import { Header } from "@/components/layout/Header";
import { ProductCard, type Product } from "@/features/products/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { variants: true }
  });

  const products: Product[] = dbProducts.map((p) => {
    const uniqueSizes = Array.from(new Set(p.variants.map(v => v.size)));
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      imageUrl: p.images[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
      sizes: uniqueSizes.length > 0 ? uniqueSizes : ["Único"],
      isPromotion: p.isPromotion,
      promotionalPrice: p.promotionalPrice,
    };
  });

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen bg-background text-text-main pb-24">
        {/* Hero Banner */}
        <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 bg-background">
          <div className="flex flex-col items-center w-full max-w-3xl">
            <h2 className="text-[10px] md:text-[11px] font-semibold tracking-[0.3em] text-text-muted mb-8 md:mb-12 uppercase">
              JOIAS EM PRATA 925 • GARANTIA VITALÍCIA
            </h2>
            
            {/* The exact logo from the image will be loaded here */}
            <div className="relative w-80 md:w-[32rem] lg:w-[40rem] aspect-square mb-10 md:mb-12">
              <img src="/logo.png" alt="YF Pratas Logo" className="w-full h-full object-contain" />
            </div>
            
            <h3 className="font-serif italic text-xl md:text-2xl text-text-main mb-12">
              Brilhante como você 💎
            </h3>
            
            <a href="/produtos" className="inline-flex items-center justify-center bg-white text-black px-10 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors">
              VER COLEÇÃO
            </a>
          </div>
        </section>

        {/* Vitrine de Produtos */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-center mb-12">
            <h2 className="font-serif italic text-3xl font-medium text-text-main">Destaques da Loja</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
