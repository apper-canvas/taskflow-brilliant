import { motion } from "framer-motion"

const Loading = ({ type = "page" }) => {
  if (type === "page") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 font-medium"
          >
            Loading TaskFlow...
          </motion.div>
        </div>
      </div>
    )
  }

  if (type === "tasks") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
              </div>
              <div className="w-16 h-6 bg-slate-100 rounded-full animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

export default Loading