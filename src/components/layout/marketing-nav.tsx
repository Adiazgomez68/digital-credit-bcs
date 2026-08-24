import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#requisitos", label: "Requisitos" },
  { href: "#preguntas", label: "Preguntas frecuentes" },
] as const;

export function MarketingNav() {
  return (
    <nav className="flex items-center gap-6">
      <ul className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <Link href="/credit/channel" className={buttonVariants({ size: "lg" })}>
        Iniciar solicitud
      </Link>
    </nav>
  );
}
