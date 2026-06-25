import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    include: {
      author: true,
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      <h1 className="text-2xl font-bold mb-6">
        Books
      </h1>

      {books.map((book) => {

        // OPTION 1: if you have ISBN (BEST)
        const coverUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(
              book.title
            )}-M.jpg`;

        return (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
          >

            {/* COVER */}
            <div className="relative w-12 h-16 flex-shrink-0">
              <Image
                src={coverUrl}
                alt={book.title}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* TEXT */}
            <div>
              <p className="font-semibold">
                {book.title}
              </p>

              <p className="text-sm text-gray-500">
                {book.author?.name}
              </p>
            </div>

          </Link>
        );
      })}

    </div>
  );
}