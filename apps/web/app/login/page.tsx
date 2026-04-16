"use client"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/image/logo.png"
              alt="EXO Logo"
              width={80}
              height={28}
              className="object-contain"
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right — decorative panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#024F42] to-[#013830] lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/image/logo.png"
            alt="EXO Logo"
            width={140}
            height={48}
            className="mx-auto mb-8 object-contain brightness-0 invert"
          />
          <h2 className="text-2xl font-bold text-white">
            Customer Relationship<br />Management
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Manage your customers, track activity,<br />and grow your business.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
      </div>
    </div>
  )
}
