import type { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: UserRole
      name: string
    }
  }

  interface User {
    id: string
    email: string
    nickname: string
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    role?: UserRole
    nickname?: string
  }
}
