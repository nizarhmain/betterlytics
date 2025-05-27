"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "simple" | "full" | "icon"
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function Logo({ 
  variant = "simple", 
  className, 
  width, 
  height, 
  priority = false 
}: LogoProps) {
  const { theme, systemTheme } = useTheme()
  
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  const logoSources = {
    simple: {
      light: "/betterlytics-logo-light-simple.svg",
      dark: "/betterlytics-logo-dark-simple.svg",
    },
    full: {
      light: "/logo-light-svg-full.svg", 
      dark: "/logo-dark-svg-full.svg",
    },
    icon: {
      light: "/images/favicon-light.svg",
      dark: "/images/favicon-dark.svg",
    }
  }

  const defaultDimensions = {
    simple: { width: 32, height: 32 },
    full: { width: 150, height: 40 },
    icon: { width: 24, height: 24 }
  }

  const logoSrc = isDark ? logoSources[variant].dark : logoSources[variant].light
  const dimensions = {
    width: width || defaultDimensions[variant].width,
    height: height || defaultDimensions[variant].height
  }

  return (
    <Image
      src={logoSrc}
      alt="Betterlytics"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  )
} 