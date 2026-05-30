import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: Role;
    clinicId: string;
    twoFactorEnabled: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      clinicId: string;
      twoFactorEnabled: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: Role;
    clinicId?: string;
    twoFactorEnabled?: boolean;
  }
}
