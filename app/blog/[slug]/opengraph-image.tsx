import { getArticle } from "@/lib/content/articles";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Статья блога о покупке нового автомобиля";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return renderOgImage({
    title: a?.title ?? "Блог о покупке новых автомобилей",
    subtitle: a?.description,
    eyebrow: "Блог · Новые автомобили в Кыргызстане",
  });
}
