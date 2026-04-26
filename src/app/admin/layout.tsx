import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/features/admin/components/Sidebar";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  // Verificação de segurança: Checar se o usuário ainda existe no banco
  // e se ainda tem o cargo de ADMIN. (Isso evita vulnerabilidades de JWT onde
  // a sessão no navegador sobrevive ao reset do banco de dados).
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-black p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
