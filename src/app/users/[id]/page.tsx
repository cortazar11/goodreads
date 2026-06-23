import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


async function toggleFollow(targetUserId: string) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) return;

  

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });
  }

  await revalidatePath(`/users/${targetUserId}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. profile user (the page you are visiting)
  const profileUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!profileUser) return notFound();
  const followersCount = await prisma.follow.count({
      where: {
        followingId: profileUser.id,
      },
  });
  const followingCount = await prisma.follow.count({
      where: {
        followerId: profileUser.id,
      },
  });

  // 2. current logged-in user
  const session = await getServerSession(authOptions);

  const currentUserEmail = session?.user?.email;

  const currentUser = currentUserEmail
    ? await prisma.user.findUnique({
        where: { email: currentUserEmail },
      })
    : null;

  // 3. check follow state
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
    <div>
      {/* PROFILE USER (NOT YOU) */}
      <h1>{profileUser.name}</h1>

      <div>
        {followersCount} followers · {followingCount} following
      </div>

      {/* FOLLOW BUTTON (depends on relationship) */}
      <form action={toggleFollow.bind(null, profileUser.id)}>
        <button>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </form>
    </div>
  );
}