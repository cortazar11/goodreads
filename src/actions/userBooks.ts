"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const updated = await prisma.userBook.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
  });

  console.log("Updated status:", updated?.status);

  revalidatePath(`/books/${bookId}`);
  redirect(`/books/${bookId}`);
  
}