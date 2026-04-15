/**
 * Base URL for the NestJS backend.
 * Only available server-side (Next.js API routes / Server Components).
 */
export const NEST_API_URL =
  process.env["NEST_API_URL"] ?? "http://localhost:4000/api";

/**
 * Thin fetch wrapper that prefixes every request with the NestJS base URL
 * and forwards status + body as-is to the caller.
 */
export async function nestFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = `${NEST_API_URL}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}
