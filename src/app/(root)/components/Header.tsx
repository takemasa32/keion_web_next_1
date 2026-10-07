"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "ホーム" },
  { href: "/events", label: "イベント" },
  { href: "/sns", label: "見学・お問い合わせ" },
];
export default function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand">
          <Image src="/icons/icon-512x512.png" alt="" width={42} height={42} />
          <span>
            島根大学 軽音楽部<small>SHIMANE UNIVERSITY KEION</small>
          </span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "閉じる ×" : "メニュー ☰"}
        </button>
        <nav
          id="site-navigation"
          aria-label="メインナビゲーション"
          className={open ? "site-nav is-open" : "site-nav"}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={
                (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                  ? "page"
                  : undefined
              }
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
