import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  FileText,
  Pill,
  Phone,
  Mail,
  Activity,
  Flag,
  MoreVertical,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'follow_up' | 'review' | 'prescription' | 'referral' | 'call' | 'admin' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  patient_name?: string;
  patient_id?: string;
  assigned_to: string;
  created_by: string;
  due_date: string;
  due_time?: string;
  created_at: string;
  completed_at?: string;
  estimated_duration?: number;
  notes?: string;
  attachments?: number;
  related_record_id?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'created_at' | 'assigned_to' | 'created_by'>[];
}

export function TasksWorkflow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'kanban' | 'calendar'>('list');

  // Mock data
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Follow-up call for Sarah Johnson',
        description: 'Check on patient recovery after recent consultation',
        type: 'follow_up',
        priority: 'medium',
        status: 'pending',
        patient_name: 'Sarah Johnson',
        patient_id: 'P001',
        assigned_to: 'Dr. Sarah Mitchell',
        created_by: 'Dr. Sarah Mitchell',
        due_date: '2025-01-16',
        due_time: '14:00',
        created_at: '2025-01-15T10:00:00Z',
        estimated_duration: 15,
        notes: 'Patient had concerns about medication side effects'
      },
      {
        id: '2',
        title: 'Review blood test results',
        description: 'Review and interpret Michael Chen\'s diabetes monitoring results',
        type: 'review',
        priority: 'high',
        status: 'in_progress',
        patient_name: 'Michael Chen',
        patient_id: 'P002',
        assigned_to: 'Dr. Sarah Mitchell',
        created_by: 'Lab System',
        due_date: '2025-01-16',
        due_time: '09:00',
        created_at: '2025-01-12T08:00:00Z',
        estimated_duration: 30,
        notes: 'HbA1c results came back elevated',
        attachments: 2,
        related_record_id: 'R002'
      },
      {
        id: '3',
        title: 'Prescription renewal reminder',
        description: 'Contact Emma Wilson for asthma medication renewal',
        type: 'prescription',
        priority: 'medium',
        status: 'pending',
        patient_name: 'Emma Wilson',
        patient_id: 'P003',
        assigned_to: 'Practice Nurse',
        created_by: 'System',
        due_date: '2025-01-17',
        created_at: '2025-01-10T00:00:00Z',
        estimated_duration: 10
      },
      {
        id: '4',
        title: 'Urgent cardiology referral',
        description: 'Process urgent referral for Robert Davis chest pain investigation',
        type: 'referral',
        priority: 'urgent',
        status: 'completed',
        patient_name: 'Robert Davis',
        patient_id: 'P004',
        assigned_to: 'Dr. Sarah Mitchell',
        created_by: 'Dr. Sarah Mitchell',
        due_date: '2025-01-15',
        due_time: '16:00',
        created_at: '2025-01-08T14:00:00Z',
        completed_at: '2025-01-15T15:30:00Z',
        estimated_duration: 45,
        notes: 'Referral sent to Dr. Williams at Heart Clinic',
        attachments: 3
      },
      {
        id: '5',
        title: 'Insurance pre-authorization',
        description: 'Submit pre-authorization for Lisa Anderson\'s MRI scan',
        type: 'admin',
        priority: 'medium',
        status: 'overdue',
        patient_name: 'Lisa Anderson',
        patient_id: 'P005',
        assigned_to: 'Admin Staff',
        created_by: 'Dr. Sarah Mitchell',
        due_date: '2025-01-14',
        created_at: '2025-01-12T10:00:00Z',
        estimated_duration: 60,
        notes: 'Patient needs MRI for back pain investigation'
      },
      {
        id: '6',
        title: 'Appointment reminder calls',
        description: 'Call patients with appointments tomorrow to confirm attendance',
        type: 'reminder',
        priority: 'low',
        status: 'pending',
        assigned_to: 'Reception',
        created_by: 'System',
        due_date: '2025-01-16',
        due_time: '16:00',
        created_at: '2025-01-15T00:00:00Z',
        estimated_duration: 120,
        notes: '8 patients to call for tomorrow\'s appointments'
      }
    ];

    const mockTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'New Patient Onboarding',
        description: 'Complete workflow for new patient registration and first consultation',
        tasks: [
          {
            title: 'Verify patient details',
            description: 'Confirm contact information and Medicare details',
            type: 'admin',
            priority: 'medium',
            status: 'pending',
            due_date: '',
            estimated_duration: 15
          },
          {
            title: 'Schedule initial consultation',
            description: 'Book first appointment with appropriate provider',
            type: 'admin',
            priority: 'medium',
            status: 'pending',
            due_date: '',
            estimated_duration: 10
          },
          {
            title: 'Send welcome information',
            description: 'Email practice information and pre-consultation forms',
            type: 'admin',
            priority: 'low',
            status: 'pending',
            due_date: '',
            estimated_duration: 5
          }
        ]
      },
      {
        id: '2',
        name: 'Chronic Disease Management',
        description: 'Ongoing care workflow for patients with chronic conditions',
        tasks: [
          {
            title: 'Review current medications',
            description: 'Check medication compliance and effectiveness',
            type: 'review',
            priority: 'high',
            status: 'pending',
            due_date: '',
            estimated_duration: 30
          },
          {
            title: 'Order routine tests',
            description: 'Schedule required monitoring blood work',
            type: 'admin',
            priority: 'medium',
            status: 'pending',
            due_date: '',
            estimated_duration: 15
          },
          {
            title: 'Schedule follow-up',
            description: 'Book next routine monitoring appointment',
            type: 'follow_up',
            priority: 'medium',
            status: 'pending',
            due_date: '',
            estimated_duration: 10
          }
        ]
      }
    ];

    setTasks(mockTasks);
    setTemplates(mockTemplates);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.patient_name && task.patient_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      overdue: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return <Phone className="h-4 w-4" />;
      case 'review': return <FileText className="h-4 w-4" />;
      case 'prescription': return <Pill className="h-4 w-4" />;
      case 'referral': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'admin': return <CheckSquare className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      follow_up: 'Follow-up',
      review: 'Review',
      prescription: 'Prescription',
      referral: 'Referral',
      call: 'Call',
      admin: 'Administrative',
      reminder: 'Reminder'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const isOverdue = (task: Task) => {
    if (task.status === 'completed' || task.status === 'cancelled') return false;
    const dueDateTime = new Date(`${task.due_date}T${task.due_time || '23:59'}:00`);
    return dueDateTime < new Date();
  };

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className={`bg-white rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-shadow ${
      task.priority === 'urgent' ? 'border-l-red-500' :
      task.priority === 'high' ? 'border-l-orange-500' :
      task.priority === 'medium' ? 'border-l-yellow-500' :
      'border-l-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getTypeIcon(task.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
              {isOverdue(task) && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Overdue
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.due_date).toLocaleDateString('en-AU')}</span>
                {task.due_time && <span>at {task.due_time}</span>}
              </div>
              
              {task.patient_name && (
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{task.patient_name}</span>
                </div>
              )}
              
              {task.estimated_duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimated_duration} min</span>
                </div>
              )}
              
              <div className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                <Flag className="h-3 w-3" />
                <span className="capitalize">{task.priority}</span>
              </div>
            </div>
            
            {task.notes && (
              <p className="text-xs text-gray-500 italic mt-2">Note: {task.notes}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {task.attachments && task.attachments > 0 && (
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>{task.attachments}</span>
            </span>
          )}
          
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Assigned to: {task.assigned_to}
        </div>
        
        <div className="flex items-center space-x-2">
          {task.status === 'pending' && (
            <button
              onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <Play className="h-3 w-3" />
              <span>Start</span>
            </button>
          )}
          
          {task.status === 'in_progress' && (
            <>
              <button
                onClick={() => handleTaskStatusChange(task.id, 'pending')}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
              >
                <Pause className="h-3 w-3" />
                <span>Pause</span>
              </button>
              <button
                onClick={() => handleTaskStatusChange(task.id, 'completed')}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
              >
                <CheckCircle className="h-3 w-3" />
                <span>Complete</span>
              </button>
            </>
          )}
          
          {(task.status === 'pending' || task.status === 'in_progress') && (
            <button
              onClick={() => handleTaskStatusChange(task.id, 'cancelled')}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
            >
              <XCircle className="h-3 w-3" />
              <span>Cancel</span>
            </button>
          )}
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
            <CheckSquare className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tasks & Workflow</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Workflows</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-900">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900">
                  {tasks.filter(t => isOverdue(t)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Flag className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">High Priority</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks by title, description, or patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="follow_up">Follow-up</option>
              <option value="review">Review</option>
              <option value="prescription">Prescription</option>
              <option value="referral">Referral</option>
              <option value="call">Call</option>
              <option value="admin">Administrative</option>
              <option value="reminder">Reminder</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map(renderTaskCard)}

        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first task to get started.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}