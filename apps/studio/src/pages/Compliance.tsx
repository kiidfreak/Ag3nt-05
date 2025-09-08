import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Clock, FileText, Users, TrendingUp } from 'lucide-react';

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  category: 'kyc' | 'aml' | 'sanctions' | 'regulatory';
  description: string;
  lastChecked: string;
  nextCheck: string;
  details: string;
}

interface ComplianceReport {
  id: string;
  title: string;
  type: 'transaction' | 'user' | 'system';
  status: 'approved' | 'rejected' | 'pending' | 'flagged';
  timestamp: string;
  user: string;
  amount?: number;
  currency?: string;
  reason?: string;
}

const Compliance: React.FC = () => {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'reports' | 'settings'>('overview');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    // Simulate loading
    setTimeout(() => {
      setChecks([
        {
          id: 'check-1',
          name: 'KYC Verification',
          status: 'passed',
          category: 'kyc',
          description: 'Identity verification for new users',
          lastChecked: '2025-01-08T10:00:00Z',
          nextCheck: '2025-01-09T10:00:00Z',
          details: 'All user identities verified through government-issued documents',
        },
        {
          id: 'check-2',
          name: 'AML Screening',
          status: 'warning',
          category: 'aml',
          description: 'Anti-money laundering transaction screening',
          lastChecked: '2025-01-08T09:30:00Z',
          nextCheck: '2025-01-08T15:30:00Z',
          details: '3 transactions flagged for manual review',
        },
        {
          id: 'check-3',
          name: 'Sanctions List',
          status: 'passed',
          category: 'sanctions',
          description: 'OFAC and EU sanctions list verification',
          lastChecked: '2025-01-08T08:00:00Z',
          nextCheck: '2025-01-09T08:00:00Z',
          details: 'No matches found in sanctions databases',
        },
        {
          id: 'check-4',
          name: 'Regulatory Compliance',
          status: 'pending',
          category: 'regulatory',
          description: 'GDPR and data protection compliance',
          lastChecked: '2025-01-07T16:00:00Z',
          nextCheck: '2025-01-08T16:00:00Z',
          details: 'Scheduled compliance audit in progress',
        },
      ]);

      setReports([
        {
          id: 'report-1',
          title: 'High-value transaction review',
          type: 'transaction',
          status: 'approved',
          timestamp: '2025-01-08T14:30:00Z',
          user: 'user@example.com',
          amount: 50000,
          currency: 'USD',
          reason: 'Transaction approved after KYC verification',
        },
        {
          id: 'report-2',
          title: 'New user registration',
          type: 'user',
          status: 'flagged',
          timestamp: '2025-01-08T13:45:00Z',
          user: 'newuser@example.com',
          reason: 'Incomplete documentation provided',
        },
        {
          id: 'report-3',
          title: 'Cross-border transfer',
          type: 'transaction',
          status: 'pending',
          timestamp: '2025-01-08T12:15:00Z',
          user: 'trader@example.com',
          amount: 25000,
          currency: 'EUR',
          reason: 'Awaiting additional verification',
        },
        {
          id: 'report-4',
          title: 'System compliance check',
          type: 'system',
          status: 'approved',
          timestamp: '2025-01-08T11:00:00Z',
          user: 'system',
          reason: 'All automated checks passed',
        },
      ]);

      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'warning':
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
      case 'flagged':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kyc':
        return 'bg-blue-100 text-blue-800';
      case 'aml':
        return 'bg-purple-100 text-purple-800';
      case 'sanctions':
        return 'bg-red-100 text-red-800';
      case 'regulatory':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalChecks: checks.length,
    passedChecks: checks.filter(c => c.status === 'passed').length,
    failedChecks: checks.filter(c => c.status === 'failed').length,
    pendingChecks: checks.filter(c => c.status === 'pending').length,
    totalReports: reports.length,
    approvedReports: reports.filter(r => r.status === 'approved').length,
    flaggedReports: reports.filter(r => r.status === 'flagged').length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Compliance Lab
          </h1>
          <p className="text-gray-600">Monitor and manage compliance across your platform</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: TrendingUp },
            { id: 'checks', name: 'Compliance Checks', icon: CheckCircle },
            { id: 'reports', name: 'Reports', icon: FileText },
            { id: 'settings', name: 'Settings', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Checks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalChecks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.passedChecks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.flaggedReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingChecks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Checks Tab */}
      {activeTab === 'checks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {checks.map((check) => (
              <div key={check.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{check.name}</h3>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.status}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(check.category)}`}>
                        {check.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{check.description}</p>
                    <p className="text-sm text-gray-500 mb-4">{check.details}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Last checked: {new Date(check.lastChecked).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>Next check: {new Date(check.nextCheck).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Run Check
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Compliance Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        {report.reason && (
                          <div className="text-sm text-gray-500">{report.reason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.amount ? `${report.amount.toLocaleString()} ${report.currency}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KYC Verification Threshold
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="10000"
                />
                <p className="text-sm text-gray-500 mt-1">Amount in USD requiring KYC verification</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AML Screening Frequency
                </label>
                <select className="input">
                  <option>Real-time</option>
                  <option>Hourly</option>
                  <option>Daily</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-approval Limit
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="1000"
                />
                <p className="text-sm text-gray-500 mt-1">Amount in USD for automatic approval</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableNotifications"
                  className="mr-2"
                />
                <label htmlFor="enableNotifications" className="text-sm text-gray-700">
                  Enable compliance notifications
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
