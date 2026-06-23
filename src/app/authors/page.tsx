import {prisma} from '@/lib/prisma';
import Link from 'next/link';

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    select:{
      id: true,
      name: true
        }
  })

  return (
      <>
          <h1 className="text-2xl font-bold mb-6">Authors</h1>

          <ul className="space-y-3">
            {authors.map((author) => (
              <li key={author.id} className="border-b pb-3">
                <Link
                  href={`/authors/${author.id}`}
                  className="hover:underline font-medium"
                >
                  {author.name}
                </Link>
              </li>
            ))}
          </ul>
    </>
   
  );
}