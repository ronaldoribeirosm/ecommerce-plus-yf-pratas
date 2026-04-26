import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed completo do banco de dados YF Pratas...");

  // Criar Administrador
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@yfpratas.com" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      name: "Administrador YF",
      email: "admin@yfpratas.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Administrador garantido (admin@yfpratas.com / admin123)");

  // Criar ou obter categorias
  const categoriesData = [
    { name: "Lançamentos", slug: "lancamentos" },
    { name: "Anéis", slug: "aneis" },
    { name: "Colares", slug: "colares" },
    { name: "Pulseiras", slug: "pulseiras" },
    { name: "Brincos", slug: "brincos" },
    { name: "Conjuntos", slug: "conjuntos" },
    { name: "Promoções", slug: "promocoes" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = category.id;
  }

  console.log("Categorias garantidas!");

  // Limpar produtos antigos antes de injetar os novos para não poluir
  await prisma.product.deleteMany();
  console.log("Catálogo antigo limpo.");

  // Novos produtos premium YF Pratas
  const products = [
    {
      name: "Anel Solitário Cravejado Prata 925",
      slug: "anel-solitario-cravejado-prata-925",
      description: "Um clássico atemporal. Este anel solitário é confeccionado em Prata 925 legítima, com uma zircônia central de brilho intenso e microzircônias cravejadas no aro. Perfeito para noivados ou para presentear quem você ama com elegância e sofisticação.",
      price: 189.90,
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["aneis"],
      stock: 20,
      sizes: ["14", "16", "18", "20", "22"],
      colors: ["Prata Branca"],
    },
    {
      name: "Colar Ponto de Luz Gota Prata",
      slug: "colar-ponto-luz-gota",
      description: "O colar Ponto de Luz em formato de gota é a joia que não pode faltar no seu porta-joias. Delicado e brilhante, acompanha corrente veneziana fina de Prata 925. A peça ideal para o dia a dia ou para compor um mix de colares incrível.",
      price: 149.90,
      images: ["https://images.unsplash.com/photo-1599643477874-5c866f438343?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["colares"],
      stock: 35,
      sizes: ["40cm", "45cm", "50cm"],
      colors: ["Prata Branca"],
    },
    {
      name: "Pulseira Elo Português Prata 925",
      slug: "pulseira-elo-portugues",
      description: "Uma pulseira robusta e cheia de estilo. O elo português é um dos designs mais desejados da joalheria, garantindo durabilidade e um visual marcante. Pode ser usada sozinha ou acompanhada de berloques e pingentes.",
      price: 229.90,
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["pulseiras"],
      stock: 15,
      sizes: ["18cm", "20cm"],
      colors: ["Prata Clara", "Prata Envelhecida"],
    },
    {
      name: "Brinco Argola Fina Média",
      slug: "brinco-argola-fina-media",
      description: "A clássica argola fina média em Prata 925. Leve, versátil e essencial. Uma peça coringa que ilumina o rosto e combina com absolutamente qualquer look, desde o básico até o mais elaborado.",
      price: 89.90,
      images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["brincos"],
      stock: 50,
      sizes: ["Único"],
      colors: ["Prata Branca"],
    },
    {
      name: "Conjunto Riviera Premium",
      slug: "conjunto-riviera-premium",
      description: "Brilho que impressiona! Conjunto colar e pulseira estilo Riviera, cravejado de ponta a ponta com zircônias de altíssima qualidade. A escolha perfeita para grandes eventos e casamentos.",
      price: 599.90,
      images: ["https://images.unsplash.com/photo-1515562141207-7a8ea4114e17?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["conjuntos"],
      stock: 8,
      sizes: ["Único"],
      colors: ["Prata com Zircônia Branca", "Prata com Zircônia Negra"],
      isPromotion: true,
      promotionalPrice: 499.90
    },
    {
      name: "Anel Aparador Meia Aliança",
      slug: "anel-aparador-meia-alianca",
      description: "Aparador de aliança delicado e elegante. Ideal para ser usado junto com sua aliança de casamento ou noivado, adicionando um toque de brilho extra e proteção à sua joia principal.",
      price: 129.90,
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["lancamentos"],
      stock: 30,
      sizes: ["12", "14", "16", "18", "20", "22", "24"],
      colors: ["Prata Branca"],
    },
    {
      name: "Escapulário Tradicional Prata 925",
      slug: "escapulario-tradicional",
      description: "Um símbolo de fé e proteção. Escapulário tradicional em Prata 925 com medalhas finamente detalhadas. Corrente de malha veneziana, unissex e perfeito para uso contínuo.",
      price: 169.90,
      images: ["https://images.unsplash.com/photo-1599643478514-46b1d03f0b2f?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["colares"],
      stock: 25,
      sizes: ["60cm"],
      colors: ["Prata Branca"],
    },
    {
      name: "Brinco Ear Cuff Zircônias",
      slug: "brinco-ear-cuff-zirconias",
      description: "Moderno e ousado, o Ear Cuff sobe pela orelha criando um visual incrível sem a necessidade de múltiplos furos. Cravejado com zircônias brilhantes, é a joia para quem tem atitude.",
      price: 199.90,
      images: ["https://images.unsplash.com/photo-1535632787350-4e68e0c6c39a?q=80&w=1000&auto=format&fit=crop"],
      categoryId: categoryMap["promocoes"], 
      stock: 12,
      sizes: ["Único"],
      colors: ["Prata Branca"],
      isPromotion: true,
      promotionalPrice: 159.90
    }
  ];

  for (const prod of products) {
    const { sizes, colors, stock, isPromotion, promotionalPrice, ...productData } = prod;
    
    const variantsData = [];
    for (const size of sizes) {
      for (const color of colors) {
        variantsData.push({
          size,
          color,
          stock: Math.floor(Math.random() * 15) + 2, // Estoque aleatório
        });
      }
    }

    await prisma.product.create({
      data: {
        ...productData,
        isPromotion: isPromotion || false,
        promotionalPrice: promotionalPrice || null,
        variants: {
          create: variantsData,
        }
      },
    });
  }

  console.log("8 Produtos de Joalheria injetados com sucesso com suas Variantes!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
