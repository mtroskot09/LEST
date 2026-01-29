import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getCompanyId(): string | null {
  try {
    const stored = localStorage.getItem("lest_auth_user");
    if (stored) {
      const user = JSON.parse(stored);
      return user?.id || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const companyId = getCompanyId();
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (companyId) {
    headers["X-Company-ID"] = companyId;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
/**
 * Default query function for React Query
 * 
 * QueryKey structure:
 * - ["/api/path"] → GET /api/path
 * - ["/api/path", "value"] → GET /api/path?date=value
 * - ["/api/path", "seg1", "seg2"] → GET /api/path/seg1/seg2
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle query parameters properly
    let url: string;
    if (queryKey.length === 1) {
      url = queryKey[0] as string;
    } else if (queryKey.length === 2) {
      const [path, param] = queryKey;
      // Check if the path already has query params
      const separator = (path as string).includes('?') ? '&' : '?';
      url = `${path}${separator}date=${param}`;
    } else {
      url = queryKey.join("/") as string;
    }

    const companyId = getCompanyId();
    const headers: Record<string, string> = {};
    
    if (companyId) {
      headers["X-Company-ID"] = companyId;
    }

    const res = await fetch(url, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
