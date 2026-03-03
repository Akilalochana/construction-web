"use client";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./whatsapp-button";

export default function WhatsAppWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <WhatsAppButton />;
}
