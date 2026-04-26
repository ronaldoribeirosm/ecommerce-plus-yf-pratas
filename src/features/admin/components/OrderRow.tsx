"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTrackingCode } from "../actions/order";
import { ExternalLink, Printer } from "lucide-react";

interface OrderRowProps {
  order: any;
}

export function OrderRow({ order }: OrderRowProps) {
  const [tracking, setTracking] = useState(order.trackingCode || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateTrackingCode(order.id, tracking);
    setLoading(false);
    alert("Código salvo!");
  };

  const handlePrint = () => {
    window.open(`/admin/orders/${order.id}/label`, "_blank");
  };

  return (
    <div className="bg-black p-6 rounded-xl border border-white shadow-sm flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h3 className="font-bold text-white">Pedido: #{order.id.slice(-6)}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
            {order.status}
          </span>
        </div>
        
        <div className="text-sm text-zinc-300">
          <p><strong>Cliente:</strong> {order.customerName} ({order.customerPhone})</p>
          <p><strong>CPF:</strong> {order.customerCpf}</p>
          <p><strong>Endereço:</strong> {order.street}, {order.number} {order.complement && `(${order.complement})`}</p>
          <p>{order.neighborhood} - {order.city}/{order.state} - CEP: {order.zipCode}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-sm font-medium mb-2 text-white">Itens:</p>
          <ul className="text-sm space-y-1 text-zinc-400">
            {order.items.map((item: any) => (
              <li key={item.id}>{item.quantity}x {item.product?.name} (R$ {item.price})</li>
            ))}
          </ul>
          <p className="mt-2 font-bold text-white">Total: R$ {order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="w-full md:w-64 flex flex-col justify-end gap-3 bg-zinc-900 p-4 rounded-lg">
        <div>
          <label className="text-xs font-bold text-white mb-1 block">Código de Rastreio:</label>
          <div className="flex gap-2">
            <Input 
              value={tracking} 
              onChange={(e) => setTracking(e.target.value)} 
              placeholder="Ex: PX12345BR"
              className="text-sm h-9"
            />
            <Button size="sm" onClick={handleSave} disabled={loading}>
              Salvar
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir Etiqueta
        </Button>
      </div>
    </div>
  );
}
