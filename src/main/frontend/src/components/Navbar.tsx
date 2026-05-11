import React from "react";
import type { IconType } from "react-icons";
import { FaCoins, FaDumbbell, FaEnvelope, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/#top" },
  { label: "Programs", href: "/#programs" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderIcon = (label: string) => {
    const iconMap: Record<string, IconType> = {
      Home: FaHome,
      Programs: FaDumbbell,
      Pricing: FaCoins,
      Contact: FaEnvelope,
    };
    const Icon = iconMap[label];
    if (!Icon) {
      return null;
    }
    return (
      <span aria-hidden="true" className="text-base">
        {Icon({ className: "h-5 w-5" })}
      </span>
    );
  };

  return (
    <>
      <header className="border-b border-gray-800 bg-gray-950">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a className="text-lg font-russo font-bold text-gray-100" href="/#top">
            Gym<span className="text-red-700">Stack</span>
          </a>
          <div className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="text-sm font-medium text-gray-300 hover:text-red-700"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-300">
                  Welcome back,{" "}
                  <span className="text-gray-100">{user.username}</span>
                </span>
                {user.role === "ADMIN" ? (
                  <Link
                    className="rounded border border-red-700 px-3 py-1.5 text-sm font-medium text-gray-100 hover:border-red-600 hover:bg-red-900/30"
                    to="/memberships"
                  >
                    Manage Memberships
                  </Link>
                ) : null}
                <button
                  className="rounded bg-red-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="rounded border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-200 hover:border-gray-600 hover:bg-gray-900"
                  to="/login"
                >
                  Log in
                </Link>
                <Link
                  className="rounded bg-red-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="flex flex-col items-center gap-1 text-xs text-gray-300 hover:text-red-700"
              href={item.href}
              aria-label={item.label}
            >
              <span className="text-base">{renderIcon(item.label)}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
