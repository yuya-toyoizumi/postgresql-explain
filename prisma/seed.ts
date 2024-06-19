import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const ACCOUNT_COUNT = 10;
const USER_COUNT = 10000;

enum AccountType {
  FREE = 'FREE',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  SPECIAL = 'SPECIAL',
}

enum UserRoleType {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
}

async function main() {
  const accountTypes = Object.values(AccountType);
  const userRoleTypes = Object.values(UserRoleType);
  for (let i = 0; i < ACCOUNT_COUNT; i++) {
    const type = accountTypes[Math.floor(Math.random() * accountTypes.length)];
    const account = await prisma.account.create({
      data: {
        name: faker.company.name(),
        type: type,
      }
    });

    const users = [...Array(USER_COUNT)].map((_, index) => {
      const role = userRoleTypes[Math.floor(Math.random() * userRoleTypes.length)];
      return {
        name: faker.person.fullName(),
        email: `${i}${index}${faker.internet.email()}`,
        role: role,
        accountId: account.id,
      };
    });

    await prisma.user.createMany({
      data: users
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
