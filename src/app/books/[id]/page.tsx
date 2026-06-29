import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateShelf } from "@/actions/userBooks";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function BookPage({
  params,
}: {
    params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  const book = await prisma.book.findUnique({
    where: { id},
    include: {
      author: true,
    },
  });

  if (!book) notFound();

  const ratings = await prisma.userBook.findMany({
    where: {
      bookId: book.id,
      rating: { not: null },
    },
    select: {
      rating: true,
    },
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        ratings.length
      : null;

  const userBook = await prisma.userBook.findUnique({
    where: {
      userId_bookId: {
        userId: user.id,
        bookId: book.id,
      },
    },
  });

  // ---------------------------
  // SHELF ACTION
  // ---------------------------
 
  async function changeShelf(
  userId: string,
  bookId: string,
  formData: FormData
) {
  "use server";

  const status = formData.get("status") as
    | "WANT_TO_READ"
    | "READING"
    | "READ";

  await updateShelf(userId, bookId, status);

  revalidatePath(`/books/${bookId}`);
  redirect(`/books/${bookId}`);
}

  // ---------------------------
  // RATING ACTION (FIXED)
  // ---------------------------
  async function updateRating(
     userId: string,
    bookId: string,
    formData: FormData
  ) {
    "use server";

    const rating = Number(formData.get("rating"));

    await prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId: userId,
        bookId: bookId,
        status: "WANT_TO_READ",
        rating,
      },
    });

    revalidatePath(`/books/${bookId}`);
    redirect(`/books/${bookId}`);
  }

  // ---------------------------
  // REVIEW ACTION
  // ---------------------------
  async function updateReview(
     userId: string,
    bookId: string,
   formData: FormData
  ) {
    "use server";

    const review = formData.get("review") as string;

    await prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
      update: {
        review,
      },
      create: {
        userId: userId,
        bookId: bookId,
        status: "WANT_TO_READ",
        review,
      },
    });

    revalidatePath(`/books/${bookId}`);
    redirect(`/books/${bookId}`);
  }

  if (!userBook) return null;

  const reviews = await prisma.userBook.findMany({
    where: {
      bookId: book.id,
      review: { not: null },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">
          {book.title} by {book.author?.name}
        </h1>

        {averageRating !== null ? (
          <p className="text-gray-600">
            ⭐ {averageRating.toFixed(1)} ({ratings.length} ratings)
          </p>
        ) : (
          <p className="text-gray-500">No ratings yet</p>
        )}
      </section>

      {/* SHELF */}
      <section className="border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Your reading status</h2>

        <form action={changeShelf.bind(null, user.id, book.id)} className="flex gap-2 items-center">
          <select
            name="status"
            defaultValue={userBook?.status ?? "WANT_TO_READ"}
            className="border rounded px-2 py-1"
          >
            <option value="WANT_TO_READ">Want to Read</option>
            <option value="READING">Reading</option>
            <option value="READ">Read</option>
          </select>

          <button className="bg-black text-white px-3 py-1 rounded">
            Save
          </button>
        </form>
      </section>

      {/* RATING */}
      <section className="border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">Your rating</h2>

        <form action={updateRating.bind(null, user.id, book.id)} className="flex items-center gap-2">
          <select
            name="rating"
            defaultValue={userBook?.rating ?? ""}
            className="border rounded px-2 py-1"
          >
            <option value="">Not rated</option>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐⭐</option>
            <option value="3">3 ⭐⭐⭐</option>
            <option value="4">4 ⭐⭐⭐⭐</option>
            <option value="5">5 ⭐⭐⭐⭐⭐</option>
          </select>

          <button className="bg-black text-white px-3 py-1 rounded">
            Save
          </button>
        </form>
      </section>

      {/* REVIEW */}
      <section className="border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">Your review</h2>

        <form action={updateReview.bind(null, user.id, book.id)} className="space-y-2">
          <textarea
            name="review"
            defaultValue={userBook?.review ?? ""}
            rows={5}
            className="w-full border rounded p-2"
            placeholder="Write your thoughts..."
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            Save Review
          </button>
        </form>

        {userBook?.review && (
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="font-semibold">Your saved review</p>
            <p className="text-gray-700 mt-1">{userBook.review}</p>
          </div>
        )}
      </section>

      {/* COMMUNITY REVIEWS */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Community Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border rounded p-3">
              <p className="text-sm text-gray-500">{r.user.name}</p>
              <p className="mt-1">{r.review}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

// This function is used to generate static paths for all books in the database.