import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.categories.createMany({
    data: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'JavaScript' },
    ],
    skipDuplicates: true,
  })

  await prisma.questions.createMany({
    data: [
      { text: 'What is HTML?', category_id: 1 },
      { text: 'What is CSS?', category_id: 2 },
      { text: 'What is JavaScript?', category_id: 3 },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })