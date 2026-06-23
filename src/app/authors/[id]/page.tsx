import {prisma} from '@/lib/prisma';
import {notFound} from 'next/navigation';
import Link from 'next/link';

interface AuthorPageProps {
    params: Promise<{ id: string }>;
}

export default async function AuthorPage({params}: AuthorPageProps) {
    const {id} = await params;

    const author = await prisma.author.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            books: {    
                select: {
                    id: true,
                    title: true
                }
            }   
        }  
    })  

    if (!author) {
        notFound();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-8">{author.name}</h1>
            <ul>
                {author.books.map((book) => (
                    <li key={book.id}>
                        <Link href={`/books/${book.id}`}>
                            <p>{book.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}   
