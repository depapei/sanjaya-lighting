"use client";

import Sidebar from "@/components/admin/Sidebar";
import "../globals.css";
import Providers from "../provider";

export default function adminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Providers>
        <Sidebar />
        <div className="ms-[256px] p-5">{children}</div>
      </Providers>
    </div>
  );
}
