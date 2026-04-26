import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Criando usuário admin...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@elegance.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Administrador Elegance",
      email: "admin@elegance.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin criado com sucesso:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
