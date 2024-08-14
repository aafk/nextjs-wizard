import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import connectMongo from "@/utils/connect-mongo";
import Providers from "@/ui/ProgressBarProvider";
import ThemeModeSelector from "@/ui/ModeSelector";
import ThemeModeProvider from "@/ui/theme-mode-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | Wizard",
    default: "Wizard",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectMongo();
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ThemeModeProvider>
          <Providers>{children}</Providers>
          <ThemeModeSelector />
        </ThemeModeProvider>
      </body>
    </html>
  );
}
