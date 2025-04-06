import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(255, 255, 255, 0.8)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          backdropFilter: "blur(12px)", // glass blur
          WebkitBackdropFilter: "blur(12px)", // for Safari
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "1rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
