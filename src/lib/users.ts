import { prisma } from "@/lib/prisma";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getFollowStats(userId: string) {
  const [followers, following] = await Promise.all([
    prisma.follow.count({
      where: { followingId: userId },
    }),
    prisma.follow.count({
      where: { followerId: userId },
    }),
  ]);

  return { followers, following };
}

export async function getFollowers(userId: string) {
  return prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getFollowing(userId: string) {
  return prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}