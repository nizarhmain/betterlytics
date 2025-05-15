"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
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
      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-gray-500" />
      )}
    </button>
  )
} 