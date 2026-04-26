import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Header } from "@/components/layout/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-black p-8 shadow-xl border border-white">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-secondary">Bem-vinda de volta</h1>
            <p className="mt-2 text-sm text-text-muted">
              Faça login para acessar sua conta e acompanhar seus pedidos.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-text-muted">
            Ainda não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary-dark hover:underline"
            >
              Crie uma agora
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
