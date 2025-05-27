import { cn } from "@/lib/utils"

interface LogoTextProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export default function LogoText({ className, size = "md" }: LogoTextProps) {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-bold", 
    lg: "text-2xl font-bold",
    xl: "text-3xl font-bold"
  }

  return (
    <span className={cn(sizeClasses[size], "text-foreground", className)}>
      Betterlytics
    </span>
  )
} 