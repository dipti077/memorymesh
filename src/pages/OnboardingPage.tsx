import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow, OnboardingData } from '../components/onboarding/OnboardingFlow';
import { useAuth } from '../hooks/useAuth';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Here you would typically save the onboarding data to your backend
      console.log('Onboarding completed with data:', data);
      
      // For now, we'll just store it in localStorage and redirect
      localStorage.setItem('memorymesh_onboarding_completed', 'true');
      localStorage.setItem('memorymesh_onboarding_data', JSON.stringify(data));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Redirect if user is not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}