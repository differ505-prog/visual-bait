import { NextRequest, NextResponse } from "next/server";

// Paths that should never be treated as tenant slugs
const RESERVED_PATHS = [
  "admin", "api", "_next", "favicon.ico", "robots.txt", "sitemap.xml",
  "expired", "c", "_static", "_vercel",
];

function isReservedPath(pathname: string): boolean {
  const segment = pathname.split("/")[1];
  return RESERVED_PATHS.includes(segment);
}

function getTenantSlugFromPath(pathname: string): string | null {
  if (pathname === "/" || pathname === "" || isReservedPath(pathname)) return null;
  return pathname.split("/")[1];
}

async function fetchTenantMeta(slug: string): Promise<{
  active: boolean;
  expiresAt: string;
} | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(
      `${url}/get/${encodeURIComponent(`tenant:${slug}`)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const tenant = data.result;

    if (!tenant || typeof tenant !== "object") return null;

    return {
      active: (tenant.active as boolean) ?? true,
      expiresAt: (tenant.expiresAt as string) ?? "",
    };
  } catch {
    return null;
  }
}

function isExpired(expiresAt: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow all system paths through without tenant logic
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/expired") ||
    pathname.startsWith("/c/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Extract tenant slug from path (e.g. /chuangjiabao → chuangjiabao)
  const slug = getTenantSlugFromPath(pathname);
  if (!slug) return NextResponse.next();

  // Fetch tenant metadata from KV
  const tenantMeta = await fetchTenantMeta(slug);

  if (!tenantMeta) {
    // Unknown tenant — let Next.js render its 404
    return NextResponse.next();
  }

  if (!tenantMeta.active) {
    return NextResponse.redirect(new URL("/expired", req.url));
  }

  if (isExpired(tenantMeta.expiresAt)) {
    const expiredUrl = new URL(`/expired?slug=${encodeURIComponent(slug)}`, req.url);
    return NextResponse.redirect(expiredUrl);
  }

  // Inject resolved tenant slug into request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-slug", slug);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
