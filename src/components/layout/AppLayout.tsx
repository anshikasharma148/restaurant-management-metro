import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Add padding for mobile header and desktop sidebar */}
      <main className="pt-14 lg:pt-0 lg:pl-20 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}