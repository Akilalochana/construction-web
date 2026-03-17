"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

type ApiPayload = {
	message?: string;
	validations?: Record<string, string>;
};

export default function AdminLoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [checkingSession, setCheckingSession] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const checkSession = async () => {
			try {
				const res = await fetch("/api/admin/auth/me", {
					method: "GET",
					credentials: "include",
					cache: "no-store",
				});

				if (res.ok) {
					router.replace("/sri-admin-2003"); 
					return;
				}
			} finally {
				setCheckingSession(false);
			}
		};

		checkSession();
	}, [router]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/admin/auth/login", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const payload = (await res.json()) as ApiPayload;

			if (!res.ok) {
				setError(payload.message ?? "Login failed.");
				return;
			}

			router.replace("/sri-admin-2003");
		} catch {
			setError("Network error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (checkingSession) {
		return (
			<div className="min-h-screen bg-[hsl(220,25%,97%)] flex items-center justify-center px-4">
				<div className="bg-white border border-border rounded-2xl p-8 text-sm text-muted-foreground shadow-sm">
					Checking session...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[hsl(220,25%,97%)] px-4 py-8 sm:py-12 flex items-center justify-center">
			<div className="w-full max-w-md bg-white border border-border rounded-3xl shadow-lg p-6 sm:p-8">
				<div className="text-center mb-7">
					<div className="w-14 h-14 mx-auto rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
						<ShieldCheck size={24} />
					</div>
					<h1 className="font-heading text-2xl font-bold text-foreground">Admin Portal</h1>
					<p className="text-sm text-muted-foreground mt-1">Sign in to continue to dashboard</p>
				</div>

				{error && (
					<div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Email
						</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@example.com"
								className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
								disabled={loading}
								required
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Password
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full h-11 pl-10 pr-11 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
								disabled={loading}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								disabled={loading}
								aria-label="Toggle password"
							>
								{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
}
