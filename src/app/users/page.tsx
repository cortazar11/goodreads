import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { toggleFollow } from "@/actions/follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UsersPage() {

  const session = await getServerSession(authOptions);
  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    : null;
    const following = currentUser
      ? await prisma.follow.findMany({
          where: {
            followerId: currentUser.id,
          },
          select: {
            followingId: true,
          },
        })
      : [];
    const followingSet = new Set(following.map(f => f.followingId));
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="space-y-3">
        {users.map((user) => {
            const isFollowing = followingSet.has(user.id);

            return (
              <div key={user.id} className="border p-4 rounded flex justify-between">
                
                <Link href={`/users/${user.id}`}>
                  <p className="font-medium">{user.name}</p>
                </Link>

                {currentUser?.id !== user.id && (
                  <form action={toggleFollow.bind(null, user.id)}>
                    <button className="px-3 py-1 border rounded">
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </form>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
}