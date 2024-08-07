"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { useState, useEffect } from "react";

const SiteHeader = () => {
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   getCurrentUser().then((user) => setUser(user));
  // }, []);

  return (
    <nav className="sticky h-[10vh] flex justify-center items-center z-50 border-b border-border/40 bg-transparent backdrop-blur-lg supports-[backdrop-filter]:bg-transparent">
      <div className="container flex justify-between items-center px-6">
        <Link href="/">
          <h1 className="text-lg font-bold sm:inline-block">Repoto</h1>
        </Link>
        <div className="flex items-center gap-5">
          <div className="hidden lg:flex items-center gap-5">
            <Link
              className="font-bold text-base transition-colors hover:text-foreground/80 text-foreground/60"
              href="/about"
            >
              About
            </Link>
            <Link
              className="font-bold text-base transition-colors hover:text-foreground/80 text-foreground/60"
              href="/"
            >
              Explore
            </Link>
            {/* <Link
              className="font-bold text-base transition-colors hover:text-foreground/80 text-foreground/60"
              href="/"
            >
              Contact Us
            </Link> */}
          </div>
          <Link href="/stock">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default SiteHeader;
