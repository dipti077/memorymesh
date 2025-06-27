import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from '../ui/MobileNavigation';
import { BreadcrumbNavigation } from '../navigation/BreadcrumbNavigation';
import { OfflineIndicator } from '../ui/OfflineIndicator';
import { InstallPrompt } from '../ui/InstallPrompt';
import { KeyboardNavigation } from '../navigation/KeyboardNavigation';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { UploadButton } from '../upload/UploadButton';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useDeviceDetection();

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Global Components */}
      <OfflineIndicator />
      <InstallPrompt />
      <KeyboardNavigation />
      
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0" role="main">
          <div className={`p-4 sm:p-6 lg:p-8 ${isMobile ? 'pb-20' : ''}`}>
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation />
            
            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Quick Action FAB */}
      <UploadButton variant="fab" />
    </div>
  );
}