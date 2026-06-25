import { getFollowing } from "@/lib/users";
import { getUserById } from "@/lib/users";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUserById(id);
  if (!user) return notFound();

  const following = await getFollowing(id);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">
        {user.name}&apos;s following
      </h1>

      <div className="space-y-2">
        {following.map((f) => (
          <Link
            key={f.id}
            href={`/users/${f.following.id}`}
            className="block border p-3 rounded hover:bg-gray-50"
          >
            {f.following.name}
          </Link>
        ))}
      </div>
    </div>
  );
}