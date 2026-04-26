"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Contact {
  name: string;
  phone: string;
}

export function PromoForm({ contacts }: { contacts: Contact[] }) {
  const [message, setMessage] = useState(
    "Olá *[Nome]*, temos novidades incríveis na YF Pratas pra você! Confira nossas promoções do mês."
  );

  const getWaLink = (contact: Contact) => {
    // Adiciona DDI Brasil se não tiver (presumindo telefones BR)
    const phoneWithDDI = contact.phone.length <= 11 ? `55${contact.phone}` : contact.phone;
    
    // Substitui [Nome] pelo nome da pessoa
    const personalizedMessage = message.replace(/\[Nome\]/gi, contact.name.split(" ")[0]);
    
    return `https://wa.me/${phoneWithDDI}?text=${encodeURIComponent(personalizedMessage)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor da Mensagem */}
      <div className="lg:col-span-1 bg-black p-6 rounded-xl shadow-sm border border-white h-fit">
        <h2 className="text-lg font-bold text-white mb-4">Sua Mensagem</h2>
        <p className="text-xs text-text-muted mb-4">
          Dica: Use <code>[Nome]</code> para o sistema trocar automaticamente pelo nome do cliente.
        </p>
        <textarea
          className="w-full h-40 p-3 rounded-md border border-primary-light text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="bg-primary-light/20 p-3 rounded text-xs text-text-muted border border-primary-light/50">
          <strong>Como usar:</strong> Personalize a mensagem, depois clique em "Enviar" na lista ao lado. O WhatsApp Web abrirá pronto para o disparo!
        </div>
      </div>

      {/* Lista de Contatos */}
      <div className="lg:col-span-2 bg-black rounded-xl shadow-sm border border-white overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <h2 className="text-lg font-bold text-white">Contatos Ativos ({contacts.length})</h2>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-zinc-900 text-zinc-400 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">WhatsApp</th>
                <th className="px-6 py-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {contacts.map((contact, idx) => (
                <tr key={idx} className="hover:bg-zinc-900 transition-colors">
                  <td className="px-6 py-4 font-medium">{contact.name}</td>
                  <td className="px-6 py-4">{contact.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={getWaLink(contact)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Enviar WA
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
