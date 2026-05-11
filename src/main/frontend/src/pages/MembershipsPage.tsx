import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { applicationsApi, MemberApplication } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import { Member, MembershipType, membersApi } from "../api/members";

const membershipOptions: MembershipType[] = ["MONTHLY", "ANNUAL", "STUDENT"];
const pageSize = 10;

const formatDateEu = (value?: string) => {
  if (!value) {
    return "-";
  }
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${day}/${month}/${year}`;
};

const formatDateTimeEu = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const emptyMember: Member = {
  name: "",
  surname: "",
  address: "",
  joinDate: "",
  expiryDate: "",
  membershipType: "MONTHLY",
  active: true,
};

export default function MembershipsPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [form, setForm] = useState<Member>(emptyMember);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [error, setError] = useState("");
  const [applicationsError, setApplicationsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const isAdmin = user?.role === "ADMIN";
  const formTitle = useMemo(() => (editingId ? "Edit member" : "Add member"), [editingId]);

  const filteredMembers = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    const sorted = [...members].sort((a, b) => {
      const left = `${a.name ?? ""} ${a.surname ?? ""}`.trim().toLowerCase();
      const right = `${b.name ?? ""} ${b.surname ?? ""}`.trim().toLowerCase();
      return left.localeCompare(right);
    });

    if (!needle) {
      return sorted;
    }

    return sorted.filter((member) => {
      const fullName = `${member.name ?? ""} ${member.surname ?? ""}`.trim().toLowerCase();
      const address = (member.address ?? "").toLowerCase();
      const membership = (member.membershipType ?? "").toLowerCase();
      return fullName.includes(needle) || address.includes(needle) || membership.includes(needle);
    });
  }, [members, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const pagedMembers = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, page, totalPages]);

  const pendingApplications = useMemo(
    () => applications.filter((application) => application.status === "PENDING"),
    [applications]
  );

  const loadMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await membersApi.list();
      setMembers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load members";
      setError(message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);
    setApplicationsError("");
    try {
      const data = await applicationsApi.list();
      setApplications(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load applications";
      setApplicationsError(message || "Failed to load applications");
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      void loadMembers();
      void loadApplications();
    } else {
      setLoading(false);
      setLoadingApplications(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const updateField = (field: keyof Member, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyMember);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await membersApi.update(editingId, form);
      } else {
        await membersApi.create(form);
      }
      await loadMembers();
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save member";
      setError(message || "Failed to save member");
    }
  };

  const handleEdit = (member: Member) => {
    if (!member.id) {
      return;
    }
    setEditingId(member.id);
    setForm({
      name: member.name ?? "",
      surname: member.surname ?? "",
      address: member.address ?? "",
      joinDate: member.joinDate ?? "",
      expiryDate: member.expiryDate ?? "",
      membershipType: member.membershipType ?? "MONTHLY",
      active: member.active ?? false,
    });
  };

  const handleDelete = async (memberId?: number) => {
    if (!memberId) {
      return;
    }

    const confirmed = window.confirm("Delete this member? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setError("");
    try {
      await membersApi.remove(memberId);
      await loadMembers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete member";
      setError(message || "Failed to delete member");
    }
  };

  const handleApprove = async (applicationId: number) => {
    setApplicationsError("");
    try {
      await applicationsApi.approve(applicationId);
      await Promise.all([loadMembers(), loadApplications()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to approve application";
      setApplicationsError(message || "Failed to approve application");
    }
  };

  const handleReject = async (applicationId: number) => {
    const confirmed = window.confirm("Reject this application?");
    if (!confirmed) {
      return;
    }

    setApplicationsError("");
    try {
      await applicationsApi.reject(applicationId);
      await loadApplications();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reject application";
      setApplicationsError(message || "Failed to reject application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 pb-24">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Memberships</h1>
          <p className="text-sm text-gray-300">
            Manage members, update memberships, and keep track of active plans.
          </p>
        </div>

        {!isAdmin ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-6">
            <p className="text-sm text-gray-200">Only admins can manage memberships.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/60">
              <div className="flex flex-col gap-2 border-b border-gray-800 px-4 py-3">
                <h2 className="text-lg font-semibold text-gray-100">Requested memberships</h2>
                <p className="text-xs text-gray-400">
                  Review pending applications before creating memberships.
                </p>
              </div>
              {loadingApplications ? (
                <div className="px-4 py-6 text-sm text-gray-300">Loading applications...</div>
              ) : pendingApplications.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-300">No pending applications.</div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-200">
                    <thead className="bg-gray-900/80 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Applicant</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Document</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApplications.map((application) => (
                        <tr key={application.id} className="border-t border-gray-800">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-100">
                              {application.name} {application.surname}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300">{application.address}</td>
                          <td className="px-4 py-3 text-xs text-gray-300">
                            {application.membershipType}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300">
                            {formatDateTimeEu(application.createdAt ?? undefined)}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300">
                            {application.documentName ? (
                              <a
                                className="text-red-400 hover:text-red-300"
                                href={applicationsApi.documentUrl(application.id)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {application.documentName}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                className="rounded border border-gray-700 px-3 py-1 text-xs text-gray-200 hover:border-gray-600 hover:bg-gray-900"
                                onClick={() => handleReject(application.id)}
                                type="button"
                              >
                                Reject
                              </button>
                              <button
                                className="rounded bg-red-800 px-3 py-1 text-xs text-white hover:bg-red-700"
                                onClick={() => handleApprove(application.id)}
                                type="button"
                              >
                                Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {applicationsError ? (
                <div className="border-t border-gray-800 px-4 py-3 text-xs text-red-400">
                  {applicationsError}
                </div>
              ) : null}
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <form
                className="flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-100">{formTitle}</h2>
                  <p className="text-xs text-gray-400">Fill in all member details.</p>
                </div>
                <label className="text-xs text-gray-300">
                  First name
                  <input
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                  />
                </label>
                <label className="text-xs text-gray-300">
                  Surname
                  <input
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    type="text"
                    value={form.surname}
                    onChange={(event) => updateField("surname", event.target.value)}
                    required
                  />
                </label>
                <label className="text-xs text-gray-300">
                  Address
                  <input
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    type="text"
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    required
                  />
                </label>
                <label className="text-xs text-gray-300">
                  Join date
                  <input
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    type="date"
                    value={form.joinDate}
                    onChange={(event) => updateField("joinDate", event.target.value)}
                  />
                </label>
                <label className="text-xs text-gray-300">
                  Expiry date
                  <input
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    type="date"
                    value={form.expiryDate}
                    onChange={(event) => updateField("expiryDate", event.target.value)}
                  />
                </label>
                <label className="text-xs text-gray-300">
                  Membership type
                  <select
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                    value={form.membershipType}
                    onChange={(event) => updateField("membershipType", event.target.value)}
                  >
                    {membershipOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    className="h-4 w-4 rounded border border-gray-700 bg-gray-950"
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) => updateField("active", event.target.checked)}
                  />
                  Active membership
                </label>
                {error ? <p className="text-xs text-red-400">{error}</p> : null}
                <div className="flex gap-2">
                  <button
                    className="flex-1 rounded bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    type="submit"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  {editingId ? (
                    <button
                      className="flex-1 rounded border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:border-gray-600 hover:bg-gray-900"
                      onClick={resetForm}
                      type="button"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/60">
                <div className="flex flex-col gap-4 border-b border-gray-800 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100">Members</h2>
                    <p className="text-xs text-gray-400">Total: {filteredMembers.length}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      className="w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-xs text-gray-100 md:w-64"
                      type="search"
                      placeholder="Search by name, address, or type"
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value);
                        setPage(1);
                      }}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      Page {page} of {totalPages}
                    </div>
                  </div>
                </div>
                {loading ? (
                  <div className="px-4 py-6 text-sm text-gray-300">Loading members...</div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-200">
                      <thead className="bg-gray-900/80 text-xs uppercase text-gray-400">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Address</th>
                          <th className="px-4 py-3">Membership</th>
                          <th className="px-4 py-3">Active</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedMembers.map((member) => (
                          <tr key={member.id} className="border-t border-gray-800">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-100">
                                {member.name} {member.surname}
                              </div>
                              <div className="text-xs text-gray-400">
                                Joined: {formatDateEu(member.joinDate)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-300">{member.address}</td>
                            <td className="px-4 py-3 text-xs text-gray-300">
                              {member.membershipType}
                              <div className="text-[11px] text-gray-500">
                                Expires: {formatDateEu(member.expiryDate)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-300">
                              {member.active ? "Yes" : "No"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="rounded border border-gray-700 px-3 py-1 text-xs text-gray-200 hover:border-gray-600 hover:bg-gray-900"
                                  onClick={() => handleEdit(member)}
                                  type="button"
                                >
                                  Edit
                                </button>
                                <button
                                  className="rounded bg-red-800 px-3 py-1 text-xs text-white hover:bg-red-700"
                                  onClick={() => handleDelete(member.id)}
                                  type="button"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {pagedMembers.length === 0 ? (
                          <tr>
                            <td className="px-4 py-6 text-center text-sm text-gray-400" colSpan={5}>
                              No members found yet.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                )}
                {!loading && filteredMembers.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 px-4 py-3 text-xs text-gray-300">
                    <span>
                      Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredMembers.length)} of{" "}
                      {filteredMembers.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded border border-gray-700 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setPage(1)}
                        type="button"
                        disabled={page === 1}
                      >
                        First
                      </button>
                      <button
                        className="rounded border border-gray-700 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        type="button"
                        disabled={page === 1}
                      >
                        Prev
                      </button>
                      <button
                        className="rounded border border-gray-700 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        type="button"
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                      <button
                        className="rounded border border-gray-700 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setPage(totalPages)}
                        type="button"
                        disabled={page === totalPages}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

