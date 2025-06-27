import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Camera, Users, Shield, Gamepad2, Search } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Camera,
      title: 'Preserve Memories',
      description: 'Upload photos, videos, and audio recordings to create a rich family history.',
    },
    {
      icon: Users,
      title: 'Family Collaboration',
      description: 'Invite family members to contribute and share memories together.',
    },
    {
      icon: Search,
      title: 'AI Organization',
      description: 'Smart tagging and search makes finding memories effortless.',
    },
    {
      icon: Gamepad2,
      title: 'Memory Games',
      description: 'Engaging activities to help with memory recall and cognitive wellness.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your memories are secure with advanced privacy controls.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-700 rounded-full mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-sage-800 mb-6">
              MemoryMesh
            </h1>
            
            <p className="text-xl sm:text-2xl text-sage-600 mb-8 max-w-3xl mx-auto">
              Preserve, organize, and share your family's precious memories. 
              A collaborative platform designed with love for families dealing with memory challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="w-full sm:w-auto bg-sage-700 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-sage-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
              >
                Get Started Free
              </Link>
              <Link
                to="/demo"
                className="w-full sm:w-auto border-2 border-sage-700 text-sage-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-sage-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Preserve Family Memories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for families, with accessibility and ease of use at the forefront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-sage-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-sage-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-sage-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Preserving Your Family Memories Today
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Join families around the world who are keeping their stories alive with MemoryMesh.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-white text-sage-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-sage-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage-700"
          >
            Create Your Family's Memory Collection
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sage-800 text-sage-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="w-6 h-6" />
              <span className="text-xl font-bold">MemoryMesh</span>
            </div>
            <p className="text-sage-300 text-center md:text-right">
              © 2025 MemoryMesh. Built with love for families everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}