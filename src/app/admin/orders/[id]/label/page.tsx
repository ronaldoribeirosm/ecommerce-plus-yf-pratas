import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function OrderLabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-white text-black p-8 max-w-3xl mx-auto my-8 border-2 border-dashed border-gray-400 font-sans print:border-none print:m-0 print:p-0">
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">YF Pratas</h1>
          <p className="text-sm">Rua Fictícia de Exemplo, 100</p>
          <p className="text-sm">São Paulo - SP | CEP: 01000-000</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">ETIQUETA DE ENVIO</h2>
          <p className="text-sm">Pedido: #{order.id.slice(-8).toUpperCase()}</p>
          <p className="text-sm">Data: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="py-4">
        <h3 className="text-lg font-bold mb-2">DESTINATÁRIO</h3>
        <p className="text-xl font-bold uppercase">{order.customerName}</p>
        <p className="text-lg mt-2">
          {order.street}, {order.number} {order.complement && ` - ${order.complement}`}
        </p>
        <p className="text-lg">{order.neighborhood}</p>
        <p className="text-lg">{order.city} - {order.state}</p>
        <p className="text-xl font-bold mt-2">CEP: {order.zipCode}</p>
      </div>

      <div className="border-t-2 border-black pt-4 mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm">Telefone: {order.customerPhone}</p>
          <p className="text-sm">CPF: {order.customerCpf}</p>
        </div>
        <div className="border-2 border-black p-2 text-center w-32 h-32 flex items-center justify-center font-bold text-gray-400">
          QR CODE
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.print();`
        }}
      />
    </div>
  );
}
