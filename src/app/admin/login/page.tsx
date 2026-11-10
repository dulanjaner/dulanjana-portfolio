"use client";

import {
    Suspense,
    useState,
    type FormEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    LockKeyhole,
    Mail,
    LoaderCircle,
    Eye,
    EyeOff,
} from "lucide-react";

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const supabase = createClient();

            if (!supabase) {
                setError(
                    "Authentication is not configured. Please check your environment settings."
                );
                return;
            }

            // Step 1: Authenticate with Supabase
            const {
                data: authData,
                error: authError,
            } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError || !authData.user) {
                console.error("[Admin Login] Authentication failed:", {
                    message: authError?.message,
                    status: authError?.status,
                    code: authError?.code,
                });

                setError(
                    authError?.message ||
                    "Authentication failed. Please try again."
                );
                return;
            }

            // Step 2: Verify that the authenticated user is an administrator
            const {
                data: adminRecord,
                error: adminError,
            } = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", authData.user.id)
                .maybeSingle();

            if (adminError) {
                console.error(
                    "[Admin Login] Admin authorization check failed:",
                    adminError.message
                );

                await supabase.auth.signOut();

                setError(
                    "Unable to verify administrator access. Please try again."
                );
                return;
            }

            if (!adminRecord) {
                await supabase.auth.signOut();

                setError(
                    "This account is not authorized to access the admin dashboard."
                );
                return;
            }

            console.info("[Admin Login] Authentication successful.");

            // Step 3: Redirect after successful authentication and authorization
            const requestedPath = searchParams.get("redirectTo");

            const destination =
                requestedPath?.startsWith("/") &&
                    !requestedPath.startsWith("//") &&
                    requestedPath !== "/admin/login" &&
                    !requestedPath.startsWith("/admin/login?") &&
                    !requestedPath.startsWith("/admin/login#")
                    ? requestedPath
                    : "/admin";

            router.replace(destination);
            router.refresh();
        } catch (err: unknown) {
            console.error(
                "[Admin Login] Unexpected error:",
                err instanceof Error ? err.message : "Unknown error"
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.10),transparent_45%)]" />

            <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
                {/* Icon */}
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-400">
                    <LockKeyhole size={27} aria-hidden="true" />
                </div>

                {/* Heading */}
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                    Portfolio Management
                </p>

                <h1 className="text-3xl font-bold tracking-tight">
                    Admin Login
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Sign in with your authorized administrator account to
                    manage your portfolio.
                </p>

                {/* Login form */}
                <form onSubmit={handleLogin} className="mt-8 space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                size={18}
                                aria-hidden="true"
                            />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="admin@example.com"
                                disabled={loading}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                disabled={loading}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-4 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            {/* Show / Hide password */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showPassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                            >
                                {showPassword ? (
                                    <EyeOff
                                        size={18}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Eye
                                        size={18}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <p
                            role="alert"
                            aria-live="polite"
                            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                                aria-hidden="true"
                            />
                        )}

                        {loading ? "Signing in..." : "Sign in securely"}
                    </button>
                </form>

                {/* Return to portfolio */}
                <Link
                    href="/"
                    className="mt-7 block text-center text-sm text-slate-400 transition hover:text-sky-400"
                >
                    ← Back to portfolio
                </Link>
            </section>
        </main>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
                    <LoaderCircle
                        size={28}
                        className="animate-spin text-sky-400"
                        aria-label="Loading login page"
                    />
                </main>
            }
        >
            <AdminLoginForm />
        </Suspense>
    );
}