import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "../../actions";
import { AdminHeader } from "../../AdminHeader";
import { CarForm } from "../CarForm";

export const metadata: Metadata = { title: "Новый автомобиль" };

export default async function NewCarPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader logoutAction={logout} />
      <CarForm title="Новый автомобиль" />
    </>
  );
}
