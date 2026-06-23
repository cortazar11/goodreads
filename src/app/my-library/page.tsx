import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Book } from "@prisma/client";

export default async function MyLibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Please login</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return <div>User not found</div>;

  const userBooks = await prisma.userBook.findMany({
    where: { userId: user.id },
    include: {
      book: true,
    },
  });

    const grouped: {
        WANT_TO_READ: Book[];
        READING: Book[];
        READ: Book[];
        } = {
        WANT_TO_READ: [],
        READING: [],
        READ: [],
    };

  for (const ub of userBooks) {
    grouped[ub.status].push(ub.book);
  }

 
    return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">My Library</h1>

      <Section title="Want to Read" books={grouped.WANT_TO_READ} />
      <Section title="Reading" books={grouped.READING} />
      <Section title="Read" books={grouped.READ} />
    </div>
  );
}

 function Section({
        title,
        books,
    }: {
        title: string;
        books: Book[];
    }) {
            return (
                <div className="space-y-3">
                <h2 className="text-xl font-semibold">
                    {title} ({books.length})
                </h2>

                {books.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                    No books here yet
                    </p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {books.map((book) => (
                        <div
                        key={book.id}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                        <a href={`/books/${book.id}`}>
                            <h3 className="font-medium">
                            {book.title}
                            </h3>

                            {book.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {book.description}
                            </p>
                            )}
                        </a>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            );
}