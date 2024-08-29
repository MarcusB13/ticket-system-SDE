import { NextResponse, NextRequest } from "next/server";
import axiosInstance from "./lib/api";
import { v4 as uuidv4 } from "uuid";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const dashboardPath = "/dashboard";
  const signInPath = "/sign-in";

  if (url.pathname.startsWith(dashboardPath)) {
    try {
      const response = await axiosInstance.get("/users/check-token/");

      if (response.status !== 200) {
        return NextResponse.redirect(new URL(signInPath, req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(signInPath, req.url));
    }
  }

  const csrfToken = req.cookies.get("csrfToken");

  if (!csrfToken) {
    const newToken = uuidv4();
    const response = NextResponse.next();

    response.cookies.set('csrfToken', newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next|static|favicon.ico).*)",
};
