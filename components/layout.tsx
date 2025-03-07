import type React from "react"
import Link from "next/link"
import { Home, Menu } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">WorkSite Safety</h1>
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/projects" className="text-gray-600 hover:text-gray-900">
              Projects
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-400 hover:text-gray-500">
              <Home size={24} />
            </Link>
            <Link href="/menu" className="text-gray-400 hover:text-gray-500">
              <Menu size={24} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

