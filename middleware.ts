import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/utils/response";
import { Payload, secretKey } from "@/lib/utils/jwt";
import { jwtVerify } from "jose";

interface AuthRoute {
  startWith: string;
  unauthRedirect: string;
}

const authRoutes: AuthRoute[] = [
  {
    startWith: "/api/admin/protected",
    unauthRedirect: "",
  },
  {
    startWith: "/admin",
    unauthRedirect: "/admin/login",
  },
];

function unauthRedirect(req: NextRequest): NextResponse {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return ApiResponse.unauthorized(
      "A valid authentication token is required."
    );
  }

  const authRoute = authRoutes.find((ar) =>
    req.nextUrl.pathname.startsWith(ar.startWith)
  );

  if (authRoute) {
    return NextResponse.redirect(new URL(authRoute.unauthRedirect, req.url));
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isApiReq = req.nextUrl.pathname.startsWith("/api");

  if (!token) return unauthRedirect(req);

  if (isApiReq) {
    for (const headerName of req.headers.keys()) {
      if (headerName.toLowerCase().startsWith("x-internal-")) {
        return ApiResponse.forbidden("Invalid headers detected.");
      }
    }
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const authData = payload as Payload;

    if (!payload) {
      return unauthRedirect(req);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-internal-id", String(authData.id));

    const authRoute = authRoutes.find((ar) =>
      req.nextUrl.pathname.startsWith(ar.startWith)
    );

    if (!authRoute) {
      return unauthRedirect(req);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return unauthRedirect(req);
  }
}

export const config = {
  matcher: [
    "/api/admin/protected/:path*",
    "/admin/:path((?!login).*)",
    "/admin",
  ],
};
