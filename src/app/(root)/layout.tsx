import "../globals.css";

// "/" 전용 루트 레이아웃. 정적 export라 서버 리다이렉트가 없어서 page에서 언어를 고른다.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
