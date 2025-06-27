import React, { useState } from 'react';
import { Plus, Camera, Upload as UploadIcon, Mic, FileText, X } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { MemoryUploadModal } from './MemoryUploadModal';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface UploadButtonProps {
  className?: string;
  variant?: 'icon' | 'full' | 'fab';
  label?: string;
  onUploadComplete?: () => void;
}

export function UploadButton({ 
  className = '', 
  variant = 'full',
  label = 'Upload Memory',
  onUploadComplete
}: UploadButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'video' | 'audio' | 'story' | null>(null);
  const { isMobile } = useDeviceDetection();

  const handleUploadTypeSelect = (type: 'photo' | 'video' | 'audio' | 'story') => {
    setUploadType(type);
    setShowModal(true);
    setShowMenu(false);
  };

  const handleUploadComplete = async () => {
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  // FAB style upload button with menu
  if (variant === 'fab') {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
          {/* Menu Items */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-20 z-30"
                onClick={() => setShowMenu(false)}
              />
              
              <div className="absolute bottom-16 right-0 space-y-3 z-40">
                <div className="flex items-center space-x-3 animate-in slide-in-from-right duration-200">
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Take Photo
                    </span>
                  </div>
                  <TouchOptimized>
                    <button
                      onClick={() => handleUploadTypeSelect('photo')}
                      className="bg-blue-600 p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-110"
                    >
                      <Camera size={20} />
                    </button>
                  </TouchOptimized>
                </div>
                
                <div className="flex items-center space-x-3 animate-in slide-in-from-right duration-200" style={{ animationDelay: '50ms' }}>
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Upload File
                    </span>
                  </div>
                  <TouchOptimized>
                    <button
                      onClick={() => handleUploadTypeSelect('video')}
                      className="bg-purple-600 p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-110"
                    >
                      <UploadIcon size={20} />
                    </button>
                  </TouchOptimized>
                </div>
                
                <div className="flex items-center space-x-3 animate-in slide-in-from-right duration-200" style={{ animationDelay: '100ms' }}>
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Record Audio
                    </span>
                  </div>
                  <TouchOptimized>
                    <button
                      onClick={() => handleUploadTypeSelect('audio')}
                      className="bg-green-600 p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-110"
                    >
                      <Mic size={20} />
                    </button>
                  </TouchOptimized>
                </div>
                
                <div className="flex items-center space-x-3 animate-in slide-in-from-right duration-200" style={{ animationDelay: '150ms' }}>
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Write Story
                    </span>
                  </div>
                  <TouchOptimized>
                    <button
                      onClick={() => handleUploadTypeSelect('story')}
                      className="bg-orange-600 p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-110"
                    >
                      <FileText size={20} />
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            </>
          )}

          {/* Main FAB */}
          <TouchOptimized>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`${
                showMenu ? 'bg-red-600 hover:bg-red-700' : 'bg-sage-700 hover:bg-sage-800'
              } p-4 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sage-300`}
              aria-label={showMenu ? 'Close upload menu' : 'Open upload menu'}
            >
              <div className={`transition-transform duration-300 ${showMenu ? 'rotate-45' : ''}`}>
                {showMenu ? <X size={24} /> : <Plus size={24} />}
              </div>
            </button>
          </TouchOptimized>
        </div>

        {/* Upload Modal */}
        {showModal && (
          <MemoryUploadModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onUpload={async () => {
              await handleUploadComplete();
              setShowModal(false);
            }}
            initialType={uploadType || undefined}
          />
        )}
      </>
    );
  }

  // Icon-only button
  if (variant === 'icon') {
    return (
      <>
        <TouchOptimized>
          <button
            onClick={() => setShowModal(true)}
            className={`p-2 rounded-lg text-white bg-sage-700 hover:bg-sage-800 transition-colors ${className}`}
            aria-label="Upload memory"
          >
            <Plus size={isMobile ? 20 : 24} />
          </button>
        </TouchOptimized>

        {/* Upload Modal */}
        {showModal && (
          <MemoryUploadModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onUpload={async () => {
              await handleUploadComplete();
              setShowModal(false);
            }}
          />
        )}
      </>
    );
  }

  // Full button with label
  return (
    <>
      <TouchOptimized>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-sage-700 hover:bg-sage-800 transition-colors ${className}`}
        >
          <Plus size={isMobile ? 18 : 20} />
          <span>{label}</span>
        </button>
      </TouchOptimized>

      {/* Upload Modal */}
      {showModal && (
        <MemoryUploadModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpload={async () => {
            await handleUploadComplete();
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}