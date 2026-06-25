import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">

      {/* HERO IMAGE */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="/reading-unsplash.jpg"
          alt="Books"
          fill
          className="object-cover"
        />
      </div>

      {/* TEXT CONTENT BELOW */}
      <div className="max-w-3xl mx-auto text-center px-6 py-12">

        <h1 className="text-4xl md:text-5xl font-bold">
          Discover your next favorite book
        </h1>

        <p className="mt-4 text-gray-600">
          Track books, write reviews, and follow other readers in your own
          personalized reading space.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            href="/books"
            className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Browse Books
          </Link>

          <Link
            href="/users"
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Explore Users
          </Link>
        </div>

      </div>

    </div>
  );
}