import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Uncomment the default export if you are using custom middleware
export { default } from "next-auth/middleware";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Check if the user is authenticated
  if (token) {
    // Redirect authenticated users away from authentication pages
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // Redirect unauthenticated users to the sign-in page if they are trying to access protected pages
    if (url.pathname.startsWith("/")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/verify/:path*"],
};
