import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  const users = [
    {
      id: "current-user",
      name: "João Silva",
      email: "joao@clubhousefc.com",
      image: "/diverse-user-avatars.png",
      bio: "Torcedor apaixonado do ClubHouse FC há mais de 10 anos. Sempre presente nos jogos!",
      location: "São Paulo, SP",
      emailVerified: true,
    },
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@clubhousefc.com",
      image: "/diverse-user-avatars.png",
      bio: "Defensora número 1 do nosso time. Vamos ClubHouse FC!",
      location: "Rio de Janeiro, RJ",
      emailVerified: true,
    },
    {
      id: "2",
      name: "Carlos Eduardo",
      email: "carlos@clubhousefc.com",
      image: "/diverse-user-avatars.png",
      bio: "Apaixonado por futebol e engajado na comunidade do clube.",
      location: "Belo Horizonte, MG",
      emailVerified: true,
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
      },
    })
  }

  console.log("✅ Seed de usuários concluído!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
