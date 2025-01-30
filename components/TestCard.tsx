'use client'

import React from 'react'
import { 
  PlayIcon,
  MusicalNoteIcon,
  BookOpenIcon,
  PencilSquareIcon,
  MicrophoneIcon
} from '@heroicons/react/24/solid'

const moduleConfig = {
  Listening: {
    icon: MusicalNoteIcon,
    color: 'bg-blue-100 text-blue-800',
    duration: '30m'
  },
  Reading: {
    icon: BookOpenIcon,
    color: 'bg-green-100 text-green-800',
    duration: '60m'
  },
  Writing: {
    icon: PencilSquareIcon,
    color: 'bg-purple-100 text-purple-800',
    duration: '60m'
  },
  Speaking: {
    icon: MicrophoneIcon,
    color: 'bg-orange-100 text-orange-800',
    duration: '15m'
  }
}

export default function TestCard({ test }) {
  const completedModules = test.modules.filter(module => test.scores[module] > 0).length

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
  {/* Test Header */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
      <span className={`px-3 py-1 rounded-full text-sm ${
        test.type === 'Academic' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-orange-100 text-orange-800'
      }`}>
        {test.type}
      </span>
    </div>
    <div className="text-center">
      {test.scores.overall > 0 ? (
        <>
          <div className="text-2xl font-bold text-gray-900">
            {test.scores.overall.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">Overall Band</div>
        </>
      ) : (
        <div className="text-sm text-gray-500">Not Attempted</div>
      )}
    </div>
  </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {test.modules.map((module) => {
          const { icon: Icon, color, duration } = moduleConfig[module]
          const hasScore = test.scores[module] > 0
          
          return (
            <div 
              key={module} 
              className={`flex items-center justify-between p-4 rounded-lg ${
                hasScore ? `${color} bg-opacity-30` : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${hasScore ? color.split(' ')[0] : 'text-gray-600'}`} />
                <div>
                  <div className="text-sm font-medium text-gray-900">{module}</div>
                  <div className="text-xs text-gray-500">{duration}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <PlayIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {hasScore ? 'Retake' : 'Take Test'}
                  </span>
                </button>
                {hasScore && (
                  <div className="text-xs font-medium text-gray-600">
                    Band: {test.scores[module].toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <PlayIcon className="w-5 h-5" />
            Start Full Test
          </button>
          <div className="text-sm text-gray-500">
            {test.attempts}+ users practiced
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-600">
            Status: {completedModules}/4 modules
          </span>
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${(completedModules/4)*100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}