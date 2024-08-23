import { NextResponse, NextRequest } from "next/server";
import axiosInstance from "./lib/api";

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

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
