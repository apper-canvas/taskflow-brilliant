import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const AllTasks = lazy(() => import("@/components/pages/AllTasks"))
const TodayTasks = lazy(() => import("@/components/pages/TodayTasks"))
const UpcomingTasks = lazy(() => import("@/components/pages/UpcomingTasks"))
const ListView = lazy(() => import("@/components/pages/ListView"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <div className="text-slate-600 font-medium">Loading TaskFlow...</div>
    </div>
  </div>
)

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AllTasks />
      </Suspense>
    )
  },
  {
    path: "today",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TodayTasks />
      </Suspense>
    )
  },
  {
    path: "upcoming",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <UpcomingTasks />
      </Suspense>
    )
  },
  {
    path: "list/:listId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ListView />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
]

// Routes array with Layout as parent
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)