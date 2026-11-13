import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Подбор автомобилей из Кыргызстана без посредников";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    title: "Подбор автомобилей из Кыргызстана без посредников",
    subtitle: "Поиск по дилерам и импортёрам, проверка перед покупкой, торг и оформление. Передача в Бишкеке или доставка по ЕАЭС.",
  });
}
