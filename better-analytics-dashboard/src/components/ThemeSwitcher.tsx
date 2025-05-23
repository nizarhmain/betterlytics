"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./ui/sidebar"

export function ThemeSwitcher( { className, ...props }: React.ComponentProps<"button">) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift when the button is not mounted
    return <div className="w-[18px] h-[18px]" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("p-1 rounded-md hover:bg-accent", className)}
      aria-label="Toggle theme"
      {...props}
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-primary" />
      ) : (
        <Moon size={18} className="text-muted-foreground" />
      )}
    </button>
  )
} 