import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { applicationsApi } from "../api/applications";
import { MembershipType } from "../api/members";
import { useAuth } from "../context/AuthContext";

const membershipOptions: MembershipType[] = ["MONTHLY", "ANNUAL", "STUDENT"];
const MAX_STUDENT_PDF_MB = 5;
const MAX_STUDENT_PDF_BYTES = MAX_STUDENT_PDF_MB * 1024 * 1024;

export default function MembershipApplyPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [membershipType, setMembershipType] = useState<MembershipType>("MONTHLY");
  const [document, setDocument] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const defaultType = useMemo<MembershipType>(() => {
    const typeParam = searchParams.get("type")?.toUpperCase();
    if (typeParam && membershipOptions.includes(typeParam as MembershipType)) {
      return typeParam as MembershipType;
    }
    return "MONTHLY";
  }, [searchParams]);

  useEffect(() => {
    setMembershipType(defaultType);
  }, [defaultType]);

  const needsDocument = useMemo(() => membershipType === "STUDENT", [membershipType]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (needsDocument && !document) {
      setError("Please attach your student document.");
      return;
    }

    if (document && !document.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (document && document.size > MAX_STUDENT_PDF_BYTES) {
      setError(`Upload too large. Max size is ${MAX_STUDENT_PDF_MB}MB.`);
      return;
    }

    try {
      await applicationsApi.apply({
        name,
        surname,
        address,
        membershipType,
        document,
      });
      setSuccess("Application sent. We will contact you soon.");
      setName("");
      setSurname("");
      setAddress("");
      setMembershipType(defaultType);
      setDocument(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to apply";
      setError(message || "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-6 px-4 py-10 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-gray-100">Membership application</h1>
          <p className="mt-2 text-gray-300">Tell us a bit about you to get started.</p>
        </div>
        {!user ? (
          <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900/60 p-6 text-left">
            <p className="text-sm text-gray-200">
              Please register or sign in before applying for a membership.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                className="flex-1 rounded border border-gray-700 px-4 py-2 text-center text-sm font-medium text-gray-200 hover:border-gray-600 hover:bg-gray-900"
                to="/login"
              >
                Sign in
              </Link>
              <Link
                className="flex-1 rounded bg-red-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
                to="/register"
              >
                Register
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <form
              className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6 text-left"
              onSubmit={handleSubmit}
            >
              <label className="text-sm text-gray-300">
                First name
                <input
                  className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 focus:border-red-700 focus:outline-none"
                  type="text"
                  name="name"
                  placeholder="Your first name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm text-gray-300">
                Surname
                <input
                  className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 focus:border-red-700 focus:outline-none"
                  type="text"
                  name="surname"
                  placeholder="Your surname"
                  value={surname}
                  onChange={(event) => setSurname(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm text-gray-300">
                Address
                <input
                  className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 focus:border-red-700 focus:outline-none"
                  type="text"
                  name="address"
                  placeholder="Street and city"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm text-gray-300">
                Membership type
                <select
                  className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 focus:border-red-700 focus:outline-none"
                  value={membershipType}
                  onChange={(event) => setMembershipType(event.target.value as MembershipType)}
                >
                  {membershipOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {needsDocument ? (
                <label className="text-sm text-gray-300">
                  Student document
                  <input
                    className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 file:mr-3 file:rounded file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-xs file:text-gray-100"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      if (file && !file.name.toLowerCase().endsWith(".pdf")) {
                        setError("Only PDF files are allowed.");
                        setDocument(null);
                        event.target.value = "";
                        return;
                      }
                      if (file && file.size > MAX_STUDENT_PDF_BYTES) {
                        setError(`Upload too large. Max size is ${MAX_STUDENT_PDF_MB}MB.`);
                        setDocument(null);
                        event.target.value = "";
                        return;
                      }
                      setDocument(file);
                    }}
                    required
                  />
                </label>
              ) : null}
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              {success ? <p className="text-sm text-green-400">{success}</p> : null}
              <button
                className="rounded bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                type="submit"
              >
                Submit application
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
