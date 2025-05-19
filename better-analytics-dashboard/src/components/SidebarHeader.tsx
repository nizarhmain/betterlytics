"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function SidebarHeader() {
  const { theme } = useTheme();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={theme === "light" ? "/betterlytics-logo-dark-simple.svg" : "/betterlytics-logo-light-simple.svg"}
            alt="Betterlytics Logo"
            width={32}
            height={32}
          />
          <div>
            <div className="font-bold text-sm text-foreground">Betterlytics</div>
          </div>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
} 