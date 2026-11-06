import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "../../actions";
import { AdminHeader } from "../../AdminHeader";
import { FeaturedForm } from "../FeaturedForm";

export const metadata: Metadata = { title: "Новый автомобиль" };

export default async function NewFeaturedPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader logoutAction={logout} />
      <FeaturedForm title="Новый автомобиль" />
    </>
  );
}
