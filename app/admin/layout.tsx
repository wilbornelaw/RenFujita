import { requireAdminUser } from "@/lib/admin";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return <AdminShell>{children}</AdminShell>;
}
