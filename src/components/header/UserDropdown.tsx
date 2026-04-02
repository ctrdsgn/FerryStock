"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { signOut, getCurrentUser } from "@/actions/auth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Get display name from user metadata
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
  const email = user?.email || "admin@onstock.local";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
          <Image
            width={40}
            height={40}
            src="/images/user/owner.jpg"
            alt="User"
            className="h-full w-full object-cover"
          />
        </span>

        <div className="text-left">
          <span className="block text-sm font-bold text-gray-800 dark:text-white">
            {loading ? "Loading..." : displayName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            Administrator
          </span>
        </div>

        <svg
          className={`ml-2 stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-4 border-b border-gray-100 pb-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="overflow-hidden rounded-full h-12 w-12 ring-2 ring-brand-500/20">
              <Image
                width={48}
                height={48}
                src="/images/user/owner.jpg"
                alt="User"
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <span className="block font-bold text-gray-800 dark:text-white">
                {loading ? "Loading..." : displayName}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {email}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-error-50 hover:text-error-600 dark:text-gray-300 dark:hover:bg-error-900/20 dark:hover:text-error-400"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Keluar
            </button>
          </form>
        </div>
      </Dropdown>
    </div>
  );
}
