import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function FollowersPage({
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
  const followers = await prisma.follow.findMany({
    where: {
      followingId: profileUser.id,
    },
    include: {
      follower: true, // the actual user who follows
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {profileUser.name}'s followers
      </h1>

      <div className="space-y-2">
        {followers.length === 0 ? (
          <p className="text-gray-500">No followers yet</p>
        ) : (
          followers.map((f) => (
            <div
              key={f.id}
              className="border p-2 rounded"
            >
              {f.follower.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}