import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TimelinePage } from './pages/TimelinePage';
import { UploadPage } from './pages/UploadPage';
import { TaggingPage } from './pages/TaggingPage';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { GameProgressPage } from './pages/GameProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { SearchPage } from './pages/SearchPage';
import { ActivityPage } from './pages/ActivityPage';
import { MessagingPage } from './pages/MessagingPage';
import { PrivacyControlsPage } from './pages/PrivacyControlsPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading MemoryMesh...</p>
        </div>
      </div>
    );
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = localStorage.getItem('memorymesh_onboarding_completed') === 'true';

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Design System Route */}
        <Route path="/design-system" element={<DesignSystemPage />} />
        
        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <OnboardingPage />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <DashboardPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/timeline"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <TimelinePage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/upload"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <UploadPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/tagging"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <TaggingPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/family"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Members</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        {/* Games Routes */}
        <Route
          path="/games"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <GamesPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/games/:gameId"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <GameDetailPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/games/play/:gameId"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <GamePlayPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/games/progress"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <GameProgressPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/search"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <SearchPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/settings"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <SettingsPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/privacy"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <PrivacyControlsPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/activity"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <ActivityPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/messaging"
          element={
            user ? (
              hasCompletedOnboarding ? (
                <Layout>
                  <MessagingPage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;