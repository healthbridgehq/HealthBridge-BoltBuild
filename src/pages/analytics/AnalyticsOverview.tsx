import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  change?: number;
}

export function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [appointmentData, setAppointmentData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [patientSatisfaction, setPatientSatisfaction] = useState<ChartData[]>([]);

  useEffect(() => {
    // Mock data for analytics
    setMetrics([
      {
        title: 'Total Patients',
        value: '1,247',
        change: '+12.5%',
        trend: 'up',
        icon: <Users className="h-6 w-6" />,
        color: 'blue'
      },
      {
        title: 'Appointments This Week',
        value: '89',
        change: '+8.2%',
        trend: 'up',
        icon: <Calendar className="h-6 w-6" />,
        color: 'green'
      },
      {
        title: 'Revenue (This Month)',
        value: '$24,580',
        change: '+15.3%',
        trend: 'up',
        icon: <DollarSign className="h-6 w-6" />,
        color: 'purple'
      },
      {
        title: 'Patient Satisfaction',
        value: '4.8/5.0',
        change: '+0.2',
        trend: 'up',
        icon: <Target className="h-6 w-6" />,
        color: 'orange'
      },
      {
        title: 'Avg Consultation Time',
        value: '28 min',
        change: '-2.1%',
        trend: 'down',
        icon: <Clock className="h-6 w-6" />,
        color: 'indigo'
      },
      {
        title: 'No-Show Rate',
        value: '5.2%',
        change: '-1.8%',
        trend: 'down',
        icon: <AlertTriangle className="h-6 w-6" />,
        color: 'red'
      }
    ]);

    setAppointmentData([
      { name: 'Mon', value: 12 },
      { name: 'Tue', value: 15 },
      { name: 'Wed', value: 18 },
      { name: 'Thu', value: 14 },
      { name: 'Fri', value: 16 },
      { name: 'Sat', value: 8 },
      { name: 'Sun', value: 6 }
    ]);

    setRevenueData([
      { name: 'Jan', value: 18500 },
      { name: 'Feb', value: 21200 },
      { name: 'Mar', value: 19800 },
      { name: 'Apr', value: 24580 }
    ]);

    setPatientSatisfaction([
      { name: 'Communication', value: 4.9 },
      { name: 'Wait Time', value: 4.6 },
      { name: 'Treatment Quality', value: 4.8 },
      { name: 'Facility', value: 4.7 },
      { name: 'Overall', value: 4.8 }
    ]);
  }, [timeRange]);

  const getMetricColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Practice Analytics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => setLoading(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${getMetricColor(metric.color)}`}>
                {metric.icon}
              </div>
              {getTrendIcon(metric.trend)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Appointments</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {appointmentData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{day.name}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(day.value / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-8 text-right">{day.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {revenueData.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{month.name}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(month.value / 25000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-16 text-right">
                  ${month.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Satisfaction & Clinical Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Satisfaction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Satisfaction Scores</h3>
          <div className="space-y-4">
            {patientSatisfaction.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex-1">{category.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(category.value / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">
                    {category.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Outcomes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Clinical Outcomes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Treatment Success Rate</p>
                  <p className="text-sm text-gray-500">Chronic conditions managed</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">94.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Patient Adherence</p>
                  <p className="text-sm text-gray-500">Medication compliance</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">87.5%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Health Goals Met</p>
                  <p className="text-sm text-gray-500">Patient-set targets</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">76.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New patient registration</p>
              <p className="text-sm text-gray-500">Emma Wilson registered for cardiology consultation</p>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Prescription issued</p>
              <p className="text-sm text-gray-500">Blood pressure medication for Robert Davis</p>
            </div>
            <span className="text-sm text-gray-400">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Lab results received</p>
              <p className="text-sm text-gray-500">Blood work results for Sarah Johnson</p>
            </div>
            <span className="text-sm text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}