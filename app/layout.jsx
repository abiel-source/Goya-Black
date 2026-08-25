import { Bodoni_Moda } from "next/font/google";
import "@/assets/styles/globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import Header from "@/components/root/Header";
import SideNav from "@/components/root/SideNav";
import FooterNav from "@/components/root/FooterNav";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/components/root/ToastProvider";

import { Suspense } from "react";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});


export const metadata = {
  title: "Goya Black",
  description: "A digital museum of classical art",
  icons: {
    icon: "/goya.svg",
  },
};

const RootLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${bodoni.variable} antialiased`}>
          <div className="h-dvh flex flex-row overflow-hidden">
            {/* Sidebar — full height, fixed width */}
            <SideNav />

            {/* Right column — header + scrollable content */}
            <div className="flex flex-col flex-1 min-w-0 h-full">
              <Suspense fallback={null}>
                <Header />
              </Suspense>

              <main className="flex-1 min-h-0 overflow-y-auto pb-16 md:pb-0">
                {children}
              </main>
            </div>
          </div>

          <FooterNav />
          <ToastProvider />
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
