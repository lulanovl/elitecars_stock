import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getFeaturedCars } from "@/lib/featured";
import { logout } from "../../actions";
import { AdminHeader } from "../../AdminHeader";
import { FeaturedForm } from "../FeaturedForm";

export const metadata: Metadata = { title: "Редактирование" };

export default async function EditFeaturedPage({ params }: PageProps<"/admin/featured/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const car = (await getFeaturedCars()).find((c) => c.id === decodeURIComponent(id));
  if (!car) notFound();
  return (
    <>
      <AdminHeader logoutAction={logout} />
      <FeaturedForm title={`${car.brand} ${car.model}`} car={car} />
    </>
  );
}
