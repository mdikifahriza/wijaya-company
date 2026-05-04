"use client";

import { useActionState, useState } from "react";

import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

function EyeOpenIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-5.4" />
      <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a18.6 18.6 0 0 1-3.1 3.8" />
      <path d="M6.6 6.7A18.4 18.4 0 0 0 2 12s3.6 7 10 7a10.7 10.7 0 0 0 5-1.2" />
    </svg>
  );
}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="grid gap-6">
      <input type="hidden" name="from" value={from} />

      <label className="grid gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#69734f]">
          Username
        </span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          className="h-12 w-full border-b border-gray-300 bg-transparent px-1 text-[15px] text-[#60684f] outline-none transition-colors focus:border-[#69734f]"
          placeholder="Enter your username"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#69734f]">
          Password
        </span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            className="h-12 w-full border-b border-gray-300 bg-transparent px-1 pr-10 text-[15px] text-[#60684f] outline-none transition-colors focus:border-[#69734f]"
            placeholder="Enter your password"
          />
          <button
            type="button"
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 my-auto inline-flex h-9 w-9 items-center justify-center text-gray-400 hover:text-[#69734f] transition-colors"
          >
            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        </div>
      </label>

      {state.error ? (
        <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#69734f] px-6 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#50593b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Login to Dashboard"}
      </button>
    </form>
  );
}
