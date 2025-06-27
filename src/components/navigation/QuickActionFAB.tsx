import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Camera, Upload, Mic, FileText, X } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

export function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useDeviceDetection();

  const quickActions = [
    {
      icon: Camera,
      label: 'Take Photo',
      href: '/upload?type=photo',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Upload,
      label: 'Upload File',
      href: '/upload?type=file',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: Mic,
      label: 'Record Audio',
      href: '/upload?type=audio',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      icon: FileText,
      label: 'Write Story',
      href: '/upload?type=story',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-40">
      {/* Action Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Action Items */}
          <div className="absolute bottom-16 right-0 space-y-3 z-40">
            {quickActions.map((action, index) => (
              <div
                key={action.label}
                className="flex items-center space-x-3 animate-in slide-in-from-right duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Label */}
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {action.label}
                  </span>
                </div>
                
                {/* Action Button */}
                <TouchOptimized>
                  <Link
                    to={action.href}
                    onClick={() => setIsOpen(false)}
                    className={`${action.color} p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-110`}
                  >
                    <action.icon size={20} />
                  </Link>
                </TouchOptimized>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Main FAB */}
      <TouchOptimized>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-sage-700 hover:bg-sage-800'
          } p-4 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sage-300`}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </div>
        </button>
      </TouchOptimized>
    </div>
  );
}