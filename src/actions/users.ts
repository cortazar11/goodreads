"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Compare password
  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  // 3. Success (for now just log)
  console.log("LOGIN SUCCESS:", user.email);

  return {
    success: true,
    userId: user.id,
  };
}