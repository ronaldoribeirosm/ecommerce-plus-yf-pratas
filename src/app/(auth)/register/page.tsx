import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Header } from "@/components/layout/Header";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-black p-8 shadow-xl border border-white">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-secondary">Crie sua Conta</h1>
            <p className="mt-2 text-sm text-text-muted">
              Junte-se à YF Pratas e descubra elegância em prata 925.
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-text-muted">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-dark hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
