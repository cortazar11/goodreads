import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BooksPage() {
 const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  return (
    <div>
       {/* HEADER ROW */}
      <div className="grid grid-cols-2 font-semibold text-gray-700 border-b pb-2 mb-3">
        <div>Book</div>
        <div>Author</div>
      </div>
      {/* DATA ROWS */}
      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="grid grid-cols-2 border-b pb-2"
          >
            <Link
              href={`/books/${book.id}`}
              className="hover:underline font-medium"
            >
              {book.title}
            </Link>

            <span className="text-gray-600">
              {book.author?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}