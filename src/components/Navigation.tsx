import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calendar, 
  Pill, 
  Target, 
  MessageSquare, 
  User,
  Users,
  CheckSquare,
  BarChart3,
  Settings,
  Video,
  CreditCard,
  LinkIcon,
  Stethoscope,
  Activity,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface NavigationProps {
  userRole: 'patient' | 'provider';
  isCollapsed?: boolean;
}

const iconMap = {
  Home,
  FileText,
  Calendar,
  Pill,
  Target,
  MessageSquare,
  User,
  Users,
  CheckSquare,
  BarChart3,
  Settings,
  Video,
  CreditCard,
  LinkIcon,
  Stethoscope,
  Activity
};

export function Navigation({ userRole, isCollapsed = false }: NavigationProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const patientNavItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'Home' },
    { 
      id: 'records', 
      label: 'Health Records', 
      path: '/records', 
      icon: 'FileText',
      children: [
        { id: 'records-view', label: 'View Records', path: '/records' },
        { id: 'records-add', label: 'Add Record', path: '/records/add' },
        { id: 'records-share', label: 'Share Records', path: '/records/share' }
      ]
    },
    { 
      id: 'appointments', 
      label: 'Appointments', 
      path: '/appointments', 
      icon: 'Calendar',
      children: [
        { id: 'appointments-schedule', label: 'Schedule', path: '/appointments/schedule' },
        { id: 'appointments-upcoming', label: 'Upcoming', path: '/appointments/upcoming' },
        { id: 'appointments-history', label: 'History', path: '/appointments/history' }
      ]
    },
    { 
      id: 'medications', 
      label: 'Medications', 
      path: '/medications', 
      icon: 'Pill',
      children: [
        { id: 'medications-current', label: 'Current', path: '/medications/current' },
        { id: 'medications-history', label: 'History', path: '/medications/history' },
        { id: 'medications-requests', label: 'Requests', path: '/medications/requests' }
      ]
    },
    { id: 'health-goals', label: 'Health Goals', path: '/health-goals', icon: 'Target' },
    { id: 'messages', label: 'Messages', path: '/messages', icon: 'MessageSquare' },
    { id: 'profile', label: 'Profile & Settings', path: '/profile', icon: 'User' }
  ];

  const providerNavItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'Home' },
    { 
      id: 'patients', 
      label: 'Patients', 
      path: '/patients', 
      icon: 'Users',
      children: [
        { id: 'patients-list', label: 'Patient List', path: '/patients' },
        { id: 'patients-add', label: 'Add Patient', path: '/patients/add' },
        { id: 'patients-search', label: 'Search', path: '/patients/search' }
      ]
    },
    { 
      id: 'appointments', 
      label: 'Appointments', 
      path: '/appointments', 
      icon: 'Calendar',
      children: [
        { id: 'appointments-calendar', label: 'Calendar', path: '/appointments/calendar' },
        { id: 'appointments-today', label: 'Today', path: '/appointments/today' },
        { id: 'appointments-waiting', label: 'Waiting Room', path: '/appointments/waiting' }
      ]
    },
    { 
      id: 'clinical-records', 
      label: 'Clinical Records', 
      path: '/clinical-records', 
      icon: 'FileText',
      children: [
        { id: 'clinical-records-create', label: 'Create', path: '/clinical-records/create' },
        { id: 'clinical-records-review', label: 'Review', path: '/clinical-records/review' },
        { id: 'clinical-records-templates', label: 'Templates', path: '/clinical-records/templates' }
      ]
    },
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      path: '/prescriptions', 
      icon: 'Pill',
      children: [
        { id: 'prescriptions-create', label: 'Create', path: '/prescriptions/create' },
        { id: 'prescriptions-history', label: 'History', path: '/prescriptions/history' },
        { id: 'prescriptions-interactions', label: 'Interactions', path: '/prescriptions/interactions' }
      ]
    },
    { id: 'tasks', label: 'Tasks & Workflow', path: '/tasks', icon: 'CheckSquare' },
    { 
      id: 'analytics', 
      label: 'Analytics & Reports', 
      path: '/analytics', 
      icon: 'BarChart3',
      children: [
        { id: 'analytics-practice', label: 'Practice', path: '/analytics/practice' },
        { id: 'analytics-clinical', label: 'Clinical', path: '/analytics/clinical' },
        { id: 'analytics-financial', label: 'Financial', path: '/analytics/financial' }
      ]
    },
    { 
      id: 'admin', 
      label: 'Administration', 
      path: '/admin', 
      icon: 'Settings',
      children: [
        { id: 'admin-staff', label: 'Staff', path: '/admin/staff' },
        { id: 'admin-settings', label: 'Settings', path: '/admin/settings' },
        { id: 'admin-integrations', label: 'Integrations', path: '/admin/integrations' }
      ]
    }
  ];

  const sharedNavItems = [
    { id: 'telehealth', label: 'Telehealth', path: '/telehealth', icon: 'Video' },
    { id: 'billing', label: 'Billing & Payments', path: '/billing', icon: 'CreditCard' }
  ];

  const navItems = userRole === 'patient' ? patientNavItems : providerNavItems;
  const allItems = [...navItems, ...sharedNavItems];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item: any, level = 0) => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id}>
        <div className="flex items-center">
          <Link
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
              active
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            } ${level > 0 ? 'ml-6' : ''}`}
          >
            {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
          {hasChildren && !isCollapsed && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {allItems.map(item => renderNavItem(item))}
    </nav>
  );
}