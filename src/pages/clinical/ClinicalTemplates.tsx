import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, Copy, Download, Upload, Search } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'consultation' | 'procedure' | 'assessment' | 'referral';
  description: string;
  fields: Array<{
    name: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
  }>;
  usage_count: number;
  created_by: string;
  created_at: string;
  is_system_template: boolean;
}

export function ClinicalTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    // Mock templates
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'General Consultation',
        type: 'consultation',
        description: 'Standard consultation template with SOAP format',
        fields: [
          { name: 'chief_complaint', type: 'textarea', label: 'Chief Complaint', required: true, placeholder: 'Patient\'s main concern...' },
          { name: 'history', type: 'textarea', label: 'History of Present Illness', required: true, placeholder: 'Detailed history...' },
          { name: 'examination', type: 'textarea', label: 'Physical Examination', required: true, placeholder: 'Examination findings...' },
          { name: 'assessment', type: 'textarea', label: 'Assessment', required: true, placeholder: 'Clinical impression...' },
          { name: 'plan', type: 'textarea', label: 'Plan', required: true, placeholder: 'Treatment plan...' }
        ],
        usage_count: 245,
        created_by: 'System',
        created_at: '2024-01-01',
        is_system_template: true
      },
      {
        id: '2',
        name: 'Annual Health Check',
        type: 'assessment',
        description: 'Comprehensive health assessment template',
        fields: [
          { name: 'health_review', type: 'textarea', label: 'Health Review', required: true, placeholder: 'Overall health status...' },
          { name: 'risk_assessment', type: 'textarea', label: 'Risk Assessment', required: true, placeholder: 'Risk factors...' },
          { name: 'screening', type: 'textarea', label: 'Screening', required: false, placeholder: 'Screening tests...' },
          { name: 'preventive_care', type: 'textarea', label: 'Preventive Care', required: false, placeholder: 'Preventive measures...' },
          { name: 'follow_up_plan', type: 'textarea', label: 'Follow-up Plan', required: true, placeholder: 'Next steps...' }
        ],
        usage_count: 89,
        created_by: 'System',
        created_at: '2024-01-01',
        is_system_template: true
      },
      {
        id: '3',
        name: 'Mental Health Assessment',
        type: 'assessment',
        description: 'Mental health consultation template',
        fields: [
          { name: 'mental_state', type: 'textarea', label: 'Mental State Exam', required: true, placeholder: 'Mental state examination...' },
          { name: 'risk_assessment', type: 'textarea', label: 'Risk Assessment', required: true, placeholder: 'Suicide/self-harm risk...' },
          { name: 'treatment_plan', type: 'textarea', label: 'Treatment Plan', required: true, placeholder: 'Treatment approach...' },
          { name: 'safety_planning', type: 'textarea', label: 'Safety Planning', required: false, placeholder: 'Safety measures...' }
        ],
        usage_count: 67,
        created_by: 'Dr. Sarah Mitchell',
        created_at: '2024-06-15',
        is_system_template: false
      },
      {
        id: '4',
        name: 'Procedure Note',
        type: 'procedure',
        description: 'Template for documenting medical procedures',
        fields: [
          { name: 'indication', type: 'textarea', label: 'Indication', required: true, placeholder: 'Reason for procedure...' },
          { name: 'procedure_details', type: 'textarea', label: 'Procedure Details', required: true, placeholder: 'Step-by-step procedure...' },
          { name: 'complications', type: 'textarea', label: 'Complications', required: false, placeholder: 'Any complications...' },
          { name: 'post_procedure', type: 'textarea', label: 'Post-procedure Care', required: true, placeholder: 'Post-procedure instructions...' }
        ],
        usage_count: 34,
        created_by: 'System',
        created_at: '2024-01-01',
        is_system_template: true
      }
    ];

    setTemplates(mockTemplates);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      consultation: 'bg-blue-100 text-blue-800',
      procedure: 'bg-purple-100 text-purple-800',
      assessment: 'bg-green-100 text-green-800',
      referral: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || colors.consultation;
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to create record with template pre-selected
    navigate('/clinical-records/create', { state: { template } });
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      is_system_template: false,
      created_by: 'Dr. Sarah Mitchell',
      created_at: new Date().toISOString(),
      usage_count: 0
    };
    setTemplates(prev => [duplicated, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Clinical Templates</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/clinical-records')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Records
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Template</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="procedure">Procedure</option>
            <option value="assessment">Assessment</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                
                {template.is_system_template && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    System
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-500">
                  {template.fields.length} fields • Used {template.usage_count} times
                </div>
                <div className="text-xs text-gray-500">
                  Created by {template.created_by} on {new Date(template.created_at).toLocaleDateString('en-AU')}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                  Use Template
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="flex-1 border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-50 flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="flex-1 border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-50 flex items-center justify-center space-x-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                  
                  {!template.is_system_template && (
                    <button className="border border-gray-300 text-red-600 py-1 px-3 rounded text-sm hover:bg-gray-50">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first template to get started.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}