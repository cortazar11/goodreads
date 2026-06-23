import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data (optional but recommended for dev)
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();

  // 1. Create authors
  const frankHerbert = await prisma.author.create({
    data: { name: "Frank Herbert" },
  });

  const orwell = await prisma.author.create({
    data: { name: "George Orwell" },
  });

  const tolkien = await prisma.author.create({
    data: { name: "J.R.R. Tolkien" },
  });

  const asimov = await prisma.author.create({
    data: { name: "Isaac Asimov" },
  });

  const huxley = await prisma.author.create({
    data: { name: "Aldous Huxley" },
  });

  const bradbury = await prisma.author.create({
    data: { name: "Ray Bradbury" },
  });

  const gibson = await prisma.author.create({
    data: { name: "William Gibson" },
  });

  const stephenson = await prisma.author.create({
    data: { name: "Neal Stephenson" },
  });

  const simmons = await prisma.author.create({
    data: { name: "Dan Simmons" },
  });

  const leGuin = await prisma.author.create({
    data: { name: "Ursula K. Le Guin" },
  });

  const clarke = await prisma.author.create({
    data: { name: "Arthur C. Clarke" },
  });

  // 2. Create books linked to authors
  await prisma.book.createMany({
    data: [
      { title: "Dune", authorId: frankHerbert.id },
      { title: "1984", authorId: orwell.id },
      { title: "Animal Farm", authorId: orwell.id },
      { title: "The Hobbit", authorId: tolkien.id },
      { title: "The Lord of the Rings", authorId: tolkien.id },
      { title: "Foundation", authorId: asimov.id },
      { title: "Brave New World", authorId: huxley.id },
      { title: "Fahrenheit 451", authorId: bradbury.id },
      { title: "Neuromancer", authorId: gibson.id },
      { title: "Snow Crash", authorId: stephenson.id },
      { title: "Hyperion", authorId: simmons.id },
      { title: "The Left Hand of Darkness", authorId: leGuin.id },
      { title: "Childhood's End", authorId: clarke.id },
    ],
  });
}

// 3.- Create Users
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: "hashed-password-here",
    },
  });

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });