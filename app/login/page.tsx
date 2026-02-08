import { loginAction } from "@/app/auth-actions";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next ?? "/admin";
  const hasError = params.error === "invalid_credentials" || params.error === "missing_credentials";

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#171b24] p-7 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Owner Access</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-1 text-sm text-muted">Email/password authentication for owner account only.</p>
      {hasError && <p className="mt-3 rounded-xl border border-red-300/20 bg-red-500/10 p-2 text-sm text-red-300">Invalid email or password.</p>}
      <form action={loginAction} className="mt-5 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="email" type="email" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="password" type="password" required />
        </div>
        <button
          className="w-full rounded-xl bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] px-4 py-2.5 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:brightness-110 active:scale-[0.98]"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
