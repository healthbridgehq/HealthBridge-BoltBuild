import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Activity,
  Heart,
  Scale,
  Footprints,
  Droplets,
  Moon,
  Apple,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'weight' | 'chronic_care' | 'mental_health' | 'sleep' | 'hydration';
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string;
  created_date: string;
  status: 'active' | 'completed' | 'paused' | 'overdue';
  progress_percentage: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  reminder_enabled: boolean;
  notes?: string;
  milestones: Array<{
    id: string;
    title: string;
    target_value: number;
    achieved: boolean;
    achieved_date?: string;
  }>;
}

interface ProgressEntry {
  id: string;
  goal_id: string;
  value: number;
  date: string;
  notes?: string;
}

export function HealthGoals() {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  useEffect(() => {
    const mockGoals: HealthGoal[] = [
      {
        id: '1',
        title: 'Daily Steps Goal',
        description: 'Walk 10,000 steps every day to improve cardiovascular health',
        category: 'fitness',
        target_value: 10000,
        current_value: 7500,
        unit: 'steps',
        target_date: '2025-03-31',
        created_date: '2025-01-01',
        status: 'active',
        progress_percentage: 75,
        frequency: 'daily',
        reminder_enabled: true,
        notes: 'Focus on taking stairs and walking during lunch breaks',
        milestones: [
          { id: '1', title: '5,000 steps daily', target_value: 5000, achieved: true, achieved_date: '2025-01-10' },
          { id: '2', title: '7,500 steps daily', target_value: 7500, achieved: true, achieved_date: '2025-01-15' },
          { id: '3', title: '10,000 steps daily', target_value: 10000, achieved: false }
        ]
      },
      {
        id: '2',
        title: 'Weight Management',
        description: 'Lose 5kg through healthy diet and exercise',
        category: 'weight',
        target_value: 65,
        current_value: 68,
        unit: 'kg',
        target_date: '2025-06-30',
        created_date: '2025-01-01',
        status: 'active',
        progress_percentage: 60,
        frequency: 'weekly',
        reminder_enabled: true,
        notes: 'Working with dietitian on meal planning',
        milestones: [
          { id: '1', title: 'Lose 2kg', target_value: 68, achieved: true, achieved_date: '2025-01-14' },
          { id: '2', title: 'Lose 3.5kg', target_value: 66.5, achieved: false },
          { id: '3', title: 'Reach target weight', target_value: 65, achieved: false }
        ]
      },
      {
        id: '3',
        title: 'Blood Pressure Control',
        description: 'Maintain blood pressure below 130/80 mmHg',
        category: 'chronic_care',
        target_value: 130,
        current_value: 125,
        unit: 'mmHg',
        target_date: '2025-12-31',
        created_date: '2025-01-01',
        status: 'active',
        progress_percentage: 90,
        frequency: 'weekly',
        reminder_enabled: true,
        notes: 'Taking medication as prescribed, monitoring daily',
        milestones: [
          { id: '1', title: 'Below 140/90', target_value: 140, achieved: true, achieved_date: '2025-01-05' },
          { id: '2', title: 'Below 130/80', target_value: 130, achieved: true, achieved_date: '2025-01-12' },
          { id: '3', title: 'Maintain for 6 months', target_value: 130, achieved: false }
        ]
      },
      {
        id: '4',
        title: 'Daily Water Intake',
        description: 'Drink 8 glasses of water daily for better hydration',
        category: 'hydration',
        target_value: 8,
        current_value: 6,
        unit: 'glasses',
        target_date: '2025-02-28',
        created_date: '2025-01-10',
        status: 'active',
        progress_percentage: 75,
        frequency: 'daily',
        reminder_enabled: true,
        milestones: [
          { id: '1', title: '4 glasses daily', target_value: 4, achieved: true, achieved_date: '2025-01-12' },
          { id: '2', title: '6 glasses daily', target_value: 6, achieved: true, achieved_date: '2025-01-15' },
          { id: '3', title: '8 glasses daily', target_value: 8, achieved: false }
        ]
      }
    ];

    const mockProgressEntries: ProgressEntry[] = [
      { id: '1', goal_id: '1', value: 8200, date: '2025-01-15', notes: 'Good walking day' },
      { id: '2', goal_id: '1', value: 7500, date: '2025-01-16', notes: 'Rainy day, less walking' },
      { id: '3', goal_id: '2', value: 68.2, date: '2025-01-15' },
      { id: '4', goal_id: '3', value: 125, date: '2025-01-16', notes: 'Morning reading' },
      { id: '5', goal_id: '4', value: 6, date: '2025-01-16', notes: 'Need to drink more in afternoon' }
    ];

    setGoals(mockGoals);
    setProgressEntries(mockProgressEntries);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Footprints className="h-5 w-5" />;
      case 'weight': return <Scale className="h-5 w-5" />;
      case 'chronic_care': return <Heart className="h-5 w-5" />;
      case 'hydration': return <Droplets className="h-5 w-5" />;
      case 'sleep': return <Moon className="h-5 w-5" />;
      case 'nutrition': return <Apple className="h-5 w-5" />;
      case 'mental_health': return <Activity className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      fitness: 'bg-blue-100 text-blue-600',
      weight: 'bg-green-100 text-green-600',
      chronic_care: 'bg-red-100 text-red-600',
      hydration: 'bg-cyan-100 text-cyan-600',
      sleep: 'bg-purple-100 text-purple-600',
      nutrition: 'bg-orange-100 text-orange-600',
      mental_health: 'bg-pink-100 text-pink-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter(g => g.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter(g => g.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter(g => new Date(g.created_date).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        {goals.filter(g => g.status === 'active').map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                  {getCategoryIcon(goal.category)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                      {getStatusIcon(goal.status)}
                      <span className="ml-1">{goal.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Target: {goal.target_value} {goal.unit}</span>
                    <span>Current: {goal.current_value} {goal.unit}</span>
                    <span>Due: {new Date(goal.target_date).toLocaleDateString('en-AU')}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {goal.progress_percentage}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Milestones */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Milestones</p>
              <div className="flex space-x-2">
                {goal.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`px-2 py-1 text-xs rounded-full border ${
                      milestone.achieved 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {milestone.achieved && <CheckCircle className="h-3 w-3 inline mr-1" />}
                    {milestone.title}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Update Progress
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  View Details
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button className="p-1 text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Health Goals</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <Target className="h-4 w-4" /> },
              { id: 'progress', label: 'Progress Tracking', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'completed', label: 'Completed Goals', icon: <CheckCircle className="h-4 w-4" /> }
            ].map((tab) => (
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
      {activeTab === 'progress' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracking</h2>
          <p className="text-gray-500">Detailed progress tracking and analytics will be available here.</p>
        </div>
      )}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Goals</h2>
          <div className="space-y-4">
            {goals.filter(g => g.status === 'completed').map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Completed</span>
                  </div>
                </div>
              </div>
            ))}
            
            {goals.filter(g => g.status === 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No completed goals yet. Keep working towards your active goals!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}