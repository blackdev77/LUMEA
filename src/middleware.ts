import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";

// Define a fallback for environments without Redis (like initial local dev)
const cache = new Map();

// Initialize Upstash Redis & RateLimiter ONLY if environment variables exist
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// 10 requests per 10 seconds for API routes (adjustable)
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : null;

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const path = request.nextUrl.pathname;
  
  // Apply rate limiting to all /api/ routes
  if (path.startsWith("/api/")) {
    if (ratelimit) {
      const { success, pending, limit, reset, remaining } = await ratelimit.limit(
        `ratelimit_${ip}`
      );
      
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString()
          }}
        );
      }
    } else {
      // In-memory fallback (not distributed, but better than nothing for dev)
      const currentTime = Date.now();
      const userRecord = cache.get(ip) || { count: 0, resetTime: currentTime + 10000 };
      
      if (currentTime > userRecord.resetTime) {
        userRecord.count = 1;
        userRecord.resetTime = currentTime + 10000;
      } else {
        userRecord.count++;
      }
      cache.set(ip, userRecord);

      if (userRecord.count > 10) {
        return NextResponse.json(
          { error: "Too many requests (Memory limit)." },
          { status: 429 }
        );
      }
    }
  }

  // Authentication and RBAC
  const token = await getToken({ req: request });

  // Protect Dashboard
  if (path.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Admin Global
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "SUPERADMIN") {
      // Redirect non-superadmins to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Apply Security Headers
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
