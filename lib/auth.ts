import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/prisma"; // Adjust the import path as needed

export async function verifyAuth(userId: string) {
  // Check the cookie
  const cookie = cookies().get("Authorization");
  const jwt = cookie?.value;

  // If no token is found in the cookie, return false
  if (!jwt) {
    return false;
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    // Verify JWT
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log(payload);

    // Check if the parameter id is equal to the user id in the JWT
    if (payload.sub !== userId) {
      return false;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub }, // Ensure `sub` corresponds to user ID
    });

    if (!user) {
      return false; // Invalid user ID
    }

    return { payload, role: user.role, id: user.id }; // Return payload if user exists
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return false;
  }
}
