import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  const formattedItems = cart.items.map((item) => ({
    id: item.productId,
    name: item.product.name,
    price: item.product.isPromotion && item.product.promotionalPrice ? item.product.promotionalPrice : item.product.price,
    imageUrl: item.product.images[0] || "",
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  }));

  return NextResponse.json({ items: formattedItems });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { items } = await req.json();

  // Deleta o carrinho atual e recria
  await prisma.cart.deleteMany({ where: { userId: session.user.id } });

  if (items && items.length > 0) {
    await prisma.cart.create({
      data: {
        userId: session.user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            size: item.size || "Único",
            color: item.color || "Única",
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  return NextResponse.json({ success: true });
}
