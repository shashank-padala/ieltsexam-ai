'use client'

import { useState } from 'react'

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const mockTests = [
  { month: 'January', year: 2024, type: 'Academic', modules: ['Listening', 'Reading', 'Writing'], attempts: 49768 },
  { month: 'February', year: 2024, type: 'Academic', modules: ['Reading', 'Writing'], attempts: 4217 },
  // Add more months as needed
]

export default function MockTests() {
  const [selectedType, setSelectedType] = useState<'Academic' | 'General'>('Academic')
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const availableYears = [2024, 2023]

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">IELTS Exam Library</h2>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSelectedType('Academic')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'Academic' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Academic
        </button>
        <button
          onClick={() => setSelectedType('General')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'General' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          General
        </button>
      </div>

      {/* Monthly Test Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month) => {
          const monthTest = mockTests.find(test => 
            test.month === month &&
            test.year === selectedYear &&
            test.type === selectedType
          )
          
          return (
            <div key={month} className="bg-white p-6 rounded-xl shadow-sm">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {month} {selectedYear}
                </h3>
                {monthTest && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {selectedType}
                  </span>
                )}
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Listening', 'Reading', 'Writing', 'Speaking'].map((module) => (
                  <a
                    key={module}
                    href={monthTest ? `/tests/${module.toLowerCase()}` : '#'}
                    className="p-3 rounded-lg text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-center"
                  >
                    {module}
                  </a>
                ))}
              </div>

              {/* Full Test Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Full Test</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: '0%' }}
                  />
                </div>
                <a
                  href={monthTest ? `/tests/full-test` : '#'}
                  className={`w-full text-center block py-2 rounded-lg ${
                    monthTest
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Start Test
                </a>
              </div>

              {/* Attempts Counter */}
              {monthTest && (
                <div className="mt-4 text-sm text-gray-500">
                  {monthTest.attempts.toLocaleString()} attempts
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}