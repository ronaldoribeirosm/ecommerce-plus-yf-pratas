import { prisma } from "@/lib/prisma";
import { MessageCircle } from "lucide-react";
import { PromoForm } from "@/features/admin/components/PromoForm";

export default async function AdminPromotions() {
  // Buscar usuários registrados
  const users = await prisma.user.findMany({
    where: { phone: { not: null } },
    select: { name: true, phone: true },
  });

  // Buscar clientes do checkout (sem conta ou com conta mas preencheram no checkout)
  const orders = await prisma.order.findMany({
    where: { customerPhone: { not: null } },
    select: { customerName: true, customerPhone: true },
  });

  // Consolidar contatos (evitando duplicatas pelo telefone)
  const contactsMap = new Map<string, { name: string; phone: string }>();

  users.forEach((u) => {
    if (u.phone) {
      // Clean phone to numeric only
      const cleanPhone = u.phone.replace(/\D/g, "");
      if (cleanPhone.length >= 10) {
        contactsMap.set(cleanPhone, { name: u.name || "Cliente", phone: cleanPhone });
      }
    }
  });

  orders.forEach((o) => {
    if (o.customerPhone) {
      const cleanPhone = o.customerPhone.replace(/\D/g, "");
      if (cleanPhone.length >= 10) {
        contactsMap.set(cleanPhone, { name: o.customerName || "Cliente", phone: cleanPhone });
      }
    }
  });

  const contacts = Array.from(contactsMap.values());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-secondary">
          Central de Promoções
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Gerencie e dispare mensagens promocionais para seus clientes no WhatsApp.
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-black rounded-xl shadow-sm border border-white">
          <MessageCircle className="mx-auto h-12 w-12 text-primary-light" />
          <p className="mt-4 text-text-muted font-medium">Nenhum contato encontrado ainda.</p>
        </div>
      ) : (
        <PromoForm contacts={contacts} />
      )}
    </div>
  );
}
