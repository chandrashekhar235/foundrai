"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];


export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Replace this later with authenticated user
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
  logout();
  setOpen(false);
  router.push("/");
};
<button
  onClick={handleLogout}
  className="text-sm text-red-400 hover:text-red-300"
>
  Logout
</button>
  
  // Example after login:
  // const user = {
  //   name: "Sahil",
  //   avatar: "",
  // };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/40 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/foundrai-logo.svg"
            alt="FoundrAI"
            width={140}
            height={46}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 transition duration-300 hover:text-white
              after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0
              after:bg-blue-500 after:transition-all after:duration-300
              hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-5 md:flex">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-sm font-medium text-blue-500 hover:text-blue-400 transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <button className="flex items-center gap-3 rounded-full border border-zinc-700 px-3 py-2 hover:border-blue-500 transition">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={34}
                  height={34}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User size={18} />
                </div>
              )}

              <span className="text-sm font-medium text-white">
                {user.name}
              </span>
            </button>
            
          )}
          <button
  onClick={handleLogout}
  className="text-sm text-red-400 hover:text-red-300"
>
  Logout
</button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-zinc-300 hover:text-white"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-zinc-800 bg-black/90 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5 px-6 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-zinc-300 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}

            <hr className="border-zinc-800" />

            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-zinc-300 hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-blue-500 font-medium hover:text-blue-400 transition"
                >
                  Signup
                </Link>
                
              </>
              
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User size={18} />
                </div>

                <span className="text-white">{user.name}</span>
              </div>
              
            )}
          </div>
        </div>
      )}
    </header>
  );
}