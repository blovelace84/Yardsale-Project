"use client";

import Link from "next/link";
import { useState } from "react";
import { goeyToast as toast } from "goey-toast";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      toast.error(result?.error ?? "Could not create account");
    } else {
      toast.success("Account created 🎉");
      window.location.href = "/login";
    }

    setLoading(false);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            required
          />

          <button className="w-full bg-black text-white py-2 rounded">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-black underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
