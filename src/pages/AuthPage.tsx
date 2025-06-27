import React, { useState } from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { WelcomeSection } from '../components/auth/WelcomeSection';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const { isMobile } = useDeviceDetection();

  if (isMobile) {
    // Mobile: Single column layout
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800">
        <div className="min-h-screen flex items-center justify-center p-4">
          <AuthForm mode={mode} onToggleMode={setMode} />
        </div>
      </div>
    );
  }

  // Desktop: Split screen layout
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>
        
        <WelcomeSection />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-8">
        <AuthForm mode={mode} onToggleMode={setMode} />
      </div>
    </div>
  );
}