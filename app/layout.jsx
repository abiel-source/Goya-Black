import { DM_Sans } from "next/font/google";
import "@/assets/styles/globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import Header from "@/components/root/Header";
// import Footer from "@/components/root/Footer";
import SideNav from "@/components/root/SideNav";
import FooterNav from "@/components/root/FooterNav";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/components/root/ToastProvider";

import { Suspense } from "react"; // production build error fix

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Crystal Clear",
  description: "Photography Marketplace",
};

const RootLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${dm_sans.className} antialiased`}>
          <div className="min-h-dvh flex flex-col">
            {/* build error fix */}
            <Suspense fallback={null}>
              <Header />
            </Suspense>

            {/* Below-header region */}
            {/* min-h-0 allows children to shrink and scroll */}
            <div className="flex flex-1 min-h-0">
              <SideNav />

              {/* Only this scrolls */}
              <main className="flex-1 min-w-0 overflow-y-auto pb-16 md:pb-0">
                {children}
              </main>
            </div>

            <FooterNav />

            <ToastProvider />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
