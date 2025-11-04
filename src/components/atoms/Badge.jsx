import { cn } from "@/utils/cn"

const badgeVariants = {
  default: "bg-slate-100 text-slate-800",
  primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700",
  secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700",
  accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-100 text-orange-700",
  error: "bg-red-100 text-red-700",
  high: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border border-pink-200",
  medium: "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200",
  low: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
}

const Badge = ({ className, variant = "default", children, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge