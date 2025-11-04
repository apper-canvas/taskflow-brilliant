import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onChange?.(!checked)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative w-5 h-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
        checked 
          ? "bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500" 
          : "bg-white border-slate-300 hover:border-primary-400",
        className
      )}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center checkbox-checked"
        >
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox