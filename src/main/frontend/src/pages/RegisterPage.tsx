import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await register(username, password);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-6 px-4 py-10 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-gray-100">Register</h1>
          <p className="mt-2 text-gray-300">
            Create your account to start training.
          </p>
        </div>
        <div className="flex w-full justify-center">
          <form
            className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6 text-left"
            onSubmit={handleSubmit}
          >
            <label className="text-sm text-gray-300">
              Username
              <input
                className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 focus:border-red-700 focus:outline-none"
                type="text"
                name="username"
                placeholder="Create a username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label className="text-sm text-gray-300">
              Password
              <input
                className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 focus:border-red-700 focus:outline-none"
                type="password"
                name="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button
              className="rounded bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              type="submit"
            >
              Create account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
