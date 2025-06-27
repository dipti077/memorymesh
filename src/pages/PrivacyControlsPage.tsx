import React, { useState } from 'react';
import { 
  Shield, Lock, Eye, Users, Database, Download, Trash2, 
  Settings, Bell, AlertCircle, FileText, Check, X, 
  ChevronRight, ChevronDown, ChevronUp, Filter, Search,
  User, MessageCircle, Calendar, Clock, Smartphone, 
  ExternalLink, ToggleLeft, ToggleRight, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useAuth } from '../hooks/useAuth';

export function PrivacyControlsPage() {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Privacy Settings
  const [defaultVisibility, setDefaultVisibility] = useState<'private' | 'family' | 'public'>('family');
  const [locationTagging, setLocationTagging] = useState(true);
  const [faceRecognition, setFaceRecognition] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(true);
  
  // Data Management
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState<'forever' | '5years' | '1year'>('forever');
  const [memoryExpiration, setMemoryExpiration] = useState(false);
  const [defaultExpirationDays, setDefaultExpirationDays] = useState(30);
  
  // Family Privacy
  const [familyPermissionTemplate, setFamilyPermissionTemplate] = useState<'full' | 'limited' | 'minimal'>('limited');
  const [newMemberApproval, setNewMemberApproval] = useState<'automatic' | 'admin' | 'vote'>('admin');
  const [familyAgreementAccepted, setFamilyAgreementAccepted] = useState(false);
  
  // Caregiver Privacy
  const [caregiverAccess, setCaregiverAccess] = useState(false);
  const [caregiverPermissions, setCaregiverPermissions] = useState<string[]>(['view', 'comment']);
  const [emergencyAccess, setEmergencyAccess] = useState(false);
  
  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes
  
  // Connected Services
  const [connectedServices, setConnectedServices] = useState([
    { id: 'google', name: 'Google Photos', connected: true, lastSync: '2024-12-01' },
    { id: 'facebook', name: 'Facebook', connected: false, lastSync: null },
    { id: 'apple', name: 'iCloud', connected: true, lastSync: '2024-12-10' }
  ]);
  
  // Compliance
  const [gdprConsent, setGdprConsent] = useState(true);
  const [ccpaConsent, setCcpaConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  
  const handleDisconnectService = (serviceId: string) => {
    setConnectedServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, connected: false, lastSync: null } 
          : service
      )
    );
  };
  
  const handleDeleteAllData = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDeleteAllData = () => {
    // In a real app, this would delete all user data
    console.log('Deleting all user data...');
    setShowDeleteConfirm(false);
    
    // Show confirmation
    alert('All your data has been scheduled for deletion. This process may take up to 30 days to complete.');
  };
  
  const privacySections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: Shield,
      description: 'Your privacy at a glance'
    },
    {
      id: 'memory-privacy',
      title: 'Memory-Level Privacy',
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
      id: 'integrations',
      title: 'Third-Party Integrations',
      icon: ExternalLink,
      description: 'Manage connected services'
    },
    {
      id: 'compliance',
      title: 'Compliance & Consent',
      icon: Check,
      description: 'Legal compliance settings'
    },
    {
      id: 'caregiver',
      title: 'Caregiver Privacy',
      icon: HelpCircle,
      description: 'Healthcare provider access'
    },
    {
      id: 'security',
      title: 'Security Features',
      icon: Lock,
      description: 'Protect your account'
    }
  ];
  
  const renderPrivacyOverview = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Overview</h2>
      
      {/* Privacy Score */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Privacy Score</h3>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Good
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">85/100</span>
            <span className="text-xs text-gray-500">Last updated: Today</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">Strong</div>
            <div className="text-sm text-gray-600">Account Security</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Good</div>
            <div className="text-sm text-gray-600">Data Controls</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">Needs Attention</div>
            <div className="text-sm text-gray-600">Third-Party Access</div>
          </div>
        </div>
      </div>
      
      {/* Quick Privacy Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('data-controls')}
              className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-200 hover:bg-sage-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-sage-700" />
                <span className="font-medium text-gray-900">Download Your Data</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('memory-privacy')}
              className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-200 hover:bg-sage-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-sage-700" />
                <span className="font-medium text-gray-900">Privacy Checkup</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('security')}
              className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-200 hover:bg-sage-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-sage-700" />
                <span className="font-medium text-gray-900">Security Checkup</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setActiveSection('integrations')}
              className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-200 hover:bg-sage-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-sage-700" />
                <span className="font-medium text-gray-900">Manage Connected Apps</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Recent Privacy Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Privacy Activity</h3>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 divide-y divide-gray-100">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Password Changed</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <TouchOptimized>
                <button className="text-sm text-sage-600 hover:text-sage-700">
                  Details
                </button>
              </TouchOptimized>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Data Export Completed</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <TouchOptimized>
                <button className="text-sm text-sage-600 hover:text-sage-700">
                  Details
                </button>
              </TouchOptimized>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Family Privacy Updated</p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
              <TouchOptimized>
                <button className="text-sm text-sage-600 hover:text-sage-700">
                  Details
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>
      
      {/* Privacy Audit Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Privacy Audit Log</h3>
          <TouchOptimized>
            <button className="text-sm text-sage-600 hover:text-sage-700 font-medium">
              View All
            </button>
          </TouchOptimized>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Track all privacy-related changes to your account
          </p>
          <TouchOptimized>
            <button className="text-sage-600 hover:text-sage-700 font-medium text-sm">
              Download Audit Log
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderMemoryPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Memory-Level Privacy</h2>
      
      {/* Default Memory Visibility */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Default Memory Visibility
        </label>
        <div className="space-y-3">
          <TouchOptimized>
            <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-sage-300 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'private'}
                onChange={() => setDefaultVisibility('private')}
                className="w-4 h-4 text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="font-medium text-gray-900">Private</span>
                <p className="text-sm text-gray-600">Only you can see these memories</p>
              </div>
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-sage-300 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'family'}
                onChange={() => setDefaultVisibility('family')}
                className="w-4 h-4 text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="font-medium text-gray-900">Family Only</span>
                <p className="text-sm text-gray-600">Only your family members can see these memories</p>
              </div>
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-sage-300 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'public'}
                onChange={() => setDefaultVisibility('public')}
                className="w-4 h-4 text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="font-medium text-gray-900">Public</span>
                <p className="text-sm text-gray-600">Anyone with the link can see these memories</p>
              </div>
            </label>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Granular Permissions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700">Granular Family Permissions</h3>
          <TouchOptimized>
            <button className="text-sm text-sage-600 hover:text-sage-700 font-medium">
              Edit
            </button>
          </TouchOptimized>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-2 font-medium text-gray-700">Family Member</div>
              <div className="text-center font-medium text-gray-700">View</div>
              <div className="text-center font-medium text-gray-700">Comment</div>
              <div className="text-center font-medium text-gray-700">Download</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Mom', view: true, comment: true, download: true },
              { name: 'Dad', view: true, comment: true, download: true },
              { name: 'Grandma', view: true, comment: true, download: false },
              { name: 'Uncle John', view: true, comment: false, download: false }
            ].map((member, index) => (
              <div key={index} className="p-4">
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-sage-600" />
                    </div>
                    <span className="font-medium text-gray-900">{member.name}</span>
                  </div>
                  <div className="text-center">
                    <input
                      type="checkbox"
                      checked={member.view}
                      readOnly
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                  </div>
                  <div className="text-center">
                    <input
                      type="checkbox"
                      checked={member.comment}
                      readOnly
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                  </div>
                  <div className="text-center">
                    <input
                      type="checkbox"
                      checked={member.download}
                      readOnly
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Private Collections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700">Private Memory Collections</h3>
          <TouchOptimized>
            <button className="flex items-center space-x-1 text-sm text-sage-600 hover:text-sage-700 font-medium">
              <Plus size={16} />
              <span>Create New</span>
            </button>
          </TouchOptimized>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-sage-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Personal Memories</h4>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                12 items
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Private collection only visible to you
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Created 3 months ago</span>
              <TouchOptimized>
                <button className="text-sm text-sage-600 hover:text-sage-700">
                  Manage
                </button>
              </TouchOptimized>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-sage-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Medical Records</h4>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                5 items
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Shared with healthcare providers only
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Created 1 month ago</span>
              <TouchOptimized>
                <button className="text-sm text-sage-600 hover:text-sage-700">
                  Manage
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>
      
      {/* Temporary Sharing */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Temporary Sharing Links</h3>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-3">
            Create temporary links to share memories with people outside your family
          </p>
          <TouchOptimized>
            <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
              <Plus size={16} />
              <span>Create Sharing Link</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Memory Expiration */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700">Memory Expiration</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={memoryExpiration}
              onChange={() => setMemoryExpiration(!memoryExpiration)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>
        
        {memoryExpiration && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-3">
              Set a default expiration period for new memories
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="365"
                value={defaultExpirationDays}
                onChange={(e) => setDefaultExpirationDays(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              />
              <span className="text-gray-700">days after upload</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              After this period, memories will be automatically archived and only visible to you
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderDataControls = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Data Controls</h2>
      
      {/* Data Overview */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Your Data Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">247</div>
            <div className="text-sm text-gray-600">Total Memories</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">1.2 GB</div>
            <div className="text-sm text-gray-600">Storage Used</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">83</div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">Connected Apps</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last updated: Today at 10:45 AM</span>
          <TouchOptimized>
            <button className="text-sm text-sage-600 hover:text-sage-700 font-medium">
              Refresh
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Data Export */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Export Your Data</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Download a copy of all your data in a machine-readable format
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="export-memories"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="export-memories" className="text-sm text-gray-700">
                Memories (photos, videos, audio, stories)
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="export-comments"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="export-comments" className="text-sm text-gray-700">
                Comments & interactions
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="export-profile"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="export-profile" className="text-sm text-gray-700">
                Profile information
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="export-activity"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="export-activity" className="text-sm text-gray-700">
                Activity history
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
                <Download size={16} />
                <span>Request Data Export</span>
              </button>
            </TouchOptimized>
            <p className="text-xs text-gray-500 mt-2">
              Export will be prepared and emailed to you within 48 hours
            </p>
          </div>
        </div>
      </div>
      
      {/* Selective Deletion */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Selective Data Deletion</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Delete specific types of data from your account
          </p>
          
          <div className="space-y-3">
            <TouchOptimized>
              <Link
                to="/search?filter=deletable"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Delete by date range</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </TouchOptimized>
            
            <TouchOptimized>
              <Link
                to="/search?filter=deletable&type=location"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Delete by location</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </TouchOptimized>
            
            <TouchOptimized>
              <Link
                to="/search?filter=deletable&type=person"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Delete by person</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </TouchOptimized>
            
            <TouchOptimized>
              <Link
                to="/search?filter=deletable&type=comments"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Delete comments & reactions</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Data Retention */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Data Retention</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose how long we keep your data
          </p>
          
          <div className="space-y-3">
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="retention"
                  checked={dataRetention === 'forever'}
                  onChange={() => setDataRetention('forever')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Keep forever</span>
                  <p className="text-xs text-gray-600">Your data will be stored indefinitely</p>
                </div>
              </label>
            </TouchOptimized>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="retention"
                  checked={dataRetention === '5years'}
                  onChange={() => setDataRetention('5years')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Keep for 5 years</span>
                  <p className="text-xs text-gray-600">Data older than 5 years will be automatically deleted</p>
                </div>
              </label>
            </TouchOptimized>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="retention"
                  checked={dataRetention === '1year'}
                  onChange={() => setDataRetention('1year')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Keep for 1 year</span>
                  <p className="text-xs text-gray-600">Data older than 1 year will be automatically deleted</p>
                </div>
              </label>
            </TouchOptimized>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Note: Changing this setting will not affect data that has already been shared with family members
          </p>
        </div>
      </div>
      
      {/* Account Deactivation */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Account Deactivation</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Temporarily deactivate your account
          </p>
          
          <TouchOptimized>
            <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Smartphone size={16} />
              <span>Deactivate Account</span>
            </button>
          </TouchOptimized>
          <p className="text-xs text-gray-500 mt-2">
            Your account will be hidden from other family members but not deleted
          </p>
        </div>
      </div>
      
      {/* Complete Account Deletion */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Delete All Data</h3>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-start space-x-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Danger Zone</p>
              <p className="text-sm text-red-700">
                This will permanently delete all your data and cannot be undone
              </p>
            </div>
          </div>
          
          <TouchOptimized>
            <button
              onClick={handleDeleteAllData}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete All My Data</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderFamilyPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Family Privacy</h2>
      
      {/* Family-wide Privacy Defaults */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Family-wide Privacy Defaults</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Set default privacy settings for all family members
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Memory Visibility
              </label>
              <select
                value={defaultVisibility}
                onChange={(e) => setDefaultVisibility(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                <option value="private">Private (creator only)</option>
                <option value="family">Family Only</option>
                <option value="public">Public (anyone with link)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location Tagging
                </label>
                <p className="text-xs text-gray-500">
                  Automatically add location data to memories
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={locationTagging}
                  onChange={() => setLocationTagging(!locationTagging)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Face Recognition
                </label>
                <p className="text-xs text-gray-500">
                  Allow AI to recognize family members in photos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={faceRecognition}
                  onChange={() => setFaceRecognition(!faceRecognition)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Member Permission Templates */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">New Member Permission Templates</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Set default permissions for new family members
          </p>
          
          <div className="space-y-3">
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="permissionTemplate"
                  checked={familyPermissionTemplate === 'full'}
                  onChange={() => setFamilyPermissionTemplate('full')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Full Access</span>
                  <p className="text-xs text-gray-600">Can view, comment, download, and share all memories</p>
                </div>
              </label>
            </TouchOptimized>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="permissionTemplate"
                  checked={familyPermissionTemplate === 'limited'}
                  onChange={() => setFamilyPermissionTemplate('limited')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Limited Access</span>
                  <p className="text-xs text-gray-600">Can view and comment, but not download or share</p>
                </div>
              </label>
            </TouchOptimized>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="permissionTemplate"
                  checked={familyPermissionTemplate === 'minimal'}
                  onChange={() => setFamilyPermissionTemplate('minimal')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Minimal Access</span>
                  <p className="text-xs text-gray-600">Can only view memories, no comments or downloads</p>
                </div>
              </label>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* New Member Approval */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">New Member Approval</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            How new family members are approved
          </p>
          
          <div className="space-y-3">
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="memberApproval"
                  checked={newMemberApproval === 'automatic'}
                  onChange={() => setNewMemberApproval('automatic')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Automatic</span>
                  <p className="text-xs text-gray-600">Anyone with an invitation link can join</p>
                </div>
              </label>
            </TouchOptimized>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="memberApproval"
                  checked={newMemberApproval === 'admin'}
                  onChange={() => setNewMemberApproval('admin')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Admin Approval</span>
                  <p className="text-xs text-gray-600">Family admins must approve new members</p>
                </div>
              </label>
            </TouchOptimized>
            
            <TouchOptimized>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="memberApproval"
                  checked={newMemberApproval === 'vote'}
                  onChange={() => setNewMemberApproval('vote')}
                  className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Family Vote</span>
                  <p className="text-xs text-gray-600">Majority of family members must approve</p>
                </div>
              </label>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Family Agreement */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Family Privacy Agreement</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Create a privacy agreement for your family to follow
          </p>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${
              familyAgreementAccepted ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <FileText className={`w-5 h-5 ${
                familyAgreementAccepted ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Family Privacy Agreement</p>
              <p className="text-xs text-gray-500">
                {familyAgreementAccepted 
                  ? 'Accepted by all family members' 
                  : 'Not yet accepted by all family members'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
                <Eye size={16} />
                <span>View Agreement</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit size={16} />
                <span>Edit Agreement</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Bulk Privacy Updates */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Bulk Privacy Updates</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Update privacy settings for multiple memories at once
          </p>
          
          <TouchOptimized>
            <Link
              to="/search?bulk=privacy"
              className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
            >
              <Settings size={16} />
              <span>Bulk Privacy Editor</span>
            </Link>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Integrations</h2>
      
      {/* Connected Services */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Connected Services</h3>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {connectedServices.map((service, index) => (
            <div 
              key={service.id} 
              className={`p-4 ${index < connectedServices.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    service.connected ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <ExternalLink className={`w-5 h-5 ${
                      service.connected ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">
                      {service.connected 
                        ? `Last synced: ${service.lastSync}` 
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                
                {service.connected ? (
                  <TouchOptimized>
                    <button
                      onClick={() => handleDisconnectService(service.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  </TouchOptimized>
                ) : (
                  <TouchOptimized>
                    <button className="text-sage-600 hover:text-sage-700 text-sm font-medium">
                      Connect
                    </button>
                  </TouchOptimized>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* API Access */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">API Access</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Manage developer API access to your data
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Developer API Access</p>
              <p className="text-xs text-gray-500">Allow third-party apps to access your data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={false}
                readOnly
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              No API keys have been generated yet
            </p>
          </div>
        </div>
      </div>
      
      {/* Data Sharing Agreements */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Data Sharing Agreements</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Review how third-party services use your data
          </p>
          
          <div className="space-y-3">
            {connectedServices.filter(s => s.connected).map(service => (
              <div key={service.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <TouchOptimized>
                    <button className="text-sm text-sage-600 hover:text-sage-700">
                      View Details
                    </button>
                  </TouchOptimized>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Agreement accepted on {service.lastSync}</span>
                </div>
              </div>
            ))}
            
            {connectedServices.filter(s => s.connected).length === 0 && (
              <p className="text-sm text-gray-600">
                No active data sharing agreements
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Integration Audit Trail */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Integration Audit Trail</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Track all third-party access to your data
          </p>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">Google Photos</p>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600">Accessed 15 photos for sync</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">iCloud</p>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
              <p className="text-sm text-gray-600">Accessed 8 photos for backup</p>
            </div>
          </div>
          
          <TouchOptimized>
            <button className="text-sm text-sage-600 hover:text-sage-700 font-medium mt-3">
              View Full Audit Trail
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderCompliance = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Compliance & Consent</h2>
      
      {/* GDPR Compliance */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">GDPR Compliance</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">GDPR Data Processing Consent</p>
              <p className="text-sm text-gray-600">
                Allow us to process your data in accordance with GDPR
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={gdprConsent}
                onChange={() => setGdprConsent(!gdprConsent)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to access your data</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to correct your data</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to delete your data</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to data portability</span>
            </div>
          </div>
          
          <TouchOptimized>
            <button className="text-sm text-sage-600 hover:text-sage-700 font-medium mt-3">
              View GDPR Policy
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* CCPA Compliance */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">CCPA Privacy Rights</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">CCPA Data Processing Consent</p>
              <p className="text-sm text-gray-600">
                California Consumer Privacy Act rights
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={ccpaConsent}
                onChange={() => setCcpaConsent(!ccpaConsent)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to know what data is collected</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to delete your data</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to opt-out of data sales</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Right to non-discrimination</span>
            </div>
          </div>
          
          <TouchOptimized>
            <button className="text-sm text-sage-600 hover:text-sage-700 font-medium mt-3">
              View CCPA Policy
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Marketing Consent */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Marketing Preferences</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-600">
                Receive updates about new features and offers
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={marketingConsent}
                onChange={() => setMarketingConsent(!marketingConsent)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            You can unsubscribe at any time by clicking the link in the footer of our emails
          </p>
        </div>
      </div>
      
      {/* Analytics Consent */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Analytics & Improvements</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">Usage Analytics</p>
              <p className="text-sm text-gray-600">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={analyticsConsent}
                onChange={() => setAnalyticsConsent(!analyticsConsent)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            We never collect or analyze the content of your memories
          </p>
        </div>
      </div>
      
      {/* Privacy Policy Acceptance */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Privacy Policy</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Privacy Policy</p>
              <p className="text-sm text-gray-600">
                Last accepted: December 15, 2024
              </p>
            </div>
          </div>
          
          <TouchOptimized>
            <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
              <Eye size={16} />
              <span>View Privacy Policy</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderCaregiverPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Caregiver Privacy</h2>
      
      {/* Healthcare Provider Access */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700">Healthcare Provider Access</h3>
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
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-4">
              Allow healthcare providers to access specific memories
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caregiver Email
                </label>
                <input
                  type="email"
                  placeholder="Enter caregiver's email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Permissions
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="perm-view"
                      checked={caregiverPermissions.includes('view')}
                      onChange={() => {
                        if (caregiverPermissions.includes('view')) {
                          setCaregiverPermissions(prev => prev.filter(p => p !== 'view'));
                        } else {
                          setCaregiverPermissions(prev => [...prev, 'view']);
                        }
                      }}
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                    <label htmlFor="perm-view" className="text-sm text-gray-700">
                      View memories
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="perm-comment"
                      checked={caregiverPermissions.includes('comment')}
                      onChange={() => {
                        if (caregiverPermissions.includes('comment')) {
                          setCaregiverPermissions(prev => prev.filter(p => p !== 'comment'));
                        } else {
                          setCaregiverPermissions(prev => [...prev, 'comment']);
                        }
                      }}
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                    <label htmlFor="perm-comment" className="text-sm text-gray-700">
                      Add comments
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="perm-download"
                      checked={caregiverPermissions.includes('download')}
                      onChange={() => {
                        if (caregiverPermissions.includes('download')) {
                          setCaregiverPermissions(prev => prev.filter(p => p !== 'download'));
                        } else {
                          setCaregiverPermissions(prev => [...prev, 'download']);
                        }
                      }}
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                    <label htmlFor="perm-download" className="text-sm text-gray-700">
                      Download memories
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="perm-upload"
                      checked={caregiverPermissions.includes('upload')}
                      onChange={() => {
                        if (caregiverPermissions.includes('upload')) {
                          setCaregiverPermissions(prev => prev.filter(p => p !== 'upload'));
                        } else {
                          setCaregiverPermissions(prev => [...prev, 'upload']);
                        }
                      }}
                      className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                    />
                    <label htmlFor="perm-upload" className="text-sm text-gray-700">
                      Upload new memories
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Duration
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>Indefinite</option>
                </select>
              </div>
              
              <TouchOptimized>
                <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
                  <Plus size={16} />
                  <span>Add Caregiver</span>
                </button>
              </TouchOptimized>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Enable this feature to allow healthcare providers to access specific memories
            </p>
          </div>
        )}
      </div>
      
      {/* Medical Data Sharing */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Medical Data Sharing</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Control how medical-related memories are shared
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Medical Tag Privacy</p>
                <p className="text-xs text-gray-500">
                  Memories tagged as "medical" are only visible to you
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={true}
                  readOnly
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">HIPAA Compliance</p>
                <p className="text-xs text-gray-500">
                  Enable additional protections for health information
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={true}
                  readOnly
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Caregiver Oversight */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Caregiver Oversight</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Set boundaries for caregiver access
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caregiver Activity Logging
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                <option>Log all activity</option>
                <option>Log access only</option>
                <option>Log changes only</option>
                <option>No logging</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Caregiver Notifications</p>
                <p className="text-xs text-gray-500">
                  Notify you when caregivers access your memories
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={true}
                  readOnly
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emergency Access */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700">Emergency Access</h3>
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
        
        {emergencyAccess ? (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-4">
              Designate trusted contacts who can access your account in an emergency
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waiting Period
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option>No waiting period</option>
                  <option>24 hours</option>
                  <option>3 days</option>
                  <option>7 days</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Time before emergency access is granted after a request
                </p>
              </div>
              
              <TouchOptimized>
                <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
                  <Plus size={16} />
                  <span>Add Emergency Contact</span>
                </button>
              </TouchOptimized>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Enable this feature to allow emergency access to your account
            </p>
          </div>
        )}
      </div>
      
      {/* Professional Confidentiality */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Professional Confidentiality</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Set up confidentiality agreements for professional caregivers
          </p>
          
          <TouchOptimized>
            <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
              <FileText size={16} />
              <span>Create Confidentiality Agreement</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Features</h2>
      
      {/* Two-Factor Authentication */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700">Two-Factor Authentication</h3>
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
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Two-factor authentication is enabled</p>
                <p className="text-xs text-gray-500">
                  Your account is protected with an extra layer of security
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Method
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option>SMS Text Message</option>
                  <option>Authenticator App</option>
                  <option>Email</option>
                  <option>Security Key</option>
                </select>
              </div>
              
              <TouchOptimized>
                <button className="text-sm text-sage-600 hover:text-sage-700 font-medium">
                  Change 2FA Settings
                </button>
              </TouchOptimized>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Your account is less secure</p>
                <p className="text-sm text-yellow-700">
                  Enable two-factor authentication to protect your account
                </p>
              </div>
            </div>
            
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                <Shield size={16} />
                <span>Enable 2FA</span>
              </button>
            </TouchOptimized>
          </div>
        )}
      </div>
      
      {/* Login History */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Login History</h3>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium text-gray-700">Device</div>
              <div className="font-medium text-gray-700">Location</div>
              <div className="font-medium text-gray-700">Time</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {[
              { device: 'iPhone 15', location: 'New York, NY', time: '2 hours ago', current: true },
              { device: 'MacBook Pro', location: 'New York, NY', time: '1 day ago', current: false },
              { device: 'iPad', location: 'Boston, MA', time: '3 days ago', current: false }
            ].map((login, index) => (
              <div key={index} className="p-4">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{login.device}</span>
                    {login.current && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700">{login.location}</div>
                  <div className="text-gray-700">{login.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
            <TouchOptimized>
              <button className="text-sm text-sage-600 hover:text-sage-700 font-medium">
                View Full Login History
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Suspicious Activity Alerts */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Security Alerts</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Suspicious Activity Alerts</p>
              <p className="text-sm text-gray-600">
                Get notified about unusual account activity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={loginNotifications}
                onChange={() => setLoginNotifications(!loginNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="alert-new-device"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="alert-new-device" className="text-sm text-gray-700">
                New device login
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="alert-new-location"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="alert-new-location" className="text-sm text-gray-700">
                Login from new location
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="alert-password"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="alert-password" className="text-sm text-gray-700">
                Password changes
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="alert-failed"
                checked={true}
                readOnly
                className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
              />
              <label htmlFor="alert-failed" className="text-sm text-gray-700">
                Failed login attempts
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Requirements */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Password Security</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-4">
            Your password must meet these requirements
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">At least 8 characters</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">At least one uppercase letter</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">At least one number</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">At least one special character</span>
            </div>
          </div>
          
          <div className="mt-4">
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors">
                <Lock size={16} />
                <span>Change Password</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Session Management */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Session Management</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Auto Logout</p>
              <p className="text-sm text-gray-600">
                Automatically log out after period of inactivity
              </p>
            </div>
            <div className="w-24">
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-sm"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
          
          <TouchOptimized>
            <button className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
              <LogOut size={16} />
              <span>Log Out All Other Devices</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
  
  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderPrivacyOverview();
      case 'memory-privacy':
        return renderMemoryPrivacy();
      case 'data-controls':
        return renderDataControls();
      case 'family-privacy':
        return renderFamilyPrivacy();
      case 'integrations':
        return renderIntegrations();
      case 'compliance':
        return renderCompliance();
      case 'caregiver':
        return renderCaregiverPrivacy();
      case 'security':
        return renderSecurity();
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Controls</h1>
            <p className="text-lg text-gray-600">
              Manage your data and privacy settings
            </p>
          </div>
        </div>
        
        {/* Search Settings (Desktop) */}
        {!isMobile && activeSection === null && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <span>Back to Privacy Controls</span>
              </button>
            </TouchOptimized>
          </div>
        )}
        
        {renderSettingsContent()}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete All Data?</h3>
            </div>
            
            <p className="text-gray-700 mb-2">
              This action <span className="font-semibold">cannot be undone</span>. All your memories, comments, and account data will be permanently deleted.
            </p>
            
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to delete all your data?
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
                  onClick={confirmDeleteAllData}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete All Data
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}