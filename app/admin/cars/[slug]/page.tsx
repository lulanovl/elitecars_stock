import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getCars } from "@/lib/cars-store";
import { logout } from "../../actions";
import { AdminHeader } from "../../AdminHeader";
import { CarForm } from "../CarForm";

export const metadata: Metadata = { title: "Редактирование" };

export default async function EditCarPage({ params }: PageProps<"/admin/cars/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const car = (await getCars()).find((c) => c.slug === decodeURIComponent(slug));
  if (!car) notFound();
  return (
    <>
      <AdminHeader logoutAction={logout} />
      <CarForm title={`${car.brand} ${car.model}`} car={car} />
    </>
  );
}
