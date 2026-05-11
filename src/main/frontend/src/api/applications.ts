import { MembershipType } from "./members";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type MemberApplication = {
  id: number;
  name: string;
  surname: string;
  address: string;
  membershipType: MembershipType;
  documentName?: string | null;
  status: ApplicationStatus;
  createdAt?: string | null;
};

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:9999";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...(options ?? {}),
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

export const applicationsApi = {
  list: () =>
    request<MemberApplication[]>("/api/applications", {
      headers: { "Content-Type": "application/json" },
    }),
  apply: (payload: {
    name: string;
    surname: string;
    address: string;
    membershipType: MembershipType;
    document?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("surname", payload.surname);
    formData.append("address", payload.address);
    formData.append("membershipType", payload.membershipType);
    if (payload.document) {
      formData.append("document", payload.document);
    }

    return request<MemberApplication>("/api/applications", {
      method: "POST",
      body: formData,
    });
  },
  approve: (id: number) =>
    request<MemberApplication>(`/api/applications/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),
  reject: (id: number) =>
    request<MemberApplication>(`/api/applications/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),
  documentUrl: (id: number) => `${API_BASE}/api/applications/${id}/document`,
};

