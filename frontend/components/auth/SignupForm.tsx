"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
} from "lucide-react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

  const response = await api.post("/auth/signup", {
  name: form.name,
  email: form.email,
  password: form.password,
});

// Update Auth Context
login(response.data.user, response.data.token);

alert("Account created successfully!");

setForm({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Redirect Home
router.push("/");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-[0_0_40px_rgba(37,99,235,0.15)]">

      {/* Logo */}

      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="FoundrAI"
          width={60}
          height={60}
        />
      </div>

      <h1 className="mt-6 text-center text-3xl font-bold text-white">
        Create Account
      </h1>

      <p className="mt-2 text-center text-slate-400">
        Turn your startup idea into reality with AI.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        {/* Name */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Full Name
          </label>

          <div className="flex items-center rounded-xl border border-slate-700 bg-[#0A0A0A] px-4 focus-within:border-blue-500">

            <User className="mr-3 h-5 w-5 text-slate-500" />

            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />

          </div>
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

          <div className="flex items-center rounded-xl border border-slate-700 bg-[#0A0A0A] px-4 focus-within:border-blue-500">

            <Mail className="mr-3 h-5 w-5 text-slate-500" />

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />

          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Password
          </label>

          <div className="flex items-center rounded-xl border border-slate-700 bg-[#0A0A0A] px-4 focus-within:border-blue-500">

            <Lock className="mr-3 h-5 w-5 text-slate-500" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-400" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400" />
              )}
            </button>

          </div>
        </div>

        {/* Confirm Password */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Confirm Password
          </label>

          <div className="flex items-center rounded-xl border border-slate-700 bg-[#0A0A0A] px-4 focus-within:border-blue-500">

            <Lock className="mr-3 h-5 w-5 text-slate-500" />

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeOff className="h-5 w-5 text-slate-400" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400" />
              )}
            </button>

          </div>
        </div>

        {/* Terms */}

        <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">

          <input
            type="checkbox"
            className="h-4 w-4 rounded accent-blue-600"
          />

          I agree to the Terms & Privacy Policy

        </label>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account →"}
        </button>

      </form>

      {/* Divider */}

      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-slate-700"></div>

        <span className="mx-4 text-sm text-slate-500">
          OR CONTINUE WITH
        </span>

        <div className="h-px flex-1 bg-slate-700"></div>
      </div>

      <div className="space-y-4">

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await api.post("/auth/google", {
                  credential: credentialResponse.credential,
                });

                localStorage.setItem("token", res.data.token);
                localStorage.setItem(
                  "user",
                  JSON.stringify(res.data.user)
                );

                router.push("/");
              } catch (error) {
                console.error(error);
                alert("Google Login Failed");
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#0A0A0A] text-white transition hover:border-blue-500 hover:bg-slate-900"
        >
          GitHub
        </button>

      </div>

      <p className="mt-8 text-center text-slate-400">

        Already have an account?

        <Link
          href="/login"
          className="ml-2 font-semibold text-blue-500 hover:text-blue-400"
        >
          Login
        </Link>

      </p>

    </div>
  );
}