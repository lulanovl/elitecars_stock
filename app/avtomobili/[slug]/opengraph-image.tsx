import { formatRange, getCar } from "@/lib/content/cars";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Новый автомобиль в Кыргызстане";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCar(slug);
  return renderOgImage({
    title: c ? `Новый ${c.brand} ${c.model}` : "Новые автомобили в Кыргызстане",
    subtitle: c ? `${c.segment} · в Бишкеке ${formatRange(c.price)}` : undefined,
    eyebrow: "Каталог · новые автомобили в Кыргызстане",
    photo: c?.image,
  });
}
