import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <Link
                href={`/users/${user.id}`}
                className="font-medium hover:underline"
              >
                {user.name}
              </Link>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}