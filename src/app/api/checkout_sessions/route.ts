import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingCost, shippingName, customer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    // Calcular totalAmount
    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const totalAmount = subtotal + (shippingCost || 0);

    // Criar o Pedido no Banco como PENDING
    const order = await prisma.order.create({
      data: {
        userId: customer?.userId || undefined,
        customerName: customer?.name || "",
        customerCpf: customer?.cpf || "",
        customerPhone: customer?.phone || "",
        zipCode: customer?.cep || "",
        street: customer?.street || "",
        number: customer?.number || "",
        complement: customer?.complement || "",
        neighborhood: customer?.neighborhood || "",
        city: customer?.city || "",
        state: customer?.state || "",
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Format line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: `${item.name} (Tam: ${item.size || "Único"})`,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "brl",
          product_data: {
            name: shippingName || "Frete",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        orderId: order.id, // O ID do pedido para o webhook
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento." },
      { status: 500 }
    );
  }
}
