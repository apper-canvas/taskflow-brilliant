import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
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
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ApperIcon name="Search" className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to All Tasks
            </Button>
          </Link>
          
          <Link to="/today">
            <Button variant="outline" className="w-full">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              View Today's Tasks
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-slate-500">
          Need help? Try searching for your tasks or check out your lists.
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound