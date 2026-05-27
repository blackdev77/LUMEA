import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: Role;
    companyId?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role?: Role;
      companyId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: Role;
    companyId?: string;
  }
}
