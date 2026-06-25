import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            GoodReads
          </Link>

          <Link href="/books" className="hover:underline">
            Books
          </Link>

          <Link href="/authors" className="hover:underline">
            Authors
          </Link>

          <Link href="/users" className="hover:underline">
            People
          </Link>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 flex justify-center">
          <form action="/search" className="flex items-center">
            <input
              type="text"
              name="q"
              placeholder="Search books or users..."
              className="border rounded px-3 py-1 text-sm w-64"
            />
          </form>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                {session.user?.name}
              </span>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>

              <Link href="/register" className="hover:underline">
                Create Account
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}