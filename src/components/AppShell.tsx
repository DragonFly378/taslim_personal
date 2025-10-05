"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  BookOpen,
  Heart,
  Home,
  BookMarked,
  Menu,
  LogIn,
  LogOut,
  User,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
    { href: "/duas", icon: BookMarked, label: t.nav.duas },
    { href: "/bookmarks", icon: Heart, label: t.nav.bookmarks },
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

            {/* User Avatar/Sign In - Desktop Only */}
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse hidden md:block" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 hidden md:flex"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {session.user.name || session.user.email}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-sm"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.nav.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signIn()}
                className="hidden md:flex"
              >
                <LogIn className="mr-2 h-5 w-5" />
                <span className="text-base">{t.nav.signIn}</span>
              </Button>
            )}

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

                {/* User Section */}
                {status === "loading" ? (
                  <div className="px-6 py-6 border-b">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </div>
                ) : session?.user ? (
                  <div className="px-6 py-6 border-b bg-muted/30">
                    <div className="flex items-center gap-4">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="h-14 w-14 rounded-full ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-2 ring-primary/20">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold truncate">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-6 border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t.common.guestMode}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sign in to sync your data
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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

                  {/* Auth Button */}
                  {session?.user ? (
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-6 w-6 flex-shrink-0" />
                      <span className="text-base font-semibold">{t.nav.signOut}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => signIn()}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      <LogIn className="h-6 w-6 flex-shrink-0" />
                      <span className="text-base font-bold">{t.nav.signIn}</span>
                    </button>
                  )}
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
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t.footer.builtWith}
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{t.footer.copyright}</span>
              <span>•</span>
              <span>{t.footer.by}</span>
              <span>•</span>
              <span>{t.footer.poweredBy}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
