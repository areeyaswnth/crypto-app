import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
}

main()
  .then(() => {
    console.log('Seed completed.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
