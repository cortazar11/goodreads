import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Get profile user
  const profileUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!profileUser) notFound();

  // 2. Get followers (users who follow this profileUser)
  const following = await prisma.follow.findMany({
    where: {
      followerId: profileUser.id,
    },
    include: {
      following: true, // the user being followed
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {`${profileUser.name}'s following`}
      </h1>

      <div className="space-y-2">
        {following.length === 0 ? (
          <p className="text-gray-500">No one following yet</p>
        ) : (
          following.map((f) => (
            <div
              key={f.id}
              className="border p-2 rounded"
            >
               <Link
                  href={`/users/${f.following.id}`}
                  className="hover:underline"
                >
                  {f.following.name}
            </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}