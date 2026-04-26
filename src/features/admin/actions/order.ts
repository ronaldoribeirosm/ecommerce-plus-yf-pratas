"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTrackingCode(orderId: string, trackingCode: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        trackingCode,
        status: trackingCode ? "SHIPPED" : undefined // Opcional: já muda pra enviado
      },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating tracking code:", error);
    return { error: "Erro ao atualizar o código de rastreio." };
  }
}
