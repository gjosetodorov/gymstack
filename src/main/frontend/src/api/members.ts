export type MembershipType = "MONTHLY" | "ANNUAL" | "STUDENT";

export type Member = {
  id?: number;
  name: string;
  surname: string;
  address: string;
  joinDate: string;
  expiryDate: string;
  membershipType: MembershipType;
  active: boolean;
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

export const membersApi = {
  list: () => request<Member[]>("/api/members"),
  create: (payload: Member) =>
    request<Member>("/api/members", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: Member) =>
    request<Member>(`/api/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    request<void>(`/api/members/${id}`, {
      method: "DELETE",
    }),
  apply: (payload: Member) =>
    request<Member>("/api/member", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
