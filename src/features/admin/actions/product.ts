"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { uploadFileToSupabase } from "@/lib/supabase";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const variantsRaw = formData.get("variants") as string | null;

  if (!name || !description || !price || !categoryId || !variantsRaw) {
    return { error: "Preencha os campos obrigatórios e adicione ao menos uma variação de estoque." };
  }

  let variants = [];
  try {
    variants = JSON.parse(variantsRaw);
  } catch (e) {
    return { error: "Erro ao ler variações de estoque." };
  }

  if (variants.length === 0) {
    return { error: "Adicione ao menos uma variação de estoque." };
  }

  // Handle files
  const imageFiles = formData.getAll("images") as File[];
  const sizeGuideFile = formData.get("sizeGuide") as File | null;

  try {
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadFileToSupabase(file);
        imageUrls.push(url);
      }
    }

    let sizeGuideUrl = null;
    if (sizeGuideFile && sizeGuideFile.size > 0) {
      sizeGuideUrl = await uploadFileToSupabase(sizeGuideFile);
    }

    // Generate a simple slug
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now();

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        images: imageUrls,
        sizeGuideImage: sizeGuideUrl,
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    return { error: error.message || "Erro ao cadastrar produto." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const variantsRaw = formData.get("variants") as string | null;

  if (!name || !description || !price || !categoryId || !variantsRaw) {
    return { error: "Preencha os campos obrigatórios." };
  }

  let variants = [];
  try {
    variants = JSON.parse(variantsRaw);
  } catch (e) {
    return { error: "Erro ao ler variações de estoque." };
  }

  // Handle files
  const imageFiles = formData.getAll("images") as File[];
  const sizeGuideFile = formData.get("sizeGuide") as File | null;

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return { error: "Produto não encontrado." };

    const imageUrls: string[] = [...product.images];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadFileToSupabase(file);
        imageUrls.push(url);
      }
    }

    let sizeGuideUrl = product.sizeGuideImage;
    if (sizeGuideFile && sizeGuideFile.size > 0) {
      sizeGuideUrl = await uploadFileToSupabase(sizeGuideFile);
    }

    // Delete existing variants and recreate
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        images: imageUrls,
        sizeGuideImage: sizeGuideUrl,
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/produto/${product.slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);
    return { error: error.message || "Erro ao atualizar produto." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/produtos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return { error: "Erro ao deletar produto." };
  }
}

export async function setProductPromotion(id: string, isPromotion: boolean, promotionalPrice?: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        isPromotion,
        promotionalPrice: isPromotion ? promotionalPrice : null,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/produtos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar promoção:", error);
    return { error: "Erro ao atualizar promoção do produto." };
  }
}
