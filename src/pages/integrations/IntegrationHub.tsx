import React, { useState, useEffect } from 'react';
import { 
  Link as LucideLink, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  RefreshCw as Refresh, 
  Download, 
  Upload, 
  Database, 
  Shield, 
  Clock, 
  Activity, 
  Zap, 
  Globe, 
  Key, 
  Eye, 
  EyeOff, 
  FileText, 
  Calendar, 
  Pill, 
  Users, 
  CreditCard, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Square as Stop, 
  AlertCircle, 
  CheckSquare, 
  Info 
} from 'lucide-react';
import { IntegrationSetup } from '../../components/IntegrationSetup';
import { IntegrationManager } from '../../lib/integrationApi';

interface Integration {
  id: string;
  name: string;
  type: 'mhr' | 'pathology' | 'imaging' | 'pharmacy' | 'specialist' | 'billing' | 'government';
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing' | 'pending_auth' | 'maintenance';
  lastSync: string;
  icon: React.ReactNode;
  color: string;
  dataTypes: string[];
  syncFrequency: string;
  provider: string;
  version: string;
  compliance: {
    fhir: boolean;
    hl7: boolean;
    privacy: boolean;
    security: boolean;
  };
  metrics: {
    recordsProcessed: number;
    successRate: number;
    avgResponseTime: number;
    uptime: number;
  };
  configuration: {
    apiEndpoint?: string;
    authMethod: 'oauth' | 'api_key' | 'certificate';
    encryptionEnabled: boolean;
    autoSync: boolean;
    retryAttempts: number;
  };
}

interface SyncLog {
  id: string;
  integration: string;
  operation: string;
  status: 'success' | 'failed' | 'in_progress' | 'warning';
  timestamp: string;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  details: string;
  duration: number;
  errorCode?: string;
}

interface IntegrationTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  provider: string;
  icon: React.ReactNode;
  category: 'government' | 'pathology' | 'imaging' | 'pharmacy' | 'specialist' | 'billing';
  requirements: string[];
  estimatedSetupTime: string;
  complexity: 'low' | 'medium' | 'high';
  cost: 'free' | 'paid' | 'enterprise';
  authMethod: 'oauth' | 'api_key' | 'certificate';
}

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [templates, setTemplates] = useState<IntegrationTemplate[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [syncingIntegrations, setSyncingIntegrations] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      await Promise.all([
        loadIntegrations(),
        loadSyncLogs(),
        loadTemplates()
      ]);
    } catch (err) {
      setError('Failed to load integration data');
    } finally {
      setLocalLoading(false);
    }
  };

  const loadIntegrations = async () => {
    try {
      // Mock data - in production this would load from Supabase
      setIntegrations([
        {
          id: '1',
          name: 'My Health Record',
          type: 'mhr',
          description: 'National health record system integration with real-time synchronization',
          status: 'connected',
          lastSync: '2025-01-16T10:30:00Z',
          icon: <Database className="h-6 w-6" />,
          color: 'green',
          dataTypes: ['Health Records', 'Medications', 'Allergies', 'Immunizations', 'Pathology', 'Imaging'],
          syncFrequency: 'Real-time',
          provider: 'Australian Digital Health Agency',
          version: 'FHIR R4',
          compliance: {
            fhir: true,
            hl7: true,
            privacy: true,
            security: true
          },
          metrics: {
            recordsProcessed: 15420,
            successRate: 99.8,
            avgResponseTime: 245,
            uptime: 99.95
          },
          configuration: {
            apiEndpoint: 'https://api.myhealthrecord.gov.au/fhir',
            authMethod: 'oauth',
            encryptionEnabled: true,
            autoSync: true,
            retryAttempts: 3
          }
        },
        {
          id: '2',
          name: 'PathLab Australia',
          type: 'pathology',
          description: 'Automated pathology result imports with critical value alerts',
          status: 'connected',
          lastSync: '2025-01-16T08:15:00Z',
          icon: <Activity className="h-6 w-6" />,
          color: 'blue',
          dataTypes: ['Blood Tests', 'Urine Tests', 'Microbiology', 'Histopathology', 'Cytology'],
          syncFrequency: 'Every 15 minutes',
          provider: 'Sonic Healthcare',
          version: 'HL7 v2.5',
          compliance: {
            fhir: true,
            hl7: true,
            privacy: true,
            security: true
          },
          metrics: {
            recordsProcessed: 8945,
            successRate: 98.5,
            avgResponseTime: 180,
            uptime: 99.2
          },
          configuration: {
            apiEndpoint: 'https://api.pathlab.com.au/hl7',
            authMethod: 'api_key',
            encryptionEnabled: true,
            autoSync: true,
            retryAttempts: 5
          }
        },
        {
          id: '3',
          name: 'Sydney Radiology Network',
          type: 'imaging',
          description: 'Medical imaging and reports with DICOM viewer integration',
          status: 'syncing',
          lastSync: '2025-01-16T07:45:00Z',
          icon: <Zap className="h-6 w-6" />,
          color: 'yellow',
          dataTypes: ['X-rays', 'CT Scans', 'MRI', 'Ultrasound', 'Nuclear Medicine', 'DICOM Images'],
          syncFrequency: 'Hourly',
          provider: 'I-MED Radiology Network',
          version: 'DICOM 3.0',
          compliance: {
            fhir: true,
            hl7: false,
            privacy: true,
            security: true
          },
          metrics: {
            recordsProcessed: 3421,
            successRate: 97.8,
            avgResponseTime: 850,
            uptime: 98.7
          },
          configuration: {
            apiEndpoint: 'https://api.imed.com.au/dicom',
            authMethod: 'certificate',
            encryptionEnabled: true,
            autoSync: true,
            retryAttempts: 3
          }
        },
        {
          id: '4',
          name: 'TerryWhite Chemmart',
          type: 'pharmacy',
          description: 'Prescription dispensing and tracking with PBS integration',
          status: 'error',
          lastSync: '2025-01-15T16:20:00Z',
          icon: <Pill className="h-6 w-6" />,
          color: 'red',
          dataTypes: ['Prescriptions', 'Dispensing Records', 'Stock Levels', 'PBS Claims', 'Drug Interactions'],
          syncFrequency: 'Every 30 minutes',
          provider: 'TerryWhite Chemmart',
          version: 'PBS v5.1',
          compliance: {
            fhir: false,
            hl7: true,
            privacy: true,
            security: true
          },
          metrics: {
            recordsProcessed: 12567,
            successRate: 85.2,
            avgResponseTime: 320,
            uptime: 94.1
          },
          configuration: {
            apiEndpoint: 'https://api.terrywhite.com.au/pbs',
            authMethod: 'api_key',
            encryptionEnabled: true,
            autoSync: false,
            retryAttempts: 3
          }
        },
        {
          id: '5',
          name: 'Medicare Australia',
          type: 'billing',
          description: 'Bulk billing and claims processing with real-time eligibility checks',
          status: 'connected',
          lastSync: '2025-01-16T09:00:00Z',
          icon: <CreditCard className="h-6 w-6" />,
          color: 'purple',
          dataTypes: ['Claims', 'Benefits', 'Patient Eligibility', 'Provider Numbers', 'Bulk Billing'],
          syncFrequency: 'Real-time',
          provider: 'Services Australia',
          version: 'Medicare API v3.2',
          compliance: {
            fhir: false,
            hl7: false,
            privacy: true,
            security: true
          },
          metrics: {
            recordsProcessed: 25890,
            successRate: 99.9,
            avgResponseTime: 120,
            uptime: 99.99
          },
          configuration: {
            apiEndpoint: 'https://api.servicesaustralia.gov.au/medicare',
            authMethod: 'oauth',
            encryptionEnabled: true,
            autoSync: true,
            retryAttempts: 5
          }
        },
        {
          id: '6',
          name: 'Specialist Referral Network',
          type: 'specialist',
          description: 'Referral management and specialist communication platform',
          status: 'pending_auth',
          lastSync: '2025-01-14T14:30:00Z',
          icon: <Users className="h-6 w-6" />,
          color: 'gray',
          dataTypes: ['Referrals', 'Specialist Reports', 'Appointments', 'Care Plans', 'Discharge Summaries'],
          syncFrequency: 'Manual',
          provider: 'Australian Specialist Network',
          version: 'FHIR R4',
          compliance: {
            fhir: true,
            hl7: true,
            privacy: true,
            security: false
          },
          metrics: {
            recordsProcessed: 1245,
            successRate: 92.3,
            avgResponseTime: 450,
            uptime: 96.8
          },
          configuration: {
            apiEndpoint: 'https://api.specialistnetwork.com.au/fhir',
            authMethod: 'oauth',
            encryptionEnabled: false,
            autoSync: false,
            retryAttempts: 2
          }
        }
      ]);
    } catch (error) {
      console.error('Failed to load integrations:', error);
      throw error;
    }
  };

  const loadSyncLogs = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSyncLogs([
      {
        id: '1',
        integration: 'My Health Record',
        operation: 'Import Health Records',
        status: 'success',
        timestamp: '2025-01-16T10:30:00Z',
        recordsProcessed: 15,
        recordsSuccessful: 15,
        recordsFailed: 0,
        details: 'Successfully imported 15 new health records including 3 pathology results and 2 imaging reports',
        duration: 2340,
        errorCode: undefined
      },
      {
        id: '2',
        integration: 'PathLab Australia',
        operation: 'Import Lab Results',
        status: 'success',
        timestamp: '2025-01-16T08:15:00Z',
        recordsProcessed: 8,
        recordsSuccessful: 8,
        recordsFailed: 0,
        details: 'Imported 8 new pathology results including 2 critical values that triggered alerts',
        duration: 1850,
        errorCode: undefined
      },
      {
        id: '3',
        integration: 'TerryWhite Chemmart',
        operation: 'Sync Prescriptions',
        status: 'failed',
        timestamp: '2025-01-15T16:20:00Z',
        recordsProcessed: 12,
        recordsSuccessful: 0,
        recordsFailed: 12,
        details: 'Authentication failed - API key expired. All prescription sync attempts failed.',
        duration: 5000,
        errorCode: 'AUTH_001'
      },
      {
        id: '4',
        integration: 'Sydney Radiology Network',
        operation: 'Import Imaging Reports',
        status: 'in_progress',
        timestamp: '2025-01-16T11:00:00Z',
        recordsProcessed: 3,
        recordsSuccessful: 2,
        recordsFailed: 0,
        details: 'Processing 3 new imaging reports. 2 completed successfully, 1 in progress.',
        duration: 12000,
        errorCode: undefined
      },
      {
        id: '5',
        integration: 'Medicare Australia',
        operation: 'Claims Processing',
        status: 'warning',
        timestamp: '2025-01-16T09:45:00Z',
        recordsProcessed: 45,
        recordsSuccessful: 43,
        recordsFailed: 2,
        details: 'Processed 45 claims. 2 claims require manual review due to eligibility questions.',
        duration: 3200,
        errorCode: 'REVIEW_REQ'
      }
    ]);
  };

  const loadTemplates = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setTemplates([
      {
        id: 'mhr-template',
        name: 'My Health Record Integration',
        type: 'mhr',
        description: 'Connect to Australia\'s national health record system with FHIR R4 compliance',
        provider: 'Australian Digital Health Agency',
        icon: <Database className="h-5 w-5" />,
        category: 'government',
        requirements: ['Healthcare Provider Registration', 'NASH Certificate', 'Privacy Impact Assessment', 'FHIR R4 Compliance'],
        estimatedSetupTime: '2-3 weeks',
        complexity: 'high',
        cost: 'free',
        authMethod: 'oauth'
      },
      {
        id: 'pathology-template',
        name: 'Pathology Lab Integration',
        type: 'pathology',
        description: 'Automated import of pathology results with HL7 messaging',
        provider: 'Various Providers',
        icon: <Activity className="h-5 w-5" />,
        category: 'pathology',
        requirements: ['Lab Partnership Agreement', 'HL7 Interface', 'Data Mapping', 'Critical Value Alerts'],
        estimatedSetupTime: '1-2 weeks',
        complexity: 'medium',
        cost: 'paid',
        authMethod: 'api_key'
      },
      {
        id: 'imaging-template',
        name: 'Medical Imaging Integration',
        type: 'imaging',
        description: 'DICOM image viewing and report integration with secure transmission',
        provider: 'Various Providers',
        icon: <Zap className="h-5 w-5" />,
        category: 'imaging',
        requirements: ['DICOM Compliance', 'VPN Connection', 'Image Storage', 'Viewer License'],
        estimatedSetupTime: '2-4 weeks',
        complexity: 'high',
        cost: 'enterprise',
        authMethod: 'certificate'
      },
      {
        id: 'pharmacy-template',
        name: 'Pharmacy Network Integration',
        type: 'pharmacy',
        description: 'Electronic prescription transmission and PBS compliance',
        provider: 'Various Pharmacy Networks',
        icon: <Pill className="h-5 w-5" />,
        category: 'pharmacy',
        requirements: ['Pharmacy Partnership', 'PBS Integration', 'Electronic Prescribing', 'Drug Database'],
        estimatedSetupTime: '1-3 weeks',
        complexity: 'medium',
        cost: 'paid',
        authMethod: 'api_key'
      },
      {
        id: 'medicare-template',
        name: 'Medicare Australia Integration',
        type: 'billing',
        description: 'Bulk billing and claims processing with real-time verification',
        provider: 'Services Australia',
        icon: <CreditCard className="h-5 w-5" />,
        category: 'billing',
        requirements: ['Provider Registration', 'Medicare Provider Number', 'Bulk Billing Setup', 'Claims Software'],
        estimatedSetupTime: '1-2 weeks',
        complexity: 'medium',
        cost: 'free',
        authMethod: 'oauth'
      },
      {
        id: 'specialist-template',
        name: 'Specialist Network Integration',
        type: 'specialist',
        description: 'Referral management and specialist communication platform',
        provider: 'Australian Specialist Network',
        icon: <Users className="h-5 w-5" />,
        category: 'specialist',
        requirements: ['Specialist Network Access', 'Referral Templates', 'Communication Protocols', 'Care Coordination'],
        estimatedSetupTime: '2-3 weeks',
        complexity: 'medium',
        cost: 'paid',
        authMethod: 'oauth'
      }
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    addNotification({
      type: 'success',
      title: 'Data Refreshed',
      message: 'Integration data has been updated.'
    });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    addNotification({
      type: 'info',
      title: 'Tab Changed',
      message: `Switched to ${tabId} view.`
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      addNotification({
        type: 'info',
        title: 'Search Updated',
        message: `Searching integrations for "${value}"...`
      });
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'status') {
      setFilterStatus(value);
    } else if (filterType === 'type') {
      setFilterType(value);
    }
    addNotification({
      type: 'info',
      title: 'Filter Applied',
      message: `Filtering by ${filterType}: ${value}`
    });
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus;
    const matchesType = filterType === 'all' || integration.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'disconnected': return <XCircle className="h-5 w-5 text-gray-400" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'syncing': return <Refresh className="h-5 w-5 text-yellow-600 animate-spin" />;
      case 'pending_auth': return <Key className="h-5 w-5 text-orange-600" />;
      case 'maintenance': return <Settings className="h-5 w-5 text-blue-600" />;
      default: return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'syncing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending_auth': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getComplianceScore = (compliance: any) => {
    const total = Object.keys(compliance).length;
    const passed = Object.values(compliance).filter(Boolean).length;
    return Math.round((passed / total) * 100);
  };

  const handleSync = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    
    if (syncingIntegrations.has(integrationId)) {
      addNotification({
        type: 'warning',
        title: 'Sync In Progress',
        message: `${integration?.name} is already syncing.`
      });
      return;
    }

    setSyncingIntegrations(prev => new Set([...prev, integrationId]));
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, status: 'syncing' as const }
        : int
    ));

    addNotification({
      type: 'info',
      title: 'Sync Started',
      message: `Starting sync for ${integration?.name}...`
    });

    try {
      const result = await IntegrationManager.syncIntegration(integrationId);
      
      // Update integration status based on result
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: result.success ? 'connected' as const : 'error' as const,
              lastSync: new Date().toISOString(),
              metrics: {
                ...integration.metrics,
                recordsProcessed: integration.metrics.recordsProcessed + result.recordsProcessed,
                successRate: result.success ? integration.metrics.successRate : Math.max(0, integration.metrics.successRate - 5)
              }
            }
          : integration
      ));

      // Add to sync logs
      const newLog: SyncLog = {
        id: Date.now().toString(),
        integration: integration?.name || 'Unknown',
        operation: 'Manual Sync',
        status: result.success ? 'success' : 'failed',
        timestamp: new Date().toISOString(),
        recordsProcessed: result.recordsProcessed,
        recordsSuccessful: result.recordsSuccessful,
        recordsFailed: result.recordsFailed,
        details: result.success 
          ? `Successfully processed ${result.recordsSuccessful} records`
          : `Failed: ${result.errors.join(', ')}`,
        duration: result.duration
      };

      setSyncLogs(prev => [newLog, ...prev]);
      
      addNotification({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'Sync Completed' : 'Sync Failed',
        message: result.success 
          ? `${integration?.name} sync completed successfully.`
          : `${integration?.name} sync failed. Please check configuration.`
      });
    } catch (error) {
      console.error('Sync failed:', error);
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'error' as const }
          : integration
      ));
      addNotification({
        type: 'error',
        title: 'Sync Error',
        message: `Failed to sync ${integration?.name}. Please try again.`
      });
    } finally {
      setSyncingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(integrationId);
        return newSet;
      });
    }
  };

  const handleToggleIntegration = (integrationId: string, enable: boolean) => {
    const integration = integrations.find(i => i.id === integrationId);
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: enable ? 'connected' as const : 'disconnected' as const,
            configuration: { ...integration.configuration, autoSync: enable }
          }
        : integration
    ));
    
    addNotification({
      type: enable ? 'success' : 'info',
      title: enable ? 'Integration Enabled' : 'Integration Disabled',
      message: `${integration?.name} has been ${enable ? 'enabled' : 'disabled'}.`
    });
  };

  const handleSetupIntegration = (template: IntegrationTemplate) => {
    setSelectedTemplate(template);
    setShowSetupModal(true);
    addNotification({
      type: 'info',
      title: 'Setup Integration',
      message: `Starting setup for ${template.name}.`
    });
  };

  const handleSetupComplete = () => {
    setShowSetupModal(false);
    setSelectedTemplate(null);
    loadIntegrations();
    addNotification({
      type: 'success',
      title: 'Integration Setup Complete',
      message: 'Integration has been configured successfully.'
    });
  };

  const handleConfigureIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    addNotification({
      type: 'info',
      title: 'Configure Integration',
      message: `Opening configuration for ${integration?.name}.`
    });
  };

  const handleViewLogs = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    addNotification({
      type: 'info',
      title: 'View Logs',
      message: `Viewing sync logs for ${integration?.name}.`
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Connected</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {integrations.filter(i => i.status === 'connected').length}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center space-x-2">
            <Refresh className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Syncing</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {integrations.filter(i => i.status === 'syncing').length}
          </p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Errors</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {integrations.filter(i => i.status === 'error').length}
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {integrations.reduce((sum, i) => sum + i.metrics.recordsProcessed, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
              <option value="error">Error</option>
              <option value="syncing">Syncing</option>
              <option value="pending_auth">Pending Auth</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="mhr">My Health Record</option>
              <option value="pathology">Pathology</option>
              <option value="imaging">Imaging</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="billing">Billing</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${integration.color}-100 text-${integration.color}-600`}>
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.provider}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(integration.status)}
                <button
                  onClick={() => setSelectedIntegration(integration.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            {/* Status and Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(integration.status)}`}>
                  {integration.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Success Rate</span>
                <span className="text-xs font-medium text-gray-900">{integration.metrics.successRate}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last Sync</span>
                <span className="text-xs text-gray-900">
                  {new Date(integration.lastSync).toLocaleDateString('en-AU', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Compliance</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-900">{getComplianceScore(integration.compliance)}%</span>
                  <div className="flex space-x-1">
                    {integration.compliance.fhir && <span className="w-2 h-2 bg-green-500 rounded-full" title="FHIR Compliant" />}
                    {integration.compliance.hl7 && <span className="w-2 h-2 bg-blue-500 rounded-full" title="HL7 Compliant" />}
                    {integration.compliance.privacy && <span className="w-2 h-2 bg-purple-500 rounded-full" title="Privacy Compliant" />}
                    {integration.compliance.security && <span className="w-2 h-2 bg-orange-500 rounded-full" title="Security Compliant" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Types */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Data Types</p>
              <div className="flex flex-wrap gap-1">
                {integration.dataTypes.slice(0, 3).map((type, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {type}
                  </span>
                ))}
                {integration.dataTypes.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    +{integration.dataTypes.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSync(integration.id)}
                  disabled={syncingIntegrations.has(integration.id)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium disabled:opacity-50 flex items-center space-x-1"
                >
                  <Refresh className={`h-3 w-3 ${syncingIntegrations.has(integration.id) ? 'animate-spin' : ''}`} />
                  <span>{syncingIntegrations.has(integration.id) ? 'Syncing...' : 'Sync Now'}</span>
                </button>
                <button 
                  onClick={() => handleConfigureIntegration(integration.id)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Settings className="h-3 w-3" />
                  <span>Configure</span>
                </button>
                <button 
                  onClick={() => handleViewLogs(integration.id)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
                >
                  <FileText className="h-3 w-3" />
                  <span>Logs</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Auto-sync</span>
                <button
                  onClick={() => handleToggleIntegration(integration.id, !integration.configuration.autoSync)}
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                    integration.configuration.autoSync ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      integration.configuration.autoSync ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <LucideLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Set up your first integration to get started.'}
            </p>
            <button
              onClick={() => setActiveTab('templates')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Browse Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sync Activity Logs</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                addNotification({
                  type: 'info',
                  title: 'Export Logs',
                  message: 'Preparing log export...'
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              onClick={async () => {
                setRefreshing(true);
                await loadSyncLogs();
                setRefreshing(false);
                addNotification({
                  type: 'success',
                  title: 'Logs Refreshed',
                  message: 'Sync logs have been updated.'
                });
              }}
              disabled={refreshing}
              className="text-gray-400 hover:text-gray-600"
            >
              <Refresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {syncLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getLogStatusIcon(log.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{log.integration}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{log.operation}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString('en-AU')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Processed: {log.recordsProcessed}</span>
                  <span>Success: {log.recordsSuccessful}</span>
                  {log.recordsFailed > 0 && <span className="text-red-600">Failed: {log.recordsFailed}</span>}
                  <span>Duration: {(log.duration / 1000).toFixed(1)}s</span>
                  {log.errorCode && <span className="text-red-600">Error: {log.errorCode}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Integration Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.provider}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Setup Time:</span>
                  <span className="font-medium">{template.estimatedSetupTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Complexity:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.complexity === 'low' ? 'bg-green-100 text-green-800' :
                    template.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {template.complexity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Cost:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.cost === 'free' ? 'bg-green-100 text-green-800' :
                    template.cost === 'paid' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {template.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Auth Method:</span>
                  <span className="font-medium capitalize">{template.authMethod.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {template.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <CheckSquare className="h-3 w-3 text-green-600" />
                      <span>{req}</span>
                    </li>
                  ))}
                  {template.requirements.length > 3 && (
                    <li className="text-gray-500">+{template.requirements.length - 3} more requirements</li>
                  )}
                </ul>
              </div>
              
              <button 
                onClick={() => handleSetupIntegration(template)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                Setup Integration
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <LucideLink className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Integration Hub</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <Database className="h-4 w-4" /> },
              { id: 'logs', label: 'Activity Logs', icon: <FileText className="h-4 w-4" /> },
              { id: 'templates', label: 'Templates', icon: <Plus className="h-4 w-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'logs' && renderLogsTab()}
      {activeTab === 'templates' && renderTemplatesTab()}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Auto-sync All Integrations</h4>
                <p className="text-sm text-gray-500">Enable automatic synchronization for all connected integrations</p>
              </div>
              <button
                onClick={() => {
                  addNotification({
                    type: 'info',
                    title: 'Auto-sync Setting',
                    message: 'Auto-sync setting will be implemented soon.'
                  });
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Error Notifications</h4>
                <p className="text-sm text-gray-500">Receive notifications when sync errors occur</p>
              </div>
              <button
                onClick={() => {
                  addNotification({
                    type: 'info',
                    title: 'Notification Setting',
                    message: 'Error notification setting updated.'
                  });
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Modal */}
      {showSetupModal && selectedTemplate && (
        <IntegrationSetup
          integration={{
            id: `new-${selectedTemplate.id}`,
            name: selectedTemplate.name,
            type: selectedTemplate.type,
            authMethod: selectedTemplate.authMethod,
            provider: selectedTemplate.provider,
            description: selectedTemplate.description
          }}
          onComplete={handleSetupComplete}
          onCancel={() => {
            setShowSetupModal(false);
            setSelectedTemplate(null);
            addNotification({
              type: 'info',
              title: 'Setup Cancelled',
              message: 'Integration setup has been cancelled.'
            });
          }}
        />
      )}
    </div>
  );
}