import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Eye, EyeOff, Download, Trash2, Users, 
  Settings, Bell, Calendar, FileText, Check, X, 
  AlertTriangle, Info, ChevronRight, ChevronDown, ChevronUp,
  Database, Smartphone, Globe, ArrowLeft, Loader2,
  UserPlus, Key, LogOut, RefreshCw, Clock, Save, Search,
  MessageCircle, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function PrivacyControlsPage() {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showConnectedApps, setShowConnectedApps] = useState(false);
  
  // Privacy Settings
  const [defaultVisibility, setDefaultVisibility] = useState<'private' | 'family' | 'public'>('family');
  const [locationTagging, setLocationTagging] = useState(true);
  const [faceRecognition, setFaceRecognition] = useState(true);
  const [aiTagging, setAiTagging] = useState(true);
  const [searchIndexing, setSearchIndexing] = useState(true);
  const [shareWithThirdParties, setShareWithThirdParties] = useState(false);
  const [retentionPeriod, setRetentionPeriod] = useState<'forever' | '5years' | '1year'>('forever');
  
  // Family Privacy Settings
  const [familyDefaultPermissions, setFamilyDefaultPermissions] = useState<'view' | 'comment' | 'edit'>('comment');
  const [autoAcceptMembers, setAutoAcceptMembers] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [allowMemberInvites, setAllowMemberInvites] = useState(true);
  
  // Caregiver Settings
  const [caregiverAccess, setCaregiverAccess] = useState(false);
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [caregiverPermissions, setCaregiverPermissions] = useState<string[]>(['view']);
  const [emergencyAccess, setEmergencyAccess] = useState(false);
  
  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordLastChanged, setPasswordLastChanged] = useState<Date | null>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  // Connected Apps
  const [connectedApps, setConnectedApps] = useState<any[]>([
    { 
      id: 'google-photos', 
      name: 'Google Photos', 
      icon: '📷', 
      connectedOn: '2024-06-15', 
      permissions: ['Read photos', 'Upload photos'],
      lastAccess: '2024-07-01'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '👤', 
      connectedOn: '2024-05-20', 
      permissions: ['Share memories'],
      lastAccess: '2024-06-25'
    }
  ]);
  
  // Privacy Score
  const [privacyScore, setPrivacyScore] = useState(0);
  
  // Fetch user data and settings
  useEffect(() => {
    // Calculate privacy score based on settings
    calculatePrivacyScore();
    
    // Simulate fetching user data
    setPasswordLastChanged(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
    
    // Simulate fetching active sessions
    setActiveSessions([
      { id: 'session1', device: 'iPhone 13', location: 'New York, USA', lastActive: new Date(), current: true },
      { id: 'session2', device: 'Chrome on Windows', location: 'New York, USA', lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    ]);
  }, []);
  
  // Calculate privacy score based on settings
  const calculatePrivacyScore = () => {
    let score = 0;
    
    // Default visibility
    if (defaultVisibility === 'private') score += 20;
    else if (defaultVisibility === 'family') score += 15;
    else score += 5;
    
    // Security features
    if (twoFactorEnabled) score += 20;
    if (loginAlerts) score += 10;
    
    // Data collection
    if (!locationTagging) score += 10;
    if (!faceRecognition) score += 10;
    if (!aiTagging) score += 10;
    if (!searchIndexing) score += 10;
    if (!shareWithThirdParties) score += 10;
    
    // Retention
    if (retentionPeriod === '1year') score += 10;
    else if (retentionPeriod === '5years') score += 5;
    
    // Cap at 100
    score = Math.min(score, 100);
    setPrivacyScore(score);
  };
  
  // Update settings when they change
  useEffect(() => {
    calculatePrivacyScore();
  }, [
    defaultVisibility, twoFactorEnabled, loginAlerts, locationTagging,
    faceRecognition, aiTagging, searchIndexing, shareWithThirdParties,
    retentionPeriod
  ]);
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleExportData = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExportProgress(i);
      }
      
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'memorymesh-data-export.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would delete the user's account
      console.log('Deleting account...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sign out after deletion
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  
  const handleDeactivateAccount = async () => {
    try {
      // In a real app, this would deactivate the user's account
      console.log('Deactivating account...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert('Your account has been deactivated. You can reactivate it by logging in again within 30 days.');
      
      // Sign out after deactivation
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error deactivating account:', error);
    }
  };
  
  const handleRevokeApp = async (appId: string) => {
    try {
      // In a real app, this would revoke access for the specified app
      console.log('Revoking access for app:', appId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove app from list
      setConnectedApps(prev => prev.filter(app => app.id !== appId));
    } catch (error) {
      console.error('Error revoking app access:', error);
    }
  };
  
  const handleRevokeSession = async (sessionId: string) => {
    try {
      // In a real app, this would revoke the specified session
      console.log('Revoking session:', sessionId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove session from list
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };
  
  const getPrivacyScoreColor = () => {
    if (privacyScore >= 80) return 'text-green-600';
    if (privacyScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getPrivacyScoreBackground = () => {
    if (privacyScore >= 80) return 'bg-green-100';
    if (privacyScore >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  const getPrivacyScoreText = () => {
    if (privacyScore >= 80) return 'Strong';
    if (privacyScore >= 60) return 'Good';
    if (privacyScore >= 40) return 'Fair';
    return 'Weak';
  };
  
  const privacySections = [
    {
      id: 'dashboard',
      title: 'Privacy Dashboard',
      icon: Shield,
      description: 'Overview of your privacy settings and data'
    },
    {
      id: 'memory-privacy',
      title: 'Memory Privacy',
      icon: Eye,
      description: 'Control who can see your memories'
    },
    {
      id: 'data-controls',
      title: 'Data Controls',
      icon: Database,
      description: 'Manage your personal data'
    },
    {
      id: 'family-privacy',
      title: 'Family Privacy',
      icon: Users,
      description: 'Family-wide privacy settings'
    },
    {
      id: 'third-party',
      title: 'Third-Party Integrations',
      icon: Globe,
      description: 'Manage connected apps and services'
    },
    {
      id: 'compliance',
      title: 'Privacy Compliance',
      icon: FileText,
      description: 'Data rights and legal compliance'
    },
    {
      id: 'caregiver',
      title: 'Caregiver Privacy',
      icon: Users,
      description: 'Manage caregiver access'
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Lock,
      description: 'Protect your account'
    }
  ];
  
  const renderPrivacyDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Dashboard</h2>
      
      {/* Privacy Score */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Privacy Score</h3>
          <div className={`${getPrivacyScoreBackground()} px-3 py-1 rounded-full`}>
            <span className={`font-semibold ${getPrivacyScoreColor()}`}>
              {getPrivacyScoreText()}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Your Score</span>
            <span className={`font-bold text-lg ${getPrivacyScoreColor()}`}>{privacyScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                privacyScore >= 80 ? 'bg-green-600' : 
                privacyScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${privacyScore}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-1">Improve Your Score</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {!twoFactorEnabled && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>Enable two-factor authentication</span>
                </li>
              )}
              {defaultVisibility === 'public' && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>Change default visibility to Family or Private</span>
                </li>
              )}
              {shareWithThirdParties && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>Disable third-party data sharing</span>
                </li>
              )}
              {retentionPeriod === 'forever' && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span>Set a data retention period</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-1">Privacy Strengths</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {twoFactorEnabled && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Two-factor authentication enabled</span>
                </li>
              )}
              {defaultVisibility === 'private' && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Private default visibility</span>
                </li>
              )}
              {!shareWithThirdParties && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>No third-party data sharing</span>
                </li>
              )}
              {loginAlerts && (
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Login alerts enabled</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Privacy Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Default Memory Visibility</p>
                <p className="text-sm text-gray-600">Who can see your memories by default</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {defaultVisibility.charAt(0).toUpperCase() + defaultVisibility.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Family Members</p>
                <p className="text-sm text-gray-600">People with access to your memories</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              5 Members
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Data Collection</p>
                <p className="text-sm text-gray-600">AI and automatic data processing</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              aiTagging && faceRecognition && locationTagging
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {aiTagging && faceRecognition && locationTagging
                ? 'Enhanced'
                : 'Limited'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Account Security</p>
                <p className="text-sm text-gray-600">Protection level for your account</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              twoFactorEnabled
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {twoFactorEnabled ? 'Strong' : 'Basic'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Recent Privacy Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Privacy Activity</h3>
        
        <div className="space-y-3">
          {[
            { action: 'Changed default visibility to Family', date: '2024-07-01', icon: Eye },
            { action: 'Downloaded data archive', date: '2024-06-15', icon: Download },
            { action: 'Updated password', date: '2024-06-01', icon: Lock },
            { action: 'Revoked access for Facebook app', date: '2024-05-20', icon: Globe }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-gray-200 p-2 rounded-full">
                <activity.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Privacy Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Privacy Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('data-controls')}
              className="flex items-center space-x-3 p-4 bg-sage-50 rounded-xl border border-sage-200 hover:bg-sage-100 transition-colors"
            >
              <Download className="w-5 h-5 text-sage-700" />
              <span className="font-medium text-sage-800">Export Your Data</span>
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('security')}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <Lock className="w-5 h-5 text-blue-700" />
              <span className="font-medium text-blue-800">Security Checkup</span>
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setDefaultVisibility('private')}
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <EyeOff className="w-5 h-5 text-purple-700" />
              <span className="font-medium text-purple-800">Make All Private</span>
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('third-party')}
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <Globe className="w-5 h-5 text-orange-700" />
              <span className="font-medium text-orange-800">Manage Connected Apps</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderMemoryPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Memory Privacy</h2>
      
      {/* Default Visibility */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Memory Visibility</h3>
        
        <div className="space-y-3">
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <EyeOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Private</p>
                  <p className="text-sm text-gray-600">Only you can see these memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'private'}
                onChange={() => setDefaultVisibility('private')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Family Only</p>
                  <p className="text-sm text-gray-600">Only your family members can see these memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'family'}
                onChange={() => setDefaultVisibility('family')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Public</p>
                  <p className="text-sm text-gray-600">Anyone with the link can see these memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'public'}
                onChange={() => setDefaultVisibility('public')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              This setting only affects new memories you upload. You can always change the visibility of individual memories later.
            </p>
          </div>
        </div>
      </div>
      
      {/* Memory Collections */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Collections</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Family Vacation 2024</p>
                <p className="text-sm text-gray-600">42 memories</p>
              </div>
            </div>
            <TouchOptimized>
              <button className="text-sage-600 hover:text-sage-700 font-medium text-sm">
                Manage Privacy
              </button>
            </TouchOptimized>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Christmas 2023</p>
                <p className="text-sm text-gray-600">28 memories</p>
              </div>
            </div>
            <TouchOptimized>
              <button className="text-sage-600 hover:text-sage-700 font-medium text-sm">
                Manage Privacy
              </button>
            </TouchOptimized>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Grandma's 80th Birthday</p>
                <p className="text-sm text-gray-600">15 memories</p>
              </div>
            </div>
            <TouchOptimized>
              <button className="text-sage-600 hover:text-sage-700 font-medium text-sm">
                Manage Privacy
              </button>
            </TouchOptimized>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <TouchOptimized>
            <Link
              to="/collections"
              className="text-sage-600 hover:text-sage-700 font-medium"
            >
              View All Collections
            </Link>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Temporary Sharing */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Temporary Sharing Links</h3>
          <TouchOptimized>
            <button className="text-sage-600 hover:text-sage-700 font-medium text-sm">
              Create New Link
            </button>
          </TouchOptimized>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Grandma's Birthday Photos</p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                Expires in 5 days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate max-w-xs">
                https://memorymesh.app/share/abc123
              </p>
              <div className="flex items-center space-x-2">
                <TouchOptimized>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <RefreshCw size={16} />
                  </button>
                </TouchOptimized>
                <TouchOptimized>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Trash2 size={16} />
                  </button>
                </TouchOptimized>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Family Vacation Video</p>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                Expired
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate max-w-xs">
                https://memorymesh.app/share/def456
              </p>
              <div className="flex items-center space-x-2">
                <TouchOptimized>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <RefreshCw size={16} />
                  </button>
                </TouchOptimized>
                <TouchOptimized>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Trash2 size={16} />
                  </button>
                </TouchOptimized>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Memory Expiration */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Expiration</h3>
        
        <div className="space-y-3">
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Keep Forever</p>
                  <p className="text-sm text-gray-600">Never automatically delete memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="retention"
                checked={retentionPeriod === 'forever'}
                onChange={() => setRetentionPeriod('forever')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">5 Year Retention</p>
                  <p className="text-sm text-gray-600">Delete memories after 5 years</p>
                </div>
              </div>
              <input
                type="radio"
                name="retention"
                checked={retentionPeriod === '5years'}
                onChange={() => setRetentionPeriod('5years')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">1 Year Retention</p>
                  <p className="text-sm text-gray-600">Delete memories after 1 year</p>
                </div>
              </div>
              <input
                type="radio"
                name="retention"
                checked={retentionPeriod === '1year'}
                onChange={() => setRetentionPeriod('1year')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Setting an expiration period will permanently delete memories older than the specified time. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderDataControls = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Data Controls</h2>
      
      {/* Data Export */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Your Data</h3>
        
        <p className="text-gray-600 mb-4">
          Download a copy of all your data from MemoryMesh, including memories, comments, and account information.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Complete Data Archive</p>
                <p className="text-sm text-gray-600">All your memories, comments, and account data</p>
              </div>
            </div>
            <TouchOptimized>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </TouchOptimized>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Memories Only</p>
                <p className="text-sm text-gray-600">Just your photos, videos, and stories</p>
              </div>
            </div>
            <TouchOptimized>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </TouchOptimized>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Account Data</p>
                <p className="text-sm text-gray-600">Your profile, settings, and activity</p>
              </div>
            </div>
            <TouchOptimized>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </TouchOptimized>
          </div>
        </div>
        
        {isExporting && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Preparing export...</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="mb-1">Your data will be exported as a ZIP file containing:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Photos and videos in their original quality</li>
                <li>Text memories in HTML and plain text formats</li>
                <li>Comments and interactions in JSON format</li>
                <li>Account information and settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selective Deletion */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selective Data Deletion</h3>
        
        <p className="text-gray-600 mb-4">
          Delete specific types of data from your account. This action cannot be undone.
        </p>
        
        <div className="space-y-3">
          <TouchOptimized>
            <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delete All Photos</p>
                  <p className="text-sm text-gray-600">Remove all uploaded photos</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delete All Videos</p>
                  <p className="text-sm text-gray-600">Remove all uploaded videos</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delete All Comments</p>
                  <p className="text-sm text-gray-600">Remove all your comments</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delete Activity History</p>
                  <p className="text-sm text-gray-600">Remove your activity and interaction data</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </TouchOptimized>
        </div>
        
        <div className="mt-6 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 mb-1">Permanent Deletion</p>
              <p className="text-sm text-red-600">
                Deleted data cannot be recovered. Make sure to export any data you want to keep before deleting.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Deactivate Account</h4>
            <p className="text-sm text-gray-600 mb-3">
              Temporarily disable your account. You can reactivate it by logging in within 30 days.
            </p>
            <TouchOptimized>
              <button
                onClick={() => setShowDeactivateConfirm(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Deactivate Account
              </button>
            </TouchOptimized>
          </div>
          
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="font-medium text-red-700 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <TouchOptimized>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderFamilyPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Family Privacy</h2>
      
      {/* Family Permissions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Family Permissions</h3>
        
        <div className="space-y-3">
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Only</p>
                  <p className="text-sm text-gray-600">Family members can only view memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="familyPermissions"
                checked={familyDefaultPermissions === 'view'}
                onChange={() => setFamilyDefaultPermissions('view')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Comment & Like</p>
                  <p className="text-sm text-gray-600">Family members can view, comment, and like memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="familyPermissions"
                checked={familyDefaultPermissions === 'comment'}
                onChange={() => setFamilyDefaultPermissions('comment')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Full Edit Access</p>
                  <p className="text-sm text-gray-600">Family members can view, comment, like, and edit memories</p>
                </div>
              </div>
              <input
                type="radio"
                name="familyPermissions"
                checked={familyDefaultPermissions === 'edit'}
                onChange={() => setFamilyDefaultPermissions('edit')}
                className="w-5 h-5 text-sage-600 focus:ring-sage-500"
              />
            </label>
          </TouchOptimized>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              These permissions apply to new family members by default. You can always set custom permissions for individual family members.
            </p>
          </div>
        </div>
      </div>
      
      {/* Member Management */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Family Member Management</h3>
          <TouchOptimized>
            <button className="flex items-center space-x-1 text-sage-600 hover:text-sage-700 font-medium text-sm">
              <UserPlus size={16} />
              <span>Invite Member</span>
            </button>
          </TouchOptimized>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mom</p>
                <p className="text-xs text-gray-500">Family Admin • Joined 2 years ago</p>
              </div>
            </div>
            <TouchOptimized>
              <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                Manage
              </button>
            </TouchOptimized>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Dad</p>
                <p className="text-xs text-gray-500">Family Admin • Joined 2 years ago</p>
              </div>
            </div>
            <TouchOptimized>
              <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                Manage
              </button>
            </TouchOptimized>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Grandma</p>
                <p className="text-xs text-gray-500">Member • Joined 1 year ago</p>
              </div>
            </div>
            <TouchOptimized>
              <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                Manage
              </button>
            </TouchOptimized>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <TouchOptimized>
            <Link
              to="/family"
              className="text-sage-600 hover:text-sage-700 font-medium"
            >
              View All Family Members
            </Link>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Invitation Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitation Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-Accept Members</p>
              <p className="text-sm text-gray-600">
                Automatically accept new family members without approval
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoAcceptMembers}
                onChange={() => setAutoAcceptMembers(!autoAcceptMembers)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Require Admin Approval</p>
              <p className="text-sm text-gray-600">
                New members must be approved by a family admin
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={requireApproval}
                onChange={() => setRequireApproval(!requireApproval)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Allow Member Invitations</p>
              <p className="text-sm text-gray-600">
                Let family members invite others to join
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={allowMemberInvites}
                onChange={() => setAllowMemberInvites(!allowMemberInvites)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Family Agreement */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Agreement</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <p className="font-medium text-gray-900 mb-2">Current Agreement</p>
          <p className="text-sm text-gray-600 mb-3">
            Your family has agreed to the following terms for sharing and managing memories:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Respect each other's privacy preferences</li>
            <li>Ask permission before sharing sensitive memories</li>
            <li>Be mindful of what memories are appropriate to share</li>
            <li>Communicate openly about privacy concerns</li>
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <TouchOptimized>
            <button className="px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors">
              Edit Agreement
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View History
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderThirdPartyIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Integrations</h2>
      
      {/* Connected Apps */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connected Apps</h3>
          <TouchOptimized>
            <button
              onClick={() => setShowConnectedApps(!showConnectedApps)}
              className="text-sage-600 hover:text-sage-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>{showConnectedApps ? 'Hide Details' : 'Show Details'}</span>
              {showConnectedApps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </TouchOptimized>
        </div>
        
        <div className="space-y-4">
          {connectedApps.map(app => (
            <div key={app.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                    {app.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{app.name}</p>
                    <p className="text-xs text-gray-500">Connected on {app.connectedOn}</p>
                  </div>
                </div>
                <TouchOptimized>
                  <button
                    onClick={() => handleRevokeApp(app.id)}
                    className="px-3 py-1 text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Revoke
                  </button>
                </TouchOptimized>
              </div>
              
              {showConnectedApps && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {app.permissions.map((permission, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check size={14} className="text-green-600" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Last accessed: {app.lastAccess}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {connectedApps.length === 0 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No connected apps</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Connected apps can access your MemoryMesh data based on the permissions you've granted. You can revoke access at any time.
            </p>
          </div>
        </div>
      </div>
      
      {/* Data Sharing */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Share Data with Third Parties</p>
              <p className="text-sm text-gray-600">
                Allow MemoryMesh to share anonymized data with third parties for service improvement
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={shareWithThirdParties}
                onChange={() => setShareWithThirdParties(!shareWithThirdParties)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Allow API Access</p>
              <p className="text-sm text-gray-600">
                Enable third-party applications to access your data via API
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={false}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Usage Analytics</p>
              <p className="text-sm text-gray-600">
                Share anonymous usage data to help improve MemoryMesh
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={true}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-700 mb-1">Data Sharing Notice</p>
              <p className="text-sm text-yellow-600">
                When enabled, anonymized data may be shared with trusted partners to improve our services. No personally identifiable information is ever shared without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Integration Audit */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Audit Log</h3>
        
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-900">Google Photos Connected</p>
              <span className="text-xs text-gray-500">2024-06-15 10:30 AM</span>
            </div>
            <p className="text-sm text-gray-600">
              Connected Google Photos with read and upload permissions
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-900">Facebook Access Revoked</p>
              <span className="text-xs text-gray-500">2024-05-20 03:15 PM</span>
            </div>
            <p className="text-sm text-gray-600">
              Revoked access for Facebook integration
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-900">API Key Generated</p>
              <span className="text-xs text-gray-500">2024-04-10 09:45 AM</span>
            </div>
            <p className="text-sm text-gray-600">
              Generated new API key for developer access
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <TouchOptimized>
            <button className="text-sage-600 hover:text-sage-700 font-medium">
              View Full Audit Log
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderComplianceFeatures = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Compliance</h2>
      
      {/* Data Rights */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Data Rights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Right to Access</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              You have the right to access all personal data we have about you.
            </p>
            <TouchOptimized>
              <button
                onClick={() => setActiveSection('data-controls')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Export Your Data
              </button>
            </TouchOptimized>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="font-medium text-gray-900">Right to Erasure</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              You have the right to request deletion of your personal data.
            </p>
            <TouchOptimized>
              <button
                onClick={() => setActiveSection('data-controls')}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Delete Your Data
              </button>
            </TouchOptimized>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Right to Portability</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              You have the right to receive your data in a portable format.
            </p>
            <TouchOptimized>
              <button
                onClick={() => setActiveSection('data-controls')}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Export in Portable Format
              </button>
            </TouchOptimized>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <X className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Right to Object</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              You have the right to object to processing of your personal data.
            </p>
            <TouchOptimized>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Manage Processing Preferences
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Consent Management */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consent Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Processing Consent</p>
              <p className="text-sm text-gray-600">
                Allow MemoryMesh to process your personal data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={true}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-600">
                Receive marketing emails and promotions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={false}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Cookies & Tracking</p>
              <p className="text-sm text-gray-600">
                Allow cookies and tracking technologies
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={true}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Research & Improvement</p>
              <p className="text-sm text-gray-600">
                Allow your data to be used for product improvement
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={true}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700 mb-1">Consent History</p>
              <p className="text-sm text-blue-600">
                You last updated your consent preferences on June 15, 2024. You can update your preferences at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Privacy Policies */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Policies & Terms</h3>
        
        <div className="space-y-3">
          <TouchOptimized>
            <Link
              to="/privacy-policy"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Privacy Policy</p>
                  <p className="text-sm text-gray-600">Last updated: June 1, 2024</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          </TouchOptimized>
          
          <TouchOptimized>
            <Link
              to="/terms-of-service"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Terms of Service</p>
                  <p className="text-sm text-gray-600">Last updated: May 15, 2024</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          </TouchOptimized>
          
          <TouchOptimized>
            <Link
              to="/data-processing-agreement"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Data Processing Agreement</p>
                  <p className="text-sm text-gray-600">Last updated: May 15, 2024</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          </TouchOptimized>
          
          <TouchOptimized>
            <Link
              to="/cookie-policy"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cookie Policy</p>
                  <p className="text-sm text-gray-600">Last updated: May 15, 2024</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderCaregiverPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Caregiver Privacy</h2>
      
      {/* Caregiver Access */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Caregiver Access</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={caregiverAccess}
              onChange={() => setCaregiverAccess(!caregiverAccess)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>
        
        {caregiverAccess ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="caregiverEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Caregiver Email
              </label>
              <input
                id="caregiverEmail"
                type="email"
                value={caregiverEmail}
                onChange={(e) => setCaregiverEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="Enter caregiver's email address"
              />
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Caregiver Permissions
              </p>
              <div className="space-y-2">
                <TouchOptimized>
                  <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={caregiverPermissions.includes('view')}
                      onChange={() => {
                        if (caregiverPermissions.includes('view')) {
                          setCaregiverPermissions(caregiverPermissions.filter(p => p !== 'view'));
                        } else {
                          setCaregiverPermissions([...caregiverPermissions, 'view']);
                        }
                      }}
                      className="rounded text-sage-600 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-700">View memories</span>
                  </label>
                </TouchOptimized>
                
                <TouchOptimized>
                  <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={caregiverPermissions.includes('upload')}
                      onChange={() => {
                        if (caregiverPermissions.includes('upload')) {
                          setCaregiverPermissions(caregiverPermissions.filter(p => p !== 'upload'));
                        } else {
                          setCaregiverPermissions([...caregiverPermissions, 'upload']);
                        }
                      }}
                      className="rounded text-sage-600 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-700">Upload memories</span>
                  </label>
                </TouchOptimized>
                
                <TouchOptimized>
                  <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={caregiverPermissions.includes('manage')}
                      onChange={() => {
                        if (caregiverPermissions.includes('manage')) {
                          setCaregiverPermissions(caregiverPermissions.filter(p => p !== 'manage'));
                        } else {
                          setCaregiverPermissions([...caregiverPermissions, 'manage']);
                        }
                      }}
                      className="rounded text-sage-600 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-700">Manage account settings</span>
                  </label>
                </TouchOptimized>
                
                <TouchOptimized>
                  <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={caregiverPermissions.includes('family')}
                      onChange={() => {
                        if (caregiverPermissions.includes('family')) {
                          setCaregiverPermissions(caregiverPermissions.filter(p => p !== 'family'));
                        } else {
                          setCaregiverPermissions([...caregiverPermissions, 'family']);
                        }
                      }}
                      className="rounded text-sage-600 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-700">Manage family members</span>
                  </label>
                </TouchOptimized>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Emergency Access</p>
                <p className="text-sm text-gray-600">
                  Allow caregiver to access your account in emergencies
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emergencyAccess}
                  onChange={() => setEmergencyAccess(!emergencyAccess)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
              </label>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">No caregiver access configured</p>
            <p className="text-sm text-gray-500 mb-4">
              Enable caregiver access to allow a trusted person to help manage your memories and account.
            </p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Caregiver access allows a trusted person to help manage your memories and account. They will receive an email invitation to access your account with the permissions you specify.
            </p>
          </div>
        </div>
      </div>
      
      {/* Medical Data Sharing */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Data Sharing</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Healthcare Provider Access</p>
              <p className="text-sm text-gray-600">
                Allow healthcare providers to access memory data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={false}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Memory Game Results Sharing</p>
              <p className="text-sm text-gray-600">
                Share cognitive game results with healthcare providers
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={false}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Health Data Integration</p>
              <p className="text-sm text-gray-600">
                Connect with health apps and services
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={false}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700 mb-1">HIPAA Compliance</p>
              <p className="text-sm text-blue-600">
                When healthcare provider access is enabled, your data is handled in accordance with HIPAA regulations to ensure your medical information remains private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Confidentiality */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Confidentiality</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <p className="font-medium text-gray-900 mb-2">Confidentiality Agreement</p>
          <p className="text-sm text-gray-600 mb-3">
            Any healthcare professionals or caregivers with access to your account are bound by the following confidentiality terms:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>All accessed information will be kept strictly confidential</li>
            <li>Data will only be used for care-related purposes</li>
            <li>No sharing of information with unauthorized parties</li>
            <li>Compliance with all applicable privacy laws and regulations</li>
            <li>Immediate reporting of any potential data breaches</li>
          </ul>
        </div>
        
        <TouchOptimized>
          <button className="px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors">
            View Full Agreement
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
  
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
      
      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>
        
        {twoFactorEnabled ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 mb-1">Two-Factor Authentication is Enabled</p>
                <p className="text-sm text-green-600">
                  Your account is protected with an extra layer of security. You'll need to enter a verification code when signing in from a new device.
                </p>
                <div className="mt-3 flex space-x-3">
                  <TouchOptimized>
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Change Method
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button className="px-3 py-1.5 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                      Backup Codes
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication. You'll need to enter a verification code when signing in from a new device.
            </p>
            <TouchOptimized>
              <button className="px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors">
                Enable Two-Factor Authentication
              </button>
            </TouchOptimized>
          </div>
        )}
      </div>
      
      {/* Password Security */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Security</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-900">Password Last Changed</p>
            <span className="text-sm text-gray-600">
              {passwordLastChanged ? passwordLastChanged.toLocaleDateString() : 'Never'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className={`h-2.5 rounded-full ${
                passwordLastChanged && new Date().getTime() - passwordLastChanged.getTime() < 90 * 24 * 60 * 60 * 1000
                  ? 'bg-green-600'
                  : 'bg-yellow-600'
              }`}
              style={{ 
                width: passwordLastChanged 
                  ? `${Math.min(100, 100 - (new Date().getTime() - passwordLastChanged.getTime()) / (180 * 24 * 60 * 60 * 10))}%` 
                  : '0%' 
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {passwordLastChanged && new Date().getTime() - passwordLastChanged.getTime() > 90 * 24 * 60 * 60 * 1000
              ? 'We recommend changing your password every 90 days for optimal security.'
              : 'Your password was changed recently. Good job keeping your account secure!'}
          </p>
        </div>
        
        <TouchOptimized>
          <button className="px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors">
            Change Password
          </button>
        </TouchOptimized>
      </div>
      
      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
        
        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <p className="font-medium text-gray-900">{session.device}</p>
                  {session.current && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                      Current
                    </span>
                  )}
                </div>
                {!session.current && (
                  <TouchOptimized>
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Revoke
                    </button>
                  </TouchOptimized>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{session.location}</span>
                <span>
                  Last active: {session.lastActive.toLocaleDateString()} {session.lastActive.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex space-x-3">
          <TouchOptimized>
            <button
              onClick={() => {
                // Revoke all sessions except current
                setActiveSessions(prev => prev.filter(session => session.current));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out All Other Devices
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View Login History
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Login Alerts */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Login Alerts</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={loginAlerts}
              onChange={() => setLoginAlerts(!loginAlerts)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>
        
        <p className="text-gray-600 mb-4">
          Receive email alerts when someone logs into your account from a new device or location.
        </p>
        
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Login alerts help you detect suspicious activity on your account. We recommend keeping this feature enabled for optimal security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderPrivacyDashboard();
      case 'memory-privacy':
        return renderMemoryPrivacy();
      case 'data-controls':
        return renderDataControls();
      case 'family-privacy':
        return renderFamilyPrivacy();
      case 'third-party':
        return renderThirdPartyIntegrations();
      case 'compliance':
        return renderComplianceFeatures();
      case 'caregiver':
        return renderCaregiverPrivacy();
      case 'security':
        return renderSecuritySettings();
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privacySections.map((section) => (
              <TouchOptimized key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-sage-100 p-3 rounded-lg">
                      <section.icon className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </TouchOptimized>
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy & Data</h1>
            <p className="text-lg text-gray-600">
              Control your privacy and manage your data
            </p>
          </div>
        </div>
        
        {/* Search Settings (Desktop) */}
        {!isMobile && activeSection === null && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search privacy settings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            />
          </div>
        )}
      </div>
      
      {/* Settings Content */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {/* Back Button (when in a section) */}
        {activeSection && (
          <div className="mb-4">
            <TouchOptimized>
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Privacy Settings</span>
              </button>
            </TouchOptimized>
          </div>
        )}
        
        {renderSettingsContent()}
      </div>
      
      {/* Save Button (when in a section) */}
      {activeSection && activeSection !== 'data-controls' && (
        <div className="flex justify-end mb-8">
          <TouchOptimized>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </TouchOptimized>
        </div>
      )}
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Check size={20} className="text-green-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}
      
      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Account?</h3>
            </div>
            
            <p className="text-gray-700 mb-2">
              This action <span className="font-semibold">cannot be undone</span>. All your memories, comments, and account data will be permanently deleted.
            </p>
            
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to delete your account?
            </p>
            
            <div className="flex space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
      
      {/* Deactivate Account Confirmation */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Deactivate Account?</h3>
            </div>
            
            <p className="text-gray-700 mb-2">
              Your account will be temporarily disabled. You can reactivate it by logging in within 30 days.
            </p>
            
            <p className="text-gray-700 mb-6">
              After 30 days, your account and all associated data will be permanently deleted.
            </p>
            
            <div className="flex space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleDeactivateAccount}
                  className="flex-1 bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Deactivate Account
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}