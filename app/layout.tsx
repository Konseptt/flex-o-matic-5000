import type { Metadata } from "next";
import {
  Archivo_Black,
  Rubik_Mono_One,
  Space_Mono,
  VT323,
} from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const rubikMonoOne = Rubik_Mono_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-mono-one",
});

const description =
  "Paste your project or README. Get three short LinkedIn-ready posts: technical, storytime, and lessons, tuned to sound human.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "FLEX-O-MATIC 5000 :: POST FORGE",
    template: "%s · FLEX-O-MATIC",
  },
  description,
  applicationName: "FLEX-O-MATIC 5000",
  authors: [{ name: "FLEX-O-MATIC" }],
  openGraph: {
    title: "FLEX-O-MATIC 5000 :: POST FORGE",
    description,
    type: "website",
    locale: "en_US",
    siteName: "FLEX-O-MATIC 5000",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FLEX-O-MATIC 5000 :: POST FORGE",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${vt323.variable} ${spaceMono.variable} ${rubikMonoOne.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
