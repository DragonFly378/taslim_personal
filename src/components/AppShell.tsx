"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  BookOpen,
  Heart,
  Home,
  Menu,
  LogIn,
  LogOut,
  User,
  Languages,
  Hand,
  Settings,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { UserAvatar } from "@/components/UserAvatar";
import { AutoOfflineDownload } from "@/components/AutoOfflineDownload";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: t.nav.home },
    { href: "/quran", icon: BookOpen, label: t.nav.quran },
    { href: "/duas", icon: Hand, label: t.nav.duas },
    // Bookmarks hidden - requires backend auth
    // { href: "/bookmarks", icon: Heart, label: t.nav.bookmarks },
  ];

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 flex h-16 sm:h-20 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo_taslim_side.png"
              alt="Taslim Logo"
              width={200}
              height={60}
              className="h-auto w-[80px] sm:w-[100px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle - Desktop Only */}
            <Button
              variant="ghost"
              size="default"
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="hidden md:flex items-center gap-2 hover:bg-primary/10"
            >
              <span className="text-lg">{language === "en" ? "🇬🇧" : "🇮🇩"}</span>
              <span className="text-base font-medium">
                {language === "en" ? "EN" : "ID"}
              </span>
            </Button>

            {/* Auth UI Hidden - No Backend */}

            {/* Mobile Menu - Fullscreen */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
                {/* Header Section */}
                <div className="border-b px-6 py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <Link href="/" className="flex items-center justify-center">
                    <Image
                      src="/images/logo_taslim_side.png"
                      alt="Taslim Logo"
                      width={180}
                      height={60}
                      className="h-auto w-[140px] sm:w-[160px]"
                    />
                  </Link>
                </div>

                {/* User Section - Hidden (No Backend Auth) */}

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                            : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-6 w-6 flex-shrink-0" />
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer Section */}
                <div className="border-t px-6 py-4 space-y-2 bg-muted/30">
                  {/* Language Toggle */}
                  <button
                    type="button"
                    onClick={() => setLanguage(language === "en" ? "id" : "en")}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl w-full hover:bg-background transition-colors"
                  >
                    <Languages className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-2xl">
                        {language === "en" ? "🇮🇩" : "🇬🇧"}
                      </span>
                      <span className="text-base font-medium">
                        {language === "en"
                          ? "Switch to Indonesian"
                          : "Beralih ke English"}
                      </span>
                    </div>
                  </button>

                  {/* Auth Buttons Hidden - No Backend */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-br from-card via-card to-primary/5 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          {/* Top Section - Logo & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/logo_taslim_side.png"
                  alt="Taslim Logo"
                  width={150}
                  height={45}
                  className="h-auto w-[120px] sm:w-[140px] opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t.footer.builtWith}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Explore</h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  <li>
                    <Link href="/quran" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {t.nav.quran}
                    </Link>
                  </li>
                  <li>
                    <Link href="/duas" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                      <Hand className="h-3.5 w-3.5" />
                      {t.nav.duas}
                    </Link>
                  </li>
                  {/* Bookmarks hidden - requires backend */}
                </ul>
              </div>

              {/* Account section hidden - no backend auth */}

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Language</h3>
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "id" : "en")}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span className="text-base">{language === "en" ? "🇮🇩" : "🇬🇧"}</span>
                  <span>{language === "en" ? "ID" : "EN"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

          {/* Bottom Section - Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              {t.footer.copyright} • {t.footer.by}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="text-red-500">♥</span>
              {t.footer.poweredBy}
            </p>
          </div>
        </div>
      </footer>

      {/* Auto Offline Download */}
      <AutoOfflineDownload />
    </div>
  );
}
