import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export default function HeaderNavigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpenIcon className="h-8 w-8 text-blue-600" />  {/* Keeps brand consistency */}
          <span className="text-xl font-bold text-gray-900">IELTSExam.ai</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}


