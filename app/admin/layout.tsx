"use client";

import Sidebar from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";
import "../globals.css";
import Providers from "../provider";

export default function adminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Halaman login tidak pakai sidebar + tidak perlu offset konten.
  if (isLoginPage) {
    return (
      <div>
        <Providers>{children}</Providers>
      </div>
    );
  }

  return (
    <div>
      <Providers>
        <Sidebar />
        <div className="ms-[256px] p-5">{children}</div>
      </Providers>
    </div>
  );
}
