"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

 
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
  email: form.email,
  password: form.password,
});

login(response.data.user, response.data.token);

router.push("/");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Login Failed"
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

      {/* Heading */}

      <h1 className="mt-6 text-center text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-center text-slate-400">
        Login to continue building with FoundrAI.
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-5"
      >

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

          <div className="flex items-center rounded-xl border border-slate-700 bg-[#0A0A0A] px-4 focus-within:border-blue-500 transition">

            <Mail className="mr-3 h-5 w-5 text-slate-500" />

            <input
              type="email"
              placeholder="Email Address"
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

          <div className="flex items-center rounded-xl border border-slate-700 bg-[#0A0A0A] px-4 focus-within:border-blue-500 transition">

            <Lock className="mr-3 h-5 w-5 text-slate-500" />

            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Password"
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
                {/* Remember Me + Forgot Password */}

        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-slate-400">

            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
            />

            Remember me

          </label>

          <Link
            href="/forgot-password"
            className="text-blue-500 hover:text-blue-400"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
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

      {/* Google Button */}
      

      {/* Google Button */}

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
/>
      {/* Signup */}

      <p className="mt-8 text-center text-slate-400">

        Don't have an account?

        <Link
          href="/signup"
          className="ml-2 font-semibold text-blue-500 hover:text-blue-400"
        >
          Signup
        </Link>

      </p>

    </div>
  );
}