import 'bootstrap/dist/css/bootstrap.css'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from '@/context/authContext';
import { SocketContextProvider } from '@/context/socketContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Locospace"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <SocketContextProvider>
            {children}
          </SocketContextProvider>
        </AuthContextProvider>
        </body>
    </html>
  );
}
