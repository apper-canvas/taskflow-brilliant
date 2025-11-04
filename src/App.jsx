import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { router } from "@/router"
import { initializeStorage } from "@/utils/localStorage"

// Initialize localStorage with default data
initializeStorage()

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: "0.5rem",
          fontFamily: "Inter, sans-serif"
        }}
      />
    </>
  )
}

export default App