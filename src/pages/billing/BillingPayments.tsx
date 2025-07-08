import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Send,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Transaction {
  id: string;
  patient_name: string;
  patient_id: string;
  transaction_type: 'consultation' | 'procedure' | 'bulk_billing' | 'private_billing';
  item_number: string;
  description: string;
  amount_charged: number;
  medicare_benefit: number;
  patient_contribution: number;
  gap_payment: number;
  payment_status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'written_off';
  payment_method?: 'cash' | 'card' | 'eftpos' | 'bank_transfer' | 'medicare' | 'insurance';
  transaction_date: string;
  due_date?: string;
  paid_date?: string;
  invoice_number: string;
}

interface PaymentSummary {
  total_revenue: number;
  outstanding_amount: number;
  medicare_claims: number;
  private_payments: number;
  overdue_amount: number;
  collection_rate: number;
}

export function BillingPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dateRange, setDateRange] = useState('30d');

  // Mock data
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        patient_name: 'Sarah Johnson',
        patient_id: 'P001',
        transaction_type: 'bulk_billing',
        item_number: '23',
        description: 'General consultation',
        amount_charged: 85.00,
        medicare_benefit: 85.00,
        patient_contribution: 0.00,
        gap_payment: 0.00,
        payment_status: 'paid',
        payment_method: 'medicare',
        transaction_date: '2025-01-15',
        paid_date: '2025-01-15',
        invoice_number: 'INV-2025-001'
      },
      {
        id: '2',
        patient_name: 'Michael Chen',
        patient_id: 'P002',
        transaction_type: 'private_billing',
        item_number: '132',
        description: 'Specialist consultation - Cardiology',
        amount_charged: 250.00,
        medicare_benefit: 150.00,
        patient_contribution: 100.00,
        gap_payment: 100.00,
        payment_status: 'pending',
        transaction_date: '2025-01-14',
        due_date: '2025-01-28',
        invoice_number: 'INV-2025-002'
      },
      {
        id: '3',
        patient_name: 'Emma Wilson',
        patient_id: 'P003',
        transaction_type: 'consultation',
        item_number: '36',
        description: 'Extended consultation',
        amount_charged: 120.00,
        medicare_benefit: 75.00,
        patient_contribution: 45.00,
        gap_payment: 45.00,
        payment_status: 'paid',
        payment_method: 'card',
        transaction_date: '2025-01-12',
        paid_date: '2025-01-12',
        invoice_number: 'INV-2025-003'
      },
      {
        id: '4',
        patient_name: 'Robert Davis',
        patient_id: 'P004',
        transaction_type: 'procedure',
        item_number: '30192',
        description: 'ECG interpretation',
        amount_charged: 65.00,
        medicare_benefit: 45.00,
        patient_contribution: 20.00,
        gap_payment: 20.00,
        payment_status: 'overdue',
        transaction_date: '2025-01-08',
        due_date: '2025-01-15',
        invoice_number: 'INV-2025-004'
      },
      {
        id: '5',
        patient_name: 'Lisa Anderson',
        patient_id: 'P005',
        transaction_type: 'bulk_billing',
        item_number: '23',
        description: 'General consultation',
        amount_charged: 85.00,
        medicare_benefit: 85.00,
        patient_contribution: 0.00,
        gap_payment: 0.00,
        payment_status: 'paid',
        payment_method: 'medicare',
        transaction_date: '2025-01-10',
        paid_date: '2025-01-10',
        invoice_number: 'INV-2025-005'
      }
    ];

    const mockSummary: PaymentSummary = {
      total_revenue: 12450.00,
      outstanding_amount: 2340.00,
      medicare_claims: 8900.00,
      private_payments: 3550.00,
      overdue_amount: 485.00,
      collection_rate: 94.2
    };

    setTransactions(mockTransactions);
    setPaymentSummary(mockSummary);
  }, [dateRange]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.payment_status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      partially_paid: 'bg-blue-100 text-blue-800 border-blue-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      written_off: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      consultation: 'bg-blue-100 text-blue-800',
      procedure: 'bg-purple-100 text-purple-800',
      bulk_billing: 'bg-green-100 text-green-800',
      private_billing: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || colors.consultation;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'partially_paid': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Invoice</span>
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        {paymentSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                  <p className="text-lg font-bold text-blue-900">{formatCurrency(paymentSummary.total_revenue)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">Outstanding</p>
                  <p className="text-lg font-bold text-yellow-900">{formatCurrency(paymentSummary.outstanding_amount)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Medicare Claims</p>
                  <p className="text-lg font-bold text-green-900">{formatCurrency(paymentSummary.medicare_claims)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Private Payments</p>
                  <p className="text-lg font-bold text-purple-900">{formatCurrency(paymentSummary.private_payments)}</p>
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
                  <p className="text-lg font-bold text-red-900">{formatCurrency(paymentSummary.overdue_amount)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-600">Collection Rate</p>
                  <p className="text-lg font-bold text-indigo-900">{paymentSummary.collection_rate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by patient name, invoice number, or description..."
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
              <option value="consultation">Consultation</option>
              <option value="procedure">Procedure</option>
              <option value="bulk_billing">Bulk Billing</option>
              <option value="private_billing">Private Billing</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
              <option value="written_off">Written Off</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{transaction.invoice_number}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.payment_status)}`}>
                      {getStatusIcon(transaction.payment_status)}
                      <span className="ml-1">{transaction.payment_status.replace('_', ' ')}</span>
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{transaction.patient_name} ({transaction.patient_id})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(transaction.transaction_date).toLocaleDateString('en-AU')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>Item {transaction.item_number}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{transaction.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Amount Charged</p>
                      <p className="font-medium text-gray-900">{formatCurrency(transaction.amount_charged)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Medicare Benefit</p>
                      <p className="font-medium text-green-600">{formatCurrency(transaction.medicare_benefit)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Patient Contribution</p>
                      <p className="font-medium text-blue-600">{formatCurrency(transaction.patient_contribution)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gap Payment</p>
                      <p className="font-medium text-orange-600">{formatCurrency(transaction.gap_payment)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(transaction.amount_charged)}
                </div>
                {transaction.payment_method && (
                  <p className="text-sm text-gray-500 capitalize">
                    via {transaction.payment_method}
                  </p>
                )}
                {transaction.due_date && transaction.payment_status !== 'paid' && (
                  <p className={`text-sm ${
                    new Date(transaction.due_date) < new Date() ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Due: {new Date(transaction.due_date).toLocaleDateString('en-AU')}
                  </p>
                )}
                {transaction.paid_date && (
                  <p className="text-sm text-green-600">
                    Paid: {new Date(transaction.paid_date).toLocaleDateString('en-AU')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Transaction ID: {transaction.id}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {transaction.payment_status === 'pending' && (
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark Paid</span>
                  </button>
                )}
                
                {transaction.payment_status === 'overdue' && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <Send className="h-4 w-4" />
                    <span>Send Reminder</span>
                  </button>
                )}
                
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first invoice to get started.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}