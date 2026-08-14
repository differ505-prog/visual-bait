import { NextRequest, NextResponse } from "next/server";

// Reserved paths that should not be treated as tenant slugs
const RESERVED_PATHS = [
  "admin", "api", "_next", "favicon.ico", "robots.txt", "sitemap.xml",
  "expired", "c", "_static", "_vercel",
];

// Subdomain patterns that are system domains (not tenant slugs)
const RESERVED_SUBDOMAINS = [
  "www", "api", "admin", "mail", "ftp", "localhost",
];

function isReservedPath(path: string): boolean {
  const segment = path.split("/")[1];
  return RESERVED_PATHS.includes(segment);
}

function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}

function parseHostname(hostname: string): {
  subdomain: string | null;
  domain: string;
  suffix: string;
} {
  // Handle localhost / custom domains
  const parts = hostname.split(".");

  if (parts.length === 1) {
    return { subdomain: null, domain: hostname, suffix: "" };
  }

  // Vercel preview/custom domains: tenant-slug.visual-bait.vercel.app
  // Or custom: www.mydomain.com
  if (parts.length >= 3) {
    const suffix = parts.slice(-2).join(".");
    const domain = parts.slice(-3, -2)[0];
    const subdomain = parts.slice(0, -2).join(".");
    return { subdomain, domain, suffix };
  }

  // Two-part domain: mydomain.com
  return { subdomain: null, domain: parts[0], suffix: parts.slice(1).join(".") };
}

function getTenantSlug(req: NextRequest): string | null {
  const { pathname } = req.nextUrl;
  const { hostname } = req.nextUrl;

  // Path-based: /{slug}/*
  if (pathname !== "/" && !isReservedPath(pathname)) {
    const slug = pathname.split("/")[1];
    if (slug) return slug;
  }

  // Subdomain-based: {slug}.vercel.app
  const { subdomain, domain } = parseHostname(hostname);

  // Check for tenant subdomain (only on Vercel domains or custom domain with subdomain)
  if (subdomain && !isReservedSubdomain(subdomain)) {
    return subdomain;
  }

  // Custom domain mapped to a tenant via domain-map:{domain} key
  // We check the full hostname as the domain key
  if (domain && !hostname.includes("vercel")) {
    return domain; // Will be resolved via domain-map lookup
  }

  return null;
}

async function resolveTenantFromKV(key: string): Promise<string | null> {
  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) return null;

    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Vercel Edge: no caching, always fresh
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}

async function getTenantFromKV(slug: string): Promise<{
  slug: string;
  active: boolean;
  expiresAt: string;
} | null> {
  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) return null;

    const res = await fetch(`${url}/get/${encodeURIComponent(`tenant:${slug}`)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    const tenant = data.result;
    if (!tenant || typeof tenant !== "object") return null;

    return {
      slug: tenant.slug as string,
      active: tenant.active as boolean,
      expiresAt: (tenant.expiresAt as string) ?? "",
    };
  } catch {
    return null;
  }
}

function isExpired(expiresAt: string): boolean {
  if (!expiresAt) return false; // Empty = never expires
  return new Date(expiresAt) < new Date();
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow admin, API, static assets, and system pages through without tenant logic
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

  const slugOrDomain = getTenantSlug(req);
  if (!slugOrDomain) return NextResponse.next();

  let slug = slugOrDomain;

  // Resolve custom domain → slug mapping
  if (!slugOrDomain.includes("-") && !slugOrDomain.includes("_")) {
    const mappedSlug = await resolveTenantFromKV(`domain-map:${slugOrDomain.toLowerCase()}`);
    if (mappedSlug) slug = mappedSlug;
  }

  // Skip if slug looks like a path slug on a main domain with reserved suffix
  // (already handled by RESERVED_PATHS check above)

  // Fetch tenant metadata from KV
  const tenantMeta = await getTenantFromKV(slug);
  if (!tenantMeta) {
    // Unknown tenant slug — let Next.js render a 404 via the page
    return NextResponse.next();
  }

  if (!tenantMeta.active) {
    return NextResponse.redirect(new URL("/expired", req.url));
  }

  if (isExpired(tenantMeta.expiresAt)) {
    const expiredUrl = new URL(`/expired?slug=${encodeURIComponent(slug)}`, req.url);
    return NextResponse.redirect(expiredUrl);
  }

  // Inject tenant slug into request headers for downstream use
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-slug", slug);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
