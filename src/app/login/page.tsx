"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn("credentials", { email, password,callbackUrl: "/" });
  }

 return (
  <div className="flex items-center justify-center py-12">
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
      
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-600">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

      </form>
    </div>
  </div>
  );
}