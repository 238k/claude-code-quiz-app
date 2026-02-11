import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { QuizStoreProvider } from "@/context/QuizStoreContext";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "スワイプクイズ",
  description: "スワイプ操作で楽しむクイズアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} antialiased`}>
        <QuizStoreProvider>{children}</QuizStoreProvider>
      </body>
    </html>
  );
}
