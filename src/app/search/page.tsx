import { prisma } from "@/lib/prisma";

type SearchPageProps = {
  searchParams:Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;

  const books = q
  ? await prisma.book.findMany({
      where: {
        title: {
          contains: q,
          mode: "insensitive",
        },
     },
      include: {
        author: true,
      },
    })
  : [];

  const authors = q
    ? await prisma.author.findMany({
        where: {
            name: {
            contains: q,
            mode: "insensitive",
            },
        },
        })
    : [];

  return (
    <div>
      <h1>Search Results</h1>
      <p>Searching for: {q}</p>
      <div className="space-y-2">
        {books.map((book) => (
          <div key={book.id} className="border p-2 rounded">
            <h2>{book.title}</h2>
            <p>{book.author?.name}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-6">
        Authors
    </h2>

    <div className="space-y-2">
            {authors.length === 0 ? (
                <p className="text-gray-500">No authors found</p>
            ) : (
                authors.map((author) => (
                <div key={author.id} className="border p-2 rounded">
                    {author.name}
                </div>
                ))
            )}
    </div>
    </div>
  );
}