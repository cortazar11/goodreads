import { registerUser } from "@/actions/users";

export default function RegisterPage() {
  return (
  <div className="flex items-center justify-center py-12">
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">

      <h1 className="text-2xl font-bold mb-6">Register</h1>

      <form action={registerUser} className="space-y-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Name</label>
          <input
            name="name"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Password</label>
          <input
            name="password"
            type="password"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Create Account
        </button>

      </form>
    </div>
  </div>
);
}