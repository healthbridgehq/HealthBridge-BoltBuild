import React, { useState } from 'react';
import { 
  Key, 
  Globe, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { IntegrationManager, OAuthHandler } from '../lib/integrationApi';

interface IntegrationSetupProps {
  integration: {
    id: string;
    name: string;
    type: string;
    authMethod: 'oauth' | 'api_key' | 'certificate';
    provider: string;
    description: string;
  };
  onComplete: () => void;
  onCancel: () => void;
}

export function IntegrationSetup({ integration, onComplete, onCancel }: IntegrationSetupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    apiEndpoint: '',
    apiKey: '',
    clientId: '',
    clientSecret: '',
    certificate: '',
    scope: 'read write'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Save configuration temporarily
      await IntegrationManager.saveIntegration({
        id: integration.id,
        name: integration.name,
        type: integration.type,
        apiEndpoint: formData.apiEndpoint,
        authMethod: integration.authMethod,
        credentials: {
          apiKey: formData.apiKey,
          clientId: formData.clientId,
          clientSecret: formData.clientSecret,
          certificate: formData.certificate
        },
        isActive: false // Don't activate until test passes
      });

      const success = await IntegrationManager.testIntegration(integration.id);
      setTestResult(success ? 'success' : 'failed');
      
      if (success) {
        setStep(3);
      } else {
        setError('Connection test failed. Please check your configuration.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
      setTestResult('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSetup = () => {
    try {
      const authUrl = IntegrationManager.setupOAuth(
        integration.id,
        formData.clientId,
        `${window.location.origin}/integrations/oauth/callback`
      );
      
      // Open OAuth flow in popup
      const popup = window.open(
        authUrl,
        'oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if OAuth was successful
          setTimeout(() => {
            setStep(3);
          }, 1000);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth setup failed');
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Activate the integration
      await IntegrationManager.saveIntegration({
        id: integration.id,
        isActive: true
      });
      
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate integration');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Setup {integration.name}
        </h3>
        <p className="text-gray-600">{integration.description}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Security Notice</h4>
            <p className="text-sm text-blue-700 mt-1">
              All credentials are encrypted and stored securely. HealthBridge follows Australian 
              privacy laws and healthcare data protection standards.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Endpoint
          </label>
          <input
            type="url"
            value={formData.apiEndpoint}
            onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
            placeholder="https://api.example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {integration.authMethod === 'api_key' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showSensitiveData ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter your API key"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showSensitiveData ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {integration.authMethod === 'oauth' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                placeholder="Enter OAuth client ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  type={showSensitiveData ? 'text' : 'password'}
                  value={formData.clientSecret}
                  onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                  placeholder="Enter OAuth client secret"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showSensitiveData ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope
              </label>
              <input
                type="text"
                value={formData.scope}
                onChange={(e) => handleInputChange('scope', e.target.value)}
                placeholder="read write"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </>
        )}

        {integration.authMethod === 'certificate' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate (PEM format)
            </label>
            <textarea
              value={formData.certificate}
              onChange={(e) => handleInputChange('certificate', e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----"
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!formData.apiEndpoint || (integration.authMethod === 'api_key' && !formData.apiKey)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Test Connection
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Test Connection
        </h3>
        <p className="text-gray-600">
          We'll test the connection to ensure everything is configured correctly.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Configuration Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{integration.provider}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Endpoint:</span>
            <span className="font-medium">{formData.apiEndpoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Auth Method:</span>
            <span className="font-medium capitalize">{integration.authMethod.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {testResult && (
        <div className={`rounded-lg p-4 ${
          testResult === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {testResult === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={testResult === 'success' ? 'text-green-800' : 'text-red-800'}>
              {testResult === 'success' 
                ? 'Connection successful! Integration is ready to use.' 
                : 'Connection failed. Please check your configuration.'}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        
        {integration.authMethod === 'oauth' ? (
          <button
            onClick={handleOAuthSetup}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <ExternalLink className="h-4 w-4" />
            <span>Authorize with {integration.provider}</span>
          </button>
        ) : (
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Test Connection</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Integration Ready
        </h3>
        <p className="text-gray-600">
          {integration.name} has been successfully configured and tested.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Data synchronization will begin automatically</li>
          <li>• You can monitor sync status in the Integration Hub</li>
          <li>• All data transfers are encrypted and logged for security</li>
          <li>• You can modify settings or disable the integration anytime</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Setup Later
        </button>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Activate Integration</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-0.5 ${
                      step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}