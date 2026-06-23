"use server";

import { prisma } from "@/lib/prisma";

export async function updateShelf(
  userId: string,
  bookId: string,
  status: "WANT_TO_READ" | "READING" | "READ"
) {
  await prisma.userBook.upsert({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },

    update: {
      status,
    },

    create: {
      userId,
      bookId,
      status,
    },
  });
}