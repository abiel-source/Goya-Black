import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// GET or POST requests to /api/auth are sent to NextAuth
export { handler as GET, handler as POST };
