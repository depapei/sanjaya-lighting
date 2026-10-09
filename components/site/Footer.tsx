import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/15 bg-black text-white">
      <div className="mx-auto px-4 py-[50px] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-[30px] md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="mb-4 text-xl font-bold tracking-tight text-white">
              SANJAYA LIGHTING
            </h3>
            <p className="mb-4 max-w-md text-sm font-normal leading-relaxed text-white/60">
              Toko lampu hias di Jakarta. Koleksi lampu dekoratif, hemat energi,
              dan aksesoris dengan harga terjangkau.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/#products" },
                { label: "Koleksi", href: "/#koleksi" },
                { label: "About", href: "/#about" },
                { label: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="p-0 font-normal text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Kontak</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Jl. Raya Pos Pengumben No.5, Kebon Jeruk, Jakarta Barat
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+62 21 5870733</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@sanjayalighting.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-[50px] max-w-7xl border-t border-white/15 pt-4 text-center text-xs font-normal text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Sanjaya Lighting. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
