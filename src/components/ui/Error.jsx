import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ message = "Something went wrong", onRetry, type = "page" }) => {
  if (type === "page") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="AlertCircle" className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Oops! Something went wrong
          </h2>
          
          <p className="text-slate-600 mb-6">
            {message}
          </p>
          
          {onRetry && (
            <Button onClick={onRetry} className="mx-auto">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="font-semibold text-red-800 mb-2">Error</h3>
      <p className="text-red-600 text-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="text-red-600 border-red-300">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error