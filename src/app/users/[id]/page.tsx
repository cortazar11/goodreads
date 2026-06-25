import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getUserById, getFollowStats } from "@/lib/users";
import { prisma } from "@/lib/prisma";

import { toggleFollow } from "@/actions/follow";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. profile user
  const profileUser = await getUserById(id);
  if (!profileUser) return notFound();

  // 2. follow stats
  const { followers, following } = await getFollowStats(id);

  // 3. current user
  const session = await getServerSession(authOptions);

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    : null;

  // 4. follow state
  const isFollowing = currentUser
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: profileUser.id,
          },
        },
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        {profileUser.name}
      </h1>

      {/* STATS */}
      <div className="flex gap-4 text-sm text-gray-600">
        <Link href={`/users/${id}/followers`}>
          {followers} followers
        </Link>

        <Link href={`/users/${id}/following`}>
          {following} following
        </Link>
      </div>

      {/* FOLLOW BUTTON */}
      {currentUser?.id !== profileUser.id && (
        <form action={toggleFollow.bind(null, profileUser.id)}>
          <button className="px-3 py-1 border rounded">
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </form>
      )}
    </div>
  );
}