"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return { error: "Nome obrigatório" };

  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

  try {
    await prisma.category.create({
      data: { name, slug }
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao criar categoria" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao deletar (ela pode estar em uso)" };
  }
}
