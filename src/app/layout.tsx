import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horang",
  description: "Unofficial helper for your first trip from Incheon Airport to Seoul Station.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
