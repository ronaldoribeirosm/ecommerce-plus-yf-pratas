import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProductDetailsClient } from "@/features/products/components/ProductDetailsClient";

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true, variants: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductDetailsClient 
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: product.images[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
            images: product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"],
            sizeGuideImage: product.sizeGuideImage,
            categoryName: product.category.name,
            isPromotion: product.isPromotion,
            promotionalPrice: product.promotionalPrice,
            variants: product.variants,
          }} 
        />
      </main>
    </>
  );
}
