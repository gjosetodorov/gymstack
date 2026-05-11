export type AuthUser = {
  username: string;
  role: "ADMIN" | "USER";
};

type AuthRequest = {
  username: string;
  password: string;
};

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:9999";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as { message?: string } | null;
      throw new Error(data?.message || "Request failed");
    }

    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const authApi = {
  login: (payload: AuthRequest) =>
    request<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: AuthRequest) =>
    request<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request<void>("/api/auth/logout", {
      method: "POST",
    }),
  me: () => request<AuthUser>("/api/auth/me"),
};
