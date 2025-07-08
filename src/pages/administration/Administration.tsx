import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  Bell,
  FileText,
  BarChart3,
  Globe,
  Lock,
  Key,
  Monitor,
  HardDrive,
  Wifi,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'provider' | 'nurse' | 'receptionist';
  status: 'active' | 'inactive' | 'suspended';
  last_login: string;
  permissions: string[];
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  status: 'success' | 'failed';
  details: string;
}

export function Administration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockMetrics: SystemMetric[] = [
      {
        name: 'System Uptime',
        value: '99.9%',
        status: 'good',
        trend: 'stable',
        icon: <Monitor className="h-5 w-5" />
      },
      {
        name: 'Database Performance',
        value: '245ms',
        status: 'good',
        trend: 'down',
        icon: <Database className="h-5 w-5" />
      },
      {
        name: 'Storage Usage',
        value: '68%',
        status: 'warning',
        trend: 'up',
        icon: <HardDrive className="h-5 w-5" />
      },
      {
        name: 'Active Users',
        value: '24',
        status: 'good',
        trend: 'up',
        icon: <Users className="h-5 w-5" />
      },
      {
        name: 'Security Score',
        value: '94/100',
        status: 'good',
        trend: 'stable',
        icon: <Shield className="h-5 w-5" />
      },
      {
        name: 'Backup Status',
        value: 'Completed',
        status: 'good',
        trend: 'stable',
        icon: <Download className="h-5 w-5" />
      }
    ];

    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Dr. Sarah Mitchell',
        email: 'sarah.mitchell@clinic.com',
        role: 'provider',
        status: 'active',
        last_login: '2025-01-16T08:30:00Z',
        permissions: ['read_patients', 'write_patients', 'prescribe', 'refer']
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@clinic.com',
        role: 'nurse',
        status: 'active',
        last_login: '2025-01-16T07:45:00Z',
        permissions: ['read_patients', 'write_vitals', 'schedule_appointments']
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@clinic.com',
        role: 'receptionist',
        status: 'active',
        last_login: '2025-01-15T17:20:00Z',
        permissions: ['read_patients', 'schedule_appointments', 'billing']
      },
      {
        id: '4',
        name: 'Admin User',
        email: 'admin@clinic.com',
        role: 'admin',
        status: 'active',
        last_login: '2025-01-16T09:00:00Z',
        permissions: ['full_access']
      }
    ];

    const mockAuditLogs: AuditLog[] = [
      {
        id: '1',
        user: 'Dr. Sarah Mitchell',
        action: 'CREATE',
        resource: 'Patient Record',
        timestamp: '2025-01-16T10:30:00Z',
        ip_address: '192.168.1.100',
        status: 'success',
        details: 'Created new patient record for Sarah Johnson'
      },
      {
        id: '2',
        user: 'Jane Smith',
        action: 'UPDATE',
        resource: 'Appointment',
        timestamp: '2025-01-16T10:15:00Z',
        ip_address: '192.168.1.101',
        status: 'success',
        details: 'Updated appointment status to completed'
      },
      {
        id: '3',
        user: 'Mike Johnson',
        action: 'LOGIN',
        resource: 'System',
        timestamp: '2025-01-16T08:00:00Z',
        ip_address: '192.168.1.102',
        status: 'success',
        details: 'User logged in successfully'
      },
      {
        id: '4',
        user: 'Unknown User',
        action: 'LOGIN',
        resource: 'System',
        timestamp: '2025-01-16T02:30:00Z',
        ip_address: '203.45.67.89',
        status: 'failed',
        details: 'Failed login attempt - invalid credentials'
      }
    ];

    setSystemMetrics(mockMetrics);
    setUsers(mockUsers);
    setAuditLogs(mockAuditLogs);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      good: 'text-green-600 bg-green-50',
      warning: 'text-yellow-600 bg-yellow-50',
      critical: 'text-red-600 bg-red-50',
      active: 'text-green-600 bg-green-50',
      inactive: 'text-gray-600 bg-gray-50',
      suspended: 'text-red-600 bg-red-50',
      success: 'text-green-600',
      failed: 'text-red-600'
    };
    return colors[status as keyof typeof colors] || colors.good;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      provider: 'bg-blue-100 text-blue-800',
      nurse: 'bg-green-100 text-green-800',
      receptionist: 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || colors.provider;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                {metric.icon}
              </div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(metric.status)}`}>
              {metric.status}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium">Manage Users</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium">Backup Data</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium">System Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.user}</p>
                  <p className="text-xs text-gray-500">{log.action} {log.resource}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                <p className={`text-xs font-medium ${getStatusColor(log.status)}`}>{log.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(user.last_login).toLocaleDateString('en-AU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.permissions.length} permissions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
        <div className="flex items-center space-x-2">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.resource}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString('en-AU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.ip_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'users', label: 'User Management', icon: <Users className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'audit', label: 'Audit Logs', icon: <FileText className="h-4 w-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'audit' && renderAuditLogs()}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <p className="text-gray-500">Security configuration options will be available here.</p>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
          <p className="text-gray-500">System configuration options will be available here.</p>
        </div>
      )}
    </div>
  );
}