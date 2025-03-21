// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} IELTSExam.ai -  All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/about" className="hover:text-white text-sm">
            About
          </Link>
          <Link href="/privacy-policy" className="hover:text-white text-sm">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
