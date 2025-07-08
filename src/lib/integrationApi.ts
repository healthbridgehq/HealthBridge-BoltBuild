import { supabase } from './supabase';

// Types for integration API responses
interface IntegrationConfig {
  id: string;
  name: string;
  type: string;
  apiEndpoint: string;
  authMethod: 'oauth' | 'api_key' | 'certificate';
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    certificate?: string;
  };
  isActive: boolean;
  lastSync?: string;
}

interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: string[];
  duration: number;
}

// Integration API Client
class IntegrationApiClient {
  private config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  // Generic API request handler with authentication
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    
    // Add authentication based on method
    switch (this.config.authMethod) {
      case 'api_key':
        if (this.config.credentials.apiKey) {
          headers.set('Authorization', `Bearer ${this.config.credentials.apiKey}`);
        }
        break;
      case 'oauth':
        if (this.config.credentials.accessToken) {
          headers.set('Authorization', `Bearer ${this.config.credentials.accessToken}`);
        }
        break;
      case 'certificate':
        // Certificate-based auth would be handled at the network level
        break;
    }

    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  // Test connection to the integration
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/health');
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Sync data from the integration
  async syncData(): Promise<SyncResult> {
    const startTime = Date.now();
    let recordsProcessed = 0;
    let recordsSuccessful = 0;
    let recordsFailed = 0;
    const errors: string[] = [];

    try {
      // Implementation varies by integration type
      switch (this.config.type) {
        case 'mhr':
          return await this.syncMHRData();
        case 'pathology':
          return await this.syncPathologyData();
        case 'imaging':
          return await this.syncImagingData();
        case 'pharmacy':
          return await this.syncPharmacyData();
        case 'billing':
          return await this.syncBillingData();
        default:
          throw new Error(`Unsupported integration type: ${this.config.type}`);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
      return {
        success: false,
        recordsProcessed,
        recordsSuccessful,
        recordsFailed: recordsProcessed,
        errors,
        duration: Date.now() - startTime
      };
    }
  }

  // My Health Record integration
  private async syncMHRData(): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccessful = 0;

    try {
      // Get patient list
      const response = await this.makeRequest('/fhir/Patient');
      const data = await response.json();
      
      if (data.entry) {
        recordsProcessed = data.entry.length;
        
        for (const entry of data.entry) {
          try {
            // Process each patient record
            await this.processMHRRecord(entry.resource);
            recordsSuccessful++;
          } catch (error) {
            errors.push(`Failed to process patient ${entry.resource.id}: ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        recordsProcessed,
        recordsSuccessful,
        recordsFailed: recordsProcessed - recordsSuccessful,
        errors,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`MHR sync failed: ${error}`);
    }
  }

  // Pathology lab integration
  private async syncPathologyData(): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccessful = 0;

    try {
      // Get recent lab results
      const response = await this.makeRequest('/hl7/results/recent');
      const data = await response.json();
      
      if (data.results) {
        recordsProcessed = data.results.length;
        
        for (const result of data.results) {
          try {
            await this.processPathologyResult(result);
            recordsSuccessful++;
          } catch (error) {
            errors.push(`Failed to process result ${result.id}: ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        recordsProcessed,
        recordsSuccessful,
        recordsFailed: recordsProcessed - recordsSuccessful,
        errors,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Pathology sync failed: ${error}`);
    }
  }

  // Imaging center integration
  private async syncImagingData(): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccessful = 0;

    try {
      const response = await this.makeRequest('/dicom/studies/recent');
      const data = await response.json();
      
      if (data.studies) {
        recordsProcessed = data.studies.length;
        
        for (const study of data.studies) {
          try {
            await this.processImagingStudy(study);
            recordsSuccessful++;
          } catch (error) {
            errors.push(`Failed to process study ${study.id}: ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        recordsProcessed,
        recordsSuccessful,
        recordsFailed: recordsProcessed - recordsSuccessful,
        errors,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Imaging sync failed: ${error}`);
    }
  }

  // Pharmacy integration
  private async syncPharmacyData(): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccessful = 0;

    try {
      const response = await this.makeRequest('/pbs/dispensing/recent');
      const data = await response.json();
      
      if (data.dispensings) {
        recordsProcessed = data.dispensings.length;
        
        for (const dispensing of data.dispensings) {
          try {
            await this.processPharmacyDispensing(dispensing);
            recordsSuccessful++;
          } catch (error) {
            errors.push(`Failed to process dispensing ${dispensing.id}: ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        recordsProcessed,
        recordsSuccessful,
        recordsFailed: recordsProcessed - recordsSuccessful,
        errors,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Pharmacy sync failed: ${error}`);
    }
  }

  // Billing integration
  private async syncBillingData(): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let recordsProcessed = 0;
    let recordsSuccessful = 0;

    try {
      const response = await this.makeRequest('/medicare/claims/recent');
      const data = await response.json();
      
      if (data.claims) {
        recordsProcessed = data.claims.length;
        
        for (const claim of data.claims) {
          try {
            await this.processBillingClaim(claim);
            recordsSuccessful++;
          } catch (error) {
            errors.push(`Failed to process claim ${claim.id}: ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        recordsProcessed,
        recordsSuccessful,
        recordsFailed: recordsProcessed - recordsSuccessful,
        errors,
        duration: Date.now() - startTime
      };
    } catch (error) {
      throw new Error(`Billing sync failed: ${error}`);
    }
  }

  // Process individual records
  private async processMHRRecord(record: any): Promise<void> {
    // Store MHR record in Supabase
    const { error } = await supabase
      .from('mhr_sync_records')
      .upsert({
        mhr_record_id: record.id,
        record_type: record.resourceType,
        sync_status: 'synced',
        mhr_last_modified: record.meta?.lastUpdated,
        local_last_modified: new Date().toISOString(),
        sync_direction: 'import'
      });

    if (error) throw error;
  }

  private async processPathologyResult(result: any): Promise<void> {
    // Store pathology result in Supabase
    const { error } = await supabase
      .from('pathology_results')
      .upsert({
        lab_reference_number: result.id,
        lab_name: this.config.name,
        collection_date: result.collectionDate,
        reported_date: result.reportedDate,
        test_category: result.category,
        test_name: result.testName,
        result_value: result.value,
        reference_range: result.referenceRange,
        units: result.units,
        abnormal_flag: result.abnormalFlag,
        status: 'final',
        result_data: result
      });

    if (error) throw error;
  }

  private async processImagingStudy(study: any): Promise<void> {
    // Store imaging study information
    // This would typically create a health record entry
    const { error } = await supabase
      .from('health_records')
      .insert({
        record_type: 'imaging',
        content: {
          studyId: study.id,
          modality: study.modality,
          bodyPart: study.bodyPart,
          studyDate: study.date,
          findings: study.findings
        },
        encrypted_content: JSON.stringify(study), // Would be properly encrypted
        is_shared: false
      });

    if (error) throw error;
  }

  private async processPharmacyDispensing(dispensing: any): Promise<void> {
    // Update prescription status
    const { error } = await supabase
      .from('prescriptions')
      .update({
        status: 'dispensed',
        dispensed_date: dispensing.dispensedDate
      })
      .eq('prescription_number', dispensing.prescriptionNumber);

    if (error) throw error;
  }

  private async processBillingClaim(claim: any): Promise<void> {
    // Store billing transaction
    const { error } = await supabase
      .from('financial_transactions')
      .insert({
        transaction_type: 'bulk_billing',
        item_number: claim.itemNumber,
        description: claim.description,
        amount_charged: claim.amount,
        medicare_benefit: claim.benefit,
        patient_contribution: claim.patientContribution,
        payment_status: claim.status,
        transaction_date: claim.date
      });

    if (error) throw error;
  }
}

// OAuth flow handler
export class OAuthHandler {
  private clientId: string;
  private redirectUri: string;
  private scope: string;

  constructor(clientId: string, redirectUri: string, scope: string = 'read') {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scope = scope;
  }

  // Generate OAuth authorization URL
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state
    });

    return `https://auth.example.com/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, clientSecret: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch('https://auth.example.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    return await response.json();
  }

  // Refresh access token
  async refreshToken(refreshToken: string, clientSecret: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch('https://auth.example.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return await response.json();
  }
}

// Integration manager
export class IntegrationManager {
  // Get all configured integrations
  static async getIntegrations(): Promise<IntegrationConfig[]> {
    const { data, error } = await supabase
      .from('external_integrations')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    return data.map(integration => ({
      id: integration.id,
      name: integration.integration_name,
      type: integration.integration_type,
      apiEndpoint: integration.api_endpoint || '',
      authMethod: integration.configuration?.authMethod || 'api_key',
      credentials: integration.configuration?.credentials || {},
      isActive: integration.is_active,
      lastSync: integration.last_sync_at
    }));
  }

  // Save integration configuration
  static async saveIntegration(config: Partial<IntegrationConfig>): Promise<void> {
    const { error } = await supabase
      .from('external_integrations')
      .upsert({
        integration_name: config.name,
        integration_type: config.type,
        api_endpoint: config.apiEndpoint,
        configuration: {
          authMethod: config.authMethod,
          credentials: config.credentials
        },
        is_active: config.isActive
      });

    if (error) throw error;
  }

  // Test integration connection
  static async testIntegration(integrationId: string): Promise<boolean> {
    const integrations = await this.getIntegrations();
    const integration = integrations.find(i => i.id === integrationId);
    
    if (!integration) {
      throw new Error('Integration not found');
    }

    const client = new IntegrationApiClient(integration);
    return await client.testConnection();
  }

  // Sync data from integration
  static async syncIntegration(integrationId: string): Promise<SyncResult> {
    const integrations = await this.getIntegrations();
    const integration = integrations.find(i => i.id === integrationId);
    
    if (!integration) {
      throw new Error('Integration not found');
    }

    const client = new IntegrationApiClient(integration);
    const result = await client.syncData();

    // Log the sync operation
    await supabase
      .from('integration_logs')
      .insert({
        integration_id: integrationId,
        sync_type: 'manual',
        operation: 'sync',
        status: result.success ? 'completed' : 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        execution_time_ms: result.duration,
        error_details: result.errors.length > 0 ? { errors: result.errors } : null
      });

    return result;
  }

  // Setup OAuth flow
  static setupOAuth(integrationId: string, clientId: string, redirectUri: string): string {
    const handler = new OAuthHandler(clientId, redirectUri);
    const state = `${integrationId}-${Date.now()}`;
    
    // Store state for verification
    sessionStorage.setItem(`oauth_state_${integrationId}`, state);
    
    return handler.generateAuthUrl(state);
  }

  // Complete OAuth flow
  static async completeOAuth(integrationId: string, code: string, state: string, clientSecret: string): Promise<void> {
    const storedState = sessionStorage.getItem(`oauth_state_${integrationId}`);
    
    if (storedState !== state) {
      throw new Error('Invalid OAuth state');
    }

    const handler = new OAuthHandler('client_id', 'redirect_uri');
    const tokens = await handler.exchangeCodeForToken(code, clientSecret);

    // Save tokens securely
    await this.saveIntegration({
      id: integrationId,
      credentials: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      }
    });

    // Clean up
    sessionStorage.removeItem(`oauth_state_${integrationId}`);
  }
}