"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tent, User, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/learn", label: "Learn" },
    { path: "/training", label: "Training" },
    { path: "/test", label: "Tests" },
    { path: "/projects", label: "Projects" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/90 text-white backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Link */}
        <Link href="/">
          <div className="flex items-center gap-2 hover:bg-neutral-800 px-3 py-2 rounded-md cursor-pointer transition-colors">
            <Tent className="w-6 h-6 text-white" />
            <span className="text-2xl font-display tracking-tight text-white">
              Sircus
            </span>
          </div>
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-white hover:bg-neutral-800 hover:text-white",
                  isActive && "bg-neutral-800"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* --- Right Side (Profile Logic) --- */}
        <div className="flex items-center gap-3">
          {/* LOGIC 1: If User is Signed IN -> Go to Profile Page */}
          <SignedIn>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-neutral-800 hover:text-white"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
            {/* Alternatively, use Clerk's UserButton if you prefer that: <UserButton /> */}
          </SignedIn>

          {/* LOGIC 2: If User is Signed OUT -> Open Login Modal */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-neutral-800 hover:text-white"
              >
                <User className="w-5 h-5" />
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu */}
          <div className="md:hidden">
            {isClient && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-neutral-800 hover:text-white"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-black text-white border-neutral-800"
                >
                  <SheetHeader>
                    <SheetTitle>
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2"
                      >
                        <Tent className="h-6 w-6 text-white" />
                        <span className="text-lg font-bold tracking-tight text-white">
                          Sircus
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-3 pt-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="flex items-center gap-3 rounded-md p-2 text-lg font-medium hover:bg-neutral-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {/* Mobile Profile Logic */}
                    <SignedIn>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-md p-2 text-lg font-medium hover:bg-neutral-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="flex w-full items-center gap-3 rounded-md p-2 text-lg font-medium hover:bg-neutral-800 text-left">
                          Sign In
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
